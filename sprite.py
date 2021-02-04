from PIL import Image
from glob import glob
from math import sqrt, ceil
import os
import json
import jinja2
import shutil

# Cleanup
shutil.rmtree("src/assets", True)
os.mkdir("src/assets")

flag_paths = glob("flags/*.png")

# padding between each column/row in the sprite.
# https://stackoverflow.com/questions/646901/do-i-still-need-to-pad-images-in-a-css-sprite
PADDING = 4

# Here, we assume that all images have the same size
# and we calculate the dimensions of the generated sprite.
flag_width, flag_height = Image.open(flag_paths[0]).size
num_rows = int(sqrt(len(flag_paths)))
num_cols = ceil(len(flag_paths) / num_rows)

# The full sprite image object.
sprite = Image.new(
    "RGBA",
    (
        flag_width * num_cols + PADDING * (num_cols - 1),
        flag_height * num_rows + PADDING * (num_rows - 1),
    ),
)

# This default flag will be used if a certain country code does not have a corresponding flag in the sprite.
try:
    # On Linux
    flag_paths.remove("flags/default.png")
except ValueError:
    # On Windows
    flag_paths.remove("flags\\default.png")
sprite.paste(Image.open("flags/default.png"), (0, 0))

# Filling columns from top to bottom, and from left to right.
flag_positions = {}
for index, path in enumerate(flag_paths, 1):
    x = (flag_width + PADDING) * (index // num_rows)
    y = (flag_height + PADDING) * (index % num_rows)
    country_code = os.path.basename(path).split(".")[0]

    flag = Image.open(path)
    sprite.paste(flag, (x, y))
    flag.close()
    flag_positions[country_code] = {"x": x, "y": y}

# generating the jss object that will be used in the withStyles hook.
# To support retina displays, the sprite actually has double the size,
# so we'll use half the values.
jss = {
    country_code: {
        "backgroundPosition": [[-position["x"] // 2, -position["y"] // 2]],
    }
    for country_code, position in flag_positions.items()
}

jss["flag"] = {
    "backgroundRepeat": "no-repeat",
    "backgroundSize": [[sprite.size[0] // 2, sprite.size[1] // 2]],
    "width": flag_width // 2,
    "height": flag_height // 2,
    "display": "inline-block",
    "overflow": "hidden",
    "position": "relative",
    "boxSizing": "content-box",
}

compensation = (flag_width // 2 - flag_height // 2) // 2
jss["compensate"] = {
    "marginTop": compensation,
    "marginBottom": compensation,
}

with open("src/assets/sprite.jss.json", "w") as file:
    json.dump(jss, file, indent=2)
    print("Generated src/assets/sprite.jss.json")

# Quantize the result sprite to reduce its size then save it.
sprite.quantize().save("src/assets/sprite_x2.png")
print("Generated src/assets/sprite_x2.png")
sprite.resize((sprite.size[0] // 2, sprite.size[1] // 2)).quantize().save("src/assets/sprite_x1.png")
print("Generated src/assets/sprite_x1.png")
