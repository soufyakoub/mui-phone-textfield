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
width_col, height_row = Image.open(flag_paths[0]).size
num_row = int(sqrt(len(flag_paths)))
num_col = ceil(len(flag_paths) / num_row)

sprite_size = (
    width_col * num_col + padding * (num_col - 1),
    height_row * num_row + padding * (num_row - 1),
)

# We'll collect flag positions in the sprite image so we can generate the corresponding CSS classes later.
flag_positions = []

# The full sprite image object.
sprite = Image.new("RGBA", sprite_size)

# This default flag will be used if a certain country code does not have a corresponding flag in the sprite.
flag_paths.remove("flags/default.png")
sprite.paste(Image.open("flags/default.png"), (0, 0))

# Filling columns from top to bottom, and from left to right.
for index, path in enumerate(flag_paths, 1):
    x = (width_col + padding) * (index // num_row)
    y = (height_row + padding) * (index % num_row)
    country_code = os.path.basename(path).split(".")[0]

    flag = Image.open(path)
    sprite.paste(flag, (x, y))
    flag.close()
    flag_positions.append({"country_code": country_code, "x": x, "y": y})

# Generating the sprite's corresponding css classes.
loader = jinja2.FileSystemLoader("./")
env = jinja2.Environment(loader=loader)
template = env.get_template("src/sprite.css.jinja")
sprite_css = template.render(
    {
        "path": "sprite.png",  # The sprite's relative path from the src directory.
        "width": sprite_size[0],
        "height": sprite_size[1],
        "flag": {"width": width_col, "height": height_row, "positions": flag_positions},
    }
)

with open("src/sprite.css", "w") as file:
    file.write(sprite_css)

# Quantize the result sprite to reduce its size then save it.
sprite.quantize().save("src/sprite.png")
