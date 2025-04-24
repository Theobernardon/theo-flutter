// .github/scripts/bootstrap.js
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = process.env.REPO_NAME;
const REPO_OWNER = process.env.REPO_OWNER;
const SELECTED_PLATFORMS = process.env.PLATFORMS || "android,web";

const graphql = async (query, variables = {}) => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
};

(async () => {
  console.log("➡️ Création du projet GitHub Projects v2...");
  const ownerQuery = await graphql(`
    query {
      repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
        owner { id }
      }
    }
  `);
  const ownerId = ownerQuery.repository.owner.id;

  const project = await graphql(
    `
    mutation ($ownerId: ID!, $title: String!) {
      createProjectV2(input: {
        ownerId: $ownerId,
        title: $title
      }) {
        projectV2 { id title }
      }
    }
    `,
    { ownerId, title: REPO_NAME }
  );

  const projectId = project.createProjectV2.projectV2.id;

  console.log("✅ Projet créé :", project.createProjectV2.projectV2.title);

  console.log("➡️ Création du champ `Statut`...");
  const field = await graphql(
    `
    mutation ($projectId: ID!) {
      addProjectV2Field(input: {
        projectId: $projectId,
        name: "Statut",
        dataType: SINGLE_SELECT
      }) {
        projectV2Field { id }
      }
    }
    `,
    { projectId }
  );

  const fieldId = field.addProjectV2Field.projectV2Field.id;

  console.log("➡️ Ajout des options au champ `Statut`...");
  const options = ["Todo", "In Progress", "In Test", "Done"];
  const optionIds = {};
  for (const name of options) {
    const result = await graphql(
      `
      mutation ($fieldId: ID!, $name: String!) {
        updateProjectV2SingleSelectField(input: {
          fieldId: $fieldId,
          name: $name
        }) {
          singleSelectOption { id name }
        }
      }
      `,
      { fieldId, name }
    );
    const opt = result.updateProjectV2SingleSelectField.singleSelectOption;
    optionIds[opt.name] = opt.id;
    console.log(`✅ Option ajoutée : ${opt.name}`);
  }

  fs.writeFileSync(
    "project-config.json",
    JSON.stringify({ projectId, fieldId, options: optionIds }, null, 2)
  );
  console.log("✅ Fichier project-config.json généré");

  console.log("➡️ Import des workflows de build sélectionnés...");
  const platforms = SELECTED_PLATFORMS.split(",").map(p => p.trim());
  const workflowsDir = path.join(".github", "workflows", "build");
  fs.mkdirSync(workflowsDir, { recursive: true });

  for (const platform of platforms) {
    const url = `https://raw.githubusercontent.com/theobernardon/theo-flutter/main/templates/build/${platform}.yml`;
    const res = await fetch(url);
    const content = await res.text();
    const outPath = path.join(workflowsDir, `${platform}.yml`);
    fs.writeFileSync(outPath, content);
    console.log(`✅ Fichier importé : build/${platform}.yml`);
  }

  console.log("✅ Bootstrap terminé !");
})();
