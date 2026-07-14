#!/usr/bin/env python3
from pathlib import Path
import json
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[2]
SPECS = json.loads((ROOT / "config/asset-specs.json").read_text())

def main():
    if len(sys.argv) != 3:
        print("Uso: package_assets.py <directorio-export> <nombre-zip>")
        raise SystemExit(2)

    export_dir = Path(sys.argv[1])
    zip_name = sys.argv[2]
    validator = ROOT / "tools/academy-assets/validate_assets.py"

    result = subprocess.run([sys.executable, str(validator), str(export_dir)])
    if result.returncode != 0:
        raise SystemExit(result.returncode)

    zip_path = export_dir / zip_name
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for filename in SPECS:
            archive.write(export_dir / filename, arcname=filename)

    print(zip_path)

if __name__ == "__main__":
    main()
