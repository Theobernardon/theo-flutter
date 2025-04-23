# theo-flutter

Centralisation des GitHub Actions et workflows pour les projets Flutter.

Ce dépôt contient à la fois :

- des **actions modulaires** (`test`, `build`, `manage-issues`) utilisables dans tous tes projets Flutter
- des **workflows réutilisables** pour automatiser des étapes clés comme les releases

---

## 📂 Structure du dépôt

| Dossier                      | Rôle                                                        |
|------------------------------|-------------------------------------------------------------|
| `actions/manage-issues/`     | Gestion d’issues via `/open`, `/test`, `/close`            |
| `actions/test/`              | Tests automatiques (`flutter test`, `analyze`, etc.)        |
| `actions/build/<platform>/`  | Build spécifique à une plateforme (`android`, `web`, etc.)  |
| `.github/workflows/`         | Workflows réutilisables (`release.yml`, etc.)              |

---

## ✅ Actions disponibles (`actions/`)

### 🔁 manage-issues-by-commit

Automatise le déplacement des issues dans un **GitHub Project** en analysant les **messages de commit**.

#### Format attendu du commit :

```text
open #12        → déplace l'issue #12 dans "In Progress"
test #5         → déplace l'issue #5 dans "In Test"
close #8        → déplace l'issue #8 dans "Done"
skipcheck: ...  → bypass des vérifications
```

> Le commit doit commencer par une instruction `open|test|close #num`.  
> Utilisez `skipcheck:` pour éviter la vérification du hook Git local si nécessaire.


#### Exemple d'intégration dans `.github/workflows/project.yml` :

```yaml
name: 🔄 Sync issues depuis les commits

on:
  push:

jobs:
  manage-issues:
    runs-on: ubuntu-latest
    steps:
      - uses: theobernardon/theo-flutter/actions/manage-issues-by-commit@main
        with:
          project-name: "CI/CD Workflow"
          column-open: "In Progress"
          column-test: "In Test"
          column-close: "Done"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```


✅ Cette action :
- 🔍 Analyse tous les messages de commit du `push`
- 🔗 Détecte les instructions `open|test|close #num`
- 🗃️ Trouve la carte liée dans ton Project GitHub
- 🚚 Déplace automatiquement l’issue dans la bonne colonne

### 🧪 test

Installe Flutter et exécute :
- `flutter pub get`
- `flutter analyze`
- `flutter test`

```yaml
- uses: theobernardon/theo-flutter/actions/test@main
```

---

### 📦 build

Compile l'application Flutter pour une plateforme spécifique.

#### Plateformes supportées :
- `android`
- `web`
- `windows`
- `linux`
- `macos` (nécessite une machine macOS)
- `ios` (nécessite une machine macOS avec Xcode)

#### Utilisation générale :

```yaml
- uses: theobernardon/theo-flutter/actions/build/<platform>@main
  with:
    flutter-version: "stable" # Optionnel, par défaut "stable"
```

#### Exemple concret :

```yaml
- uses: theobernardon/theo-flutter/actions/build/android@main
```

---

## 🔁 Workflows réutilisables (`.github/workflows/`)

### 🚀 release.yml

Déclenche automatiquement les builds Flutter et publie une **release GitHub**, en fonction des plateformes définies dans un fichier `build.yml`.

#### Exemple de `build.yml` :

```yaml
build:
  platforms:
    - android
    - web
    - windows
```

#### Intégration dans un projet Flutter :

```yaml
name: 📦 Release Flutter

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    uses: theobernardon/theo-flutter/.github/workflows/release.yml@main
```

### Ce que fait ce workflow :

- 📖 Lit le fichier `build.yml`
- 🏗️ Déclenche les builds correspondants (via `actions/build/<platform>/`)
- 📦 Crée une **Release GitHub** avec tous les artefacts générés

---

## ✅ Avantages

- Architecture modulaire et maintenable
- Actions simples, claires et documentées
- Reuse complet sans duplication
- Adapté à une CI/CD Flutter multiplateforme professionnelle

---

> 🧪 Pour tester : ajoute un `build.yml` à la racine d’un projet Flutter, pousse un tag (`v1.0.0`) et regarde la magie opérer ✨
