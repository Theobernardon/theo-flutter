import os
import yaml

NUMBER_PROJET = input("Entrez le n° du projet : ")
DIR = ".github\\ISSUE_TEMPLATE"


def edit_yaml_files(number_projet, directory=DIR):
    yaml_files = [f for f in os.listdir(directory) if f.endswith((".yaml", ".yml"))]

    # itération sur les fichiers YAML
    for filename in yaml_files:
        filepath = os.path.join(directory, filename)

        # Import du fichier Yaml
        with open(filepath, "r", encoding="utf-8") as file:
            data = yaml.safe_load(file)

        # Modification du nombre du projet
        data["projects"] = data["projects"].replace("Projet_number", str(number_projet))

        # save yml
        with open(filepath, "w", encoding="utf-8") as file:
            yaml.dump(data, file, sort_keys=False, allow_unicode=True)


if __name__ == "__main__":
    edit_yaml_files(NUMBER_PROJET)
