import os
from PIL import Image

# importation des images
if os.path.isfile("app_icon.png"):
    app_icon = Image.open("app_icon.png")
elif os.path.isfile("app_icon.ico"):
    app_icon = Image.open("app_icon.ico")
else:
    raise FileNotFoundError("app_icon.png or app_icon.ico not found.")
setup_overlay = Image.open("setup_overlay.png")
uninstall_overlay = Image.open("uninstall_overlay.png")

# Redimensionnement de l'image app_icon
app_icon = app_icon.resize((256, 256))

## setup_overlay ##
# Copie de l'image app_icon pour la superposition
setup_icon = app_icon.copy()
# Superposition de setup_overlay sur app_icon copy
setup_icon.paste(setup_overlay, (160, 160), setup_overlay)

## uninstall_overlay ##
# Copie de l'image app_icon pour la superposition
uninstall_icon = app_icon.copy()
# Superposition de uninstall_overlay sur app_icon copy
uninstall_icon.paste(uninstall_overlay, (160, 160), uninstall_overlay)

# Export en ICO
setup_icon.save(
    "setup_icon.ico",
    format="ICO",
)
app_icon.save(
    "app_icon.ico",
    format="ICO",
)
uninstall_icon.save(
    "uninstall_icon.ico",
    format="ICO",
)
