# Générateur de projet Flutter + Workflows CI/CD

Ce dépôt contient :

1. **`new_flutter_project.ipynb`** : Notebook Jupyter pour créer et configurer un nouveau projet Flutter
2. **Workflows GitHub Actions réutilisables** : CI/CD optimisés pour Flutter (builds, tests, releases)
3. **Documentation complète**: guides d’utilisation et détails techniques

---

## 🎨 Générateur de Projet Flutter

Les diagrammes présents dans [`_Document`](./_Document) illustrent l’organisation GitHub/Git adoptée et la place de ce générateur dans la gestion de projet.

![Schéma CI/CD](./_Document/Projet%20CICD%20sombre.drawio.png)

Ce schéma détaille les différentes étapes de l’intégration continue (tests et builds) ainsi que celles du déploiement continu (création d’une release puis mise à disposition des artefacts). Il fournit un aperçu global du pipeline configuré par les workflows décrits ci-dessous.

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

![Schéma CI/CD](./_Document/cycle%20de%20vie%20des%20branches%20darck.drawio.png)

- `main` : reçoit uniquement les hotfix et les pull requests de release.
- `develop` : branche de travail sur laquelle sont fusionnées les branches `fix` et `feat` jusqu’à obtention d’une version stable.
- `release/*` : préparation d’une version stable avant intégration dans `main`.
- Les branches `hotfix/*` corrigent les versions en `release` ou directement sur `main`.

## Automatisations principales

Le notebook met en place plusieurs automatisations :

- **Workflows GitHub Actions** pour tester, builder et publier l’application.
- **Templates d’issues** (feature, subfeature, bug, fix, hotfix, documentation) afin d’uniformiser la création des tickets.
- **Scripts de mise à jour de version** et génération de `CHANGELOG.md`.
- **Configuration d’Inno Setup** pour créer un installateur Windows lorsque la plateforme `windows` est sélectionnée.

Ces automatisations facilitent la gestion du cycle de vie de l’application Flutter et la collaboration au sein de votre équipe.

## Workflows CI/CD

Les fichiers de workflow se trouvent dans [`.github/workflows`](./.github/workflows) et reposent sur des actions personnalisées situées dans [`.github/actions`](./.github/actions).

### `test-flutter.yml`

Workflow réutilisable réalisant l’analyse statique du projet puis l’exécution des tests unitaires. Il peut être appelé depuis d’autres workflows pour garantir la qualité du code avant toute étape de build ou de déploiement.

### `builds.yml`

Déclenché avec une liste de plateformes et un mode (`debug` ou `release`), il installe Flutter, prépare l’environnement via l’action `pre-steps-spe-platform`, compile l’application grâce à `flutter-build` et archive les artefacts à l’aide de `package-builds-release`.

### `release.yml`

Récupère les artefacts produits par `builds.yml` et crée la release GitHub correspondante à la version passée en paramètre. Un token GitHub est nécessaire pour publier la release.

### `majdevelop.yml`

Synchronise automatiquement la branche `develop` avec `main`. En cas de conflit lors du merge, une pull request est ouverte pour permettre une résolution manuelle.

### `majpubspec.yml`

Incrémente la version déclarée dans `pubspec.yaml` (mineure sur une branche `release`, patch sur une branche `hotfix`), génère le `CHANGELOG.md` puis pousse la modification.

### `tag-version.yml`

Lit la version actuelle dans `pubspec.yaml`, vérifie l’absence du tag associé sur le dépôt et crée ce tag sur `main`.

---

Exécutez chaque cellule dans l’ordre pour obtenir un projet entièrement prêt à être versionné, buildé et publié sur GitHub !
