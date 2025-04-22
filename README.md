# theo-flutter-actions
Centralisation des github actions pour les projets flutteurs

## Actions disponibles

### 🧪 test

Installe Flutter et exécute :
- flutter pub get
- flutter analyze
- flutter test

```yaml
- uses: theobernardon/theo-flutter-actions/test@main
```

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

