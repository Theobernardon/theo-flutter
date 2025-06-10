# Générateur de projet Flutter

Ce dépôt contient **`new_flutter_project.ipynb`**, un notebook Jupyter permettant d’automatiser la création et la configuration d’un nouveau projet Flutter.

Les diagrammes présents dans [`_Document`](./_Document) illustrent l’organisation GitHub/Git adoptée et la place de ce générateur dans la gestion de projet.

## Prérequis

Installez les dépendances suivantes :

- Flutter
- Git
- GitHub CLI
- Python 3.10
- Paquet Python : `pyyaml`

## Étapes de création

1. **Renseigner les variables globales** dans la première cellule de code du notebook :
   - `PROJET_NAME` : nom du projet (snake_case).
   - `PLATFORMS` : plateformes ciblées (`linux`, `windows`, `macos`, `apk`, `ios`, `web`…).
   - `DESCRIPTION` : description du projet.
   - `CHEMIN_RACINE` : dossier où le projet sera créé.
   - `ORGANISATION`/`USER` : informations GitHub.
   - Ajustez si besoin les variables de configuration (chemin vers Flutter, dossiers, etc.).
2. **Exécuter l’ensemble des cellules** du notebook pour :
   - Créer le projet Flutter avec `flutter create`.
   - Initialiser le dépôt Git local.
   - Générer l’arborescence `.github`, `assets`, `images`, etc.
   - Mettre en place les workflows CI/CD et les templates d’issues.
   - Préparer la génération des icônes et l’installateur Windows (optionnel).
   - Créer le dépôt GitHub associé, configurer les labels et créer les branches principales (`release/vX.X.X`, `develop`).
3. **Si vous utilisez GitHub Projects**, récupérez le numéro du projet et exécutez le script [`resources/issue_template/Projet_number_edit.py`](./resources/issue_template/Projet_number_edit.py) pour lier automatiquement vos issues au bon projet.
4. **Générez les icônes** en suivant les indications de la section « Gestion des icônes » du notebook.

## Stratégie Git/GitHub

- `main` : reçoit uniquement les hotfix et les pull requests de release.
- `develop` : branche de travail sur laquelle sont fusionnées les branches `fix` et `feat` jusqu’à obtention d’une version stable.
- `release/*` : préparation d’une version stable avant intégration dans `main`.
- Les branches `hotfix/*` corrigent les versions en `release` ou directement sur `main`.

## Automatisations principales

Le notebook met en place plusieurs automatisations :

- **Workflows GitHub Actions** pour tester, builder et publier l’application.
- **Templates d’issues** (feature, subfeature, bug, fix, hotfix, documentation) afin d’uniformiser la création des tickets.
- **Scripts de mise à jour de version** et génération de `CHANGELOG.md`.
- **Configuration d’Inno Setup** pour créer un installateur Windows lorsque la plateforme `windows` est sélectionnée.

Ces automatisations facilitent la gestion du cycle de vie de l’application Flutter et la collaboration au sein de votre équipe.

---

Exécutez chaque cellule dans l’ordre pour obtenir un projet entièrement prêt à être versionné, buildé et publié sur GitHub !
