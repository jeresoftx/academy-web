#!/usr/bin/env python3
from pathlib import Path
import json
import sys

try:
    from PIL import Image
except ImportError:
    print("Instala Pillow: python3 -m pip install Pillow")
    raise SystemExit(2)

ROOT = Path(__file__).resolve().parents[2]
SPECS = json.loads((ROOT / "config/asset-specs.json").read_text())

def main():
    if len(sys.argv) != 2:
        print("Uso: validate_assets.py <directorio-export>")
        raise SystemExit(2)

    directory = Path(sys.argv[1])
    errors = []

    for name, spec in SPECS.items():
        path = directory / name
        if not path.exists():
            errors.append(f"Falta {name}")
            continue

        try:
            with Image.open(path) as image:
                if image.format != "PNG":
                    errors.append(f"{name}: debe ser PNG")
                expected = (spec["width"], spec["height"])
                if image.size != expected:
                    errors.append(
                        f"{name}: {image.size[0]}x{image.size[1]}, "
                        f"se esperaba {expected[0]}x{expected[1]}"
                    )
        except Exception as exc:
            errors.append(f"{name}: no se pudo leer: {exc}")

    actual = {p.name for p in directory.iterdir() if p.is_file()}
    expected_names = set(SPECS)
    extras = sorted(actual - expected_names)
    if extras:
        errors.append("Archivos extra: " + ", ".join(extras))

    if errors:
        print("VALIDACIÓN FALLIDA")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("VALIDACIÓN CORRECTA")

if __name__ == "__main__":
    main()
