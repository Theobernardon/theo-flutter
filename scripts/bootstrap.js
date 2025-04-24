// .github/scripts/bootstrap.js
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = process.env.REPO_NAME;
const REPO_OWNER = process.env.REPO_OWNER;

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
  const project = await graphql(
    `
    mutation ($owner: ID!, $title: String!) {
      createProjectV2(input: {
        ownerId: $owner,
        title: $title
      }) {
        projectV2 {
          id
          title
        }
      }
    }
    `,
    {
      owner: (await graphql(`
        query {
          repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
            owner {
              id
            }
          }
        }
      `)).repository.owner.id,
      title: REPO_NAME
    }
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
        projectV2Field {
          id
        }
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
          singleSelectOption {
            id
            name
          }
        }
      }
      `,
      { fieldId, name }
    );
    const opt = result.updateProjectV2SingleSelectField.singleSelectOption;
    optionIds[opt.name] = opt.id;
    console.log(`✅ Option ajoutée : ${opt.name}`);
  }

  const config = {
    projectId,
    fieldId,
    options: optionIds,
  };

  console.log("➡️ Écriture du fichier de config : project-config.json");
  fs.writeFileSync("project-config.json", JSON.stringify(config, null, 2));

  console.log("➡️ Téléchargement des templates theo-flutter...");
  const platforms = process.env.PLATFORMS.split(",").map(p => p.trim());

  console.log("➡️ Téléchargement des templates theo-flutter pour les plateformes :", platforms);

  fs.mkdirSync(".github/workflows", { recursive: true });

  for (const platform of platforms) {
    const file = `build-${platform}.yml`;
    const url = `https://raw.githubusercontent.com/theobernardon/theo-flutter/main/templates/${file}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur lors du téléchargement de ${file}`);
      const content = await res.text();
      fs.writeFileSync(path.join(".github/workflows", file), content);
      console.log(`✅ Fichier importé : ${file}`);
    } catch (error) {
      console.error(`❌ Impossible d'importer ${file} :`, error.message);
    }
  }

  console.log("✅ Bootstrap terminé !");
})();
