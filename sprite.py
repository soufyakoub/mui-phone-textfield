from PIL import Image
from glob import glob
from math import sqrt, ceil
import os
import json
import jinja2

flag_paths = glob("flags/*.png")

# padding between each column/row in the sprite.
# https://stackoverflow.com/questions/646901/do-i-still-need-to-pad-images-in-a-css-sprite
padding = 4

# Here, we assume that all images have the same size
# and we calculate the dimensions of the generated sprite.
flag_width, flag_height = Image.open(flag_paths[0]).size
num_rows = int(sqrt(len(flag_paths)))
num_cols = ceil(len(flag_paths) / num_rows)

# The full sprite image object.
sprite = Image.new(
    "RGBA",
    (
        flag_width * num_cols + padding * (num_cols - 1),
        flag_height * num_rows + padding * (num_rows - 1),
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

# We'll collect flag positions in the sprite image so we can generate the corresponding CSS classes later.
flag_positions = {}

# Filling columns from top to bottom, and from left to right.
for index, path in enumerate(flag_paths, 1):
    x = (flag_width + padding) * (index // num_rows)
    y = (flag_height + padding) * (index % num_rows)
    country_code = os.path.basename(path).split(".")[0]

    flag = Image.open(path)
    sprite.paste(flag, (x, y))
    flag.close()
    flag_positions[country_code] = {"x": x, "y": y}

# Generating the sprite's corresponding css classes.
loader = jinja2.FileSystemLoader("./")
env = jinja2.Environment(loader=loader)
template = env.get_template("src/sprite.css.jinja")

# We will pass half the values to the css template,
# because to support retina displays,
# the sprite actually has double the size.
css = template.render(
    {
        "sprite": {
            "path": "sprite.png",  # The sprite's relative path from the src directory.
            "width": sprite.size[0] // 2,
            "height": sprite.size[1] // 2,
        },
        "flag": {
            "width": flag_width // 2,
            "height": flag_height // 2,
            "positions": {
                country_code: {"x": position["x"] // 2, "y": position["y"] // 2}
                for country_code, position in flag_positions.items()
            },
        },
    }
)

with open("src/sprite.css", "w") as file:
    file.write(css)
print("Generated sprite.css")

# Quantize the result sprite to reduce its size then save it.
sprite.quantize().save("src/sprite.png")
print("Generated sprite.png")
