# theo-flutter-actions
Centralisation des github actions pour les projets flutteurs

## Actions disponibles

### 🧠 manage-issues

Automatise la gestion des issues et leur positionnement dans un projet GitHub à partir de commentaires saisis directement dans les issues.

#### Commandes supportées :
- `/open` → Déplace l'issue dans la colonne **In Progress**
- `/test` → Déplace l'issue dans la colonne **In Test**
- `/close` → Ferme l'issue et la déplace dans la colonne **Done**

#### Paramètres :
- `project-name` : nom exact du projet GitHub (classique) lié au dépôt
- `column-open` : (optionnel, par défaut `"In Progress"`)
- `column-test` : (optionnel, par défaut `"In Test"`)
- `column-close` : (optionnel, par défaut `"Done"`)

#### Exemple d’utilisation :

```yaml
name: Gérer les commentaires d’issues

on:
  issue_comment:
    types: [created]

jobs:
  manage:
    if: github.event.issue.pull_request == null
    runs-on: ubuntu-latest
    steps:
      - uses: theobernardon/theo-flutter-actions/manage-issues@main
        with:
          project-name: "NomExactDeTonProjet"
          column-open: "In Progress"
          column-test: "In Test"
          column-close: "Done"
```

> 💡 Cette action fonctionne uniquement avec les **projets GitHub classiques (Projects v1)** liés au dépôt. Elle ne prend pas encore en charge les projets Beta (v2).

---

### 🧪 test

Installe Flutter et exécute :
- flutter pub get
- flutter analyze
- flutter test

```yaml
- uses: theobernardon/theo-flutter-actions/test@main
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

#### Utilisation général :

Pour compiler une application Flutter pour `<plateforme>`, utilisez la syntaxe suivante :

```yaml
- uses: theobernardon/theo-flutter-actions/build-<plateforme>@main
  with:
    flutter-version: "stable" # Optionnel, par défaut "stable"
```

#### Exemple concret :

Pour compiler une application Flutter pour Android :

```yaml
- uses: theobernardon/theo-flutter-actions/build-android@main
  with:
    flutter-version: "stable"
```

