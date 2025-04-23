const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // 🧾 Récupération des entrées définies dans action.yml
    const projectName = core.getInput('project-name');
    const columnOpen = core.getInput('column-open');
    const columnTest = core.getInput('column-test');
    const columnClose = core.getInput('column-close');

    // 🔐 Récupération du token d'authentification et initialisation d'Octokit
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);

    // 📦 Infos sur le repo (owner et nom)
    const { owner, repo } = github.context.repo;

    // 📝 Liste des commits dans ce push
    const commits = github.context.payload.commits;

    // 🗂 Dictionnaire de correspondance entre action et colonne
    const columnMap = {
      open: columnOpen,
      test: columnTest,
      close: columnClose,
    };

    // 🔁 Parcours de chaque commit
    for (const commit of commits) {
      const message = commit.message;

      // 🧠 Recherche des instructions type "open #12", "close #8", etc.
      const regex = /(open|test|close)\s+#(\d+)/gi;
      let match;

      while ((match = regex.exec(message)) !== null) {
        const action = match[1];           // open, test, close
        const issueNumber = match[2];      // numéro d'issue
        core.info(`🧠 ${action.toUpperCase()} command found for issue #${issueNumber}`);

        // 📋 Récupère tous les projets attachés à ce repo
        const { data: projects } = await octokit.rest.projects.listForRepo({
          owner,
          repo,
        });

        // 🔍 On cherche le projet par nom
        const project = projects.find(p => p.name === projectName);
        if (!project) {
          core.warning(`❌ Project '${projectName}' not found`);
          continue;
        }

        // 🧱 Récupère toutes les colonnes de ce projet
        const { data: columns } = await octokit.rest.projects.listColumns({
          project_id: project.id,
        });

        // 🎯 Trouve la colonne correspondant à l'action (In Progress, In Test, etc.)
        const targetColumn = columns.find(c => c.name === columnMap[action]);
        if (!targetColumn) {
          core.warning(`❌ Column '${columnMap[action]}' not found in project '${projectName}'`);
          continue;
        }

        // 🔄 Parcours toutes les colonnes pour retrouver la carte liée à l’issue
        let cardFound = false;
        for (const column of columns) {
          const { data: cards } = await octokit.rest.projects.listCards({
            column_id: column.id,
            archived_state: "not_archived"
          });

          // 🎯 Si une carte correspond à l'issue (via content_url), on la déplace
          for (const card of cards) {
            if (card.content_url && card.content_url.includes(`/issues/${issueNumber}`)) {
              core.info(`📦 Found issue #${issueNumber} in column '${column.name}', moving to '${targetColumn.name}'`);
              await octokit.rest.projects.moveCard({
                card_id: card.id,
                position: "top",
                column_id: targetColumn.id,
              });
              cardFound = true;
              break;
            }
          }
          if (cardFound) break;
        }

        // ❗ Si aucune carte liée à cette issue n’est trouvée
        if (!cardFound) {
          core.warning(`⚠️ No card found for issue #${issueNumber}`);
        }
      }
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
