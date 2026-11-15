import os

res_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "android", "app", "src", "main", "res")
folders = ["mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi", "drawable"]

for f in folders:
    p = os.path.join(res_dir, f)
    os.makedirs(p, exist_ok=True)
    readme_p = os.path.join(p, "readme.txt")
    with open(readme_p, "w") as out:
        out.write(f"Place school branding icon (ic_launcher.png) here for {f} (recommended 512x512 px for xxxhdpi).\n")

print("Created Android resource folders successfully!")
