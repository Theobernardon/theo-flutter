# theo-flutter-actions

Centralisation des GitHub Actions et workflows pour les projets Flutter.

Ce dépôt contient à la fois :

- des **actions modulaires** (`test`, `build`, `manage-issues`) utilisables dans tous tes projets Flutter
- des **workflows réutilisables** pour automatiser des étapes clés comme les releases

---

## 📂 Structure du dépôt

| Dossier                      | Rôle                                                        |
|------------------------------|-------------------------------------------------------------|
| `actions/test/`              | Tests automatiques (`flutter test`, `analyze`, etc.)        |
| `actions/build/<platform>/`  | Build spécifique à une plateforme (`android`, `web`, etc.)  |
| `actions/manage-issues/`     | Gestion d’issues via `/open`, `/test`, `/close`            |
| `.github/workflows/`         | Workflows réutilisables (`release.yml`, etc.)              |

---

## ✅ Actions disponibles (`actions/`)

### 🧪 test

Installe Flutter et exécute :
- `flutter pub get`
- `flutter analyze`
- `flutter test`

```yaml
- uses: theobernardon/theo-flutter-actions/actions/test@main
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
- uses: theobernardon/theo-flutter-actions/actions/build/<platform>@main
  with:
    flutter-version: "stable" # Optionnel, par défaut "stable"
```

#### Exemple concret :

```yaml
- uses: theobernardon/theo-flutter-actions/actions/build/android@main
```

---

### 🧠 manage-issues

Automatise la gestion des issues à partir de commentaires GitHub :

| Commande | Action                             |
|----------|------------------------------------|
| `/open`  | Déplace l’issue dans "In Progress" |
| `/test`  | Déplace l’issue dans "In Test"     |
| `/close` | Ferme l’issue et la passe dans "Done" |

```yaml
- uses: theobernardon/theo-flutter-actions/actions/manage-issues@main
  with:
    project-name: "NomDeTonProjet"
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
    uses: theobernardon/theo-flutter-actions/.github/workflows/release.yml@main
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
