import os
import yaml

DIR = ".github\\ISSUE_TEMPLATE"


def edit_yaml_files(number_projet, personas=None, directory=DIR):
    yaml_files = [
        f
        for f in os.listdir(directory)
        if f.endswith((".yaml", ".yml")) & (not f.startswith("."))
    ]

    # itération sur les fichiers YAML
    for filename in yaml_files:
        filepath = os.path.join(directory, filename)
        print(f"Modification du fichier : {filename}")

        # Import du fichier Yaml
        with open(filepath, "r", encoding="utf-8") as file:
            data = yaml.safe_load(file)

        # Modification du nombre du projet
        if bool(number_projet):
            data["projects"] = data["projects"].replace(
                "Projet_number", str(number_projet)
            )

        # Modification des personas
        if bool(personas):
            if "options" in data["body"][0]["attributes"].keys():
                data["body"][0]["attributes"]["options"] = personas
                print("Personas ajoutées.")

        # save yml
        with open(filepath, "w", encoding="utf-8") as file:
            yaml.dump(data, file, sort_keys=False, allow_unicode=True)


if __name__ == "__main__":
    print()
    EDIT = input("Que voulez vous éditer (projet / personas / all) : ")

    # Demande du numéro de projet
    if EDIT == "projet" or EDIT == "all":
        print()
        NUMBER_PROJET = input("Entrez le n° du projet : ")
    else:
        NUMBER_PROJET = None

    # Récupération des personas
    if EDIT == "personas" or EDIT == "all":
        # Import du fichier Yaml
        with open(DIR + "\\.personas.yml", "r", encoding="utf-8") as file:
            PERSONAS = yaml.safe_load(file)["personas"]
    else:
        PERSONAS = None

    edit_yaml_files(NUMBER_PROJET, PERSONAS)
