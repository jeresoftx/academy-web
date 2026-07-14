#!/usr/bin/env python3
from pathlib import Path
import json
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SPECS = json.loads((ROOT / "config/asset-specs.json").read_text())

FONT_DISPLAY = Path("/System/Library/Fonts/Supplemental/Impact.ttf")
FONT_BOLD = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")
FONT_REGULAR = Path("/System/Library/Fonts/Helvetica.ttc")

ACADEMY_SUN = (240, 176, 8, 255)
ACADEMY_INK = (10, 9, 7, 255)

COPY_BY_COURSE = {
    "algorithms": {
        "label": "FUNDAMENTOS",
        "code": "S1",
        "title_lines": ["ALGORITMOS"],
        "accent_lines": ["LA BASE DE TODO"],
        "descriptor": "Grafos, caminos, ventanas, búsqueda y complejidad.",
    },
    "design-patterns": {
        "label": "OFICIO",
        "code": "DP",
        "title_lines": ["PATRONES DE", "DISEÑO"],
        "accent_lines": ["SOLUCIONES QUE ESCALAN"],
        "descriptor": "Piezas, composición, interfaces y estructura.",
    },
}


def font(path, size):
    return ImageFont.truetype(str(path), size)


def cover_resize(image, size):
    target_w, target_h = size
    source_w, source_h = image.size
    scale = max(target_w / source_w, target_h / source_h)
    resized = image.resize((round(source_w * scale), round(source_h * scale)), Image.LANCZOS)
    left = max(0, (resized.width - target_w) // 2)
    top = max(0, (resized.height - target_h) // 2)
    return resized.crop((left, top, left + target_w, top + target_h)).convert("RGBA")


def text_size(draw, text, face):
    box = draw.textbbox((0, 0), text, font=face)
    return box[2] - box[0], box[3] - box[1]


def fit_font(draw, text, face_path, max_width, start_size, min_size):
    size = start_size
    while size >= min_size:
        face = font(face_path, size)
        if text_size(draw, text, face)[0] <= max_width:
            return face
        size -= 4
    return font(face_path, min_size)


def fit_font_for_lines(draw, lines, face_path, max_width, start_size, min_size):
    return min(
        (fit_font(draw, line, face_path, max_width, start_size, min_size) for line in lines),
        key=lambda face: face.size,
    )


def add_gradient(image, theme):
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    pixels = overlay.load()
    width, height = image.size
    for x in range(width):
        t = max(0, 1 - x / (width * 0.58))
        alpha = round(210 * t)
        for y in range(height):
            if theme == "light":
                pixels[x, y] = (255, 244, 192, round(128 * t))
            else:
                pixels[x, y] = (0, 0, 0, alpha)
    return Image.alpha_composite(image, overlay)


def draw_shadowed(draw, xy, text, face, fill, shadow=(0, 0, 0, 190), offset=None):
    x, y = xy
    if offset is None:
        offset = max(2, face.size // 24)
    draw.text((x + offset, y + offset), text, font=face, fill=shadow)
    draw.text((x, y), text, font=face, fill=fill)


def draw_badge(draw, xy, text, scale):
    x, y = xy
    face = font(FONT_BOLD, round(34 * scale))
    tw, th = text_size(draw, text, face)
    pad_x = round(28 * scale)
    pad_y = round(12 * scale)
    radius = round(26 * scale)
    box = (x, y, x + tw + pad_x * 2, y + th + pad_y * 2)
    draw.rounded_rectangle(box, radius=radius, fill=ACADEMY_SUN)
    draw.text((x + pad_x, y + pad_y - round(2 * scale)), text, font=face, fill=ACADEMY_INK)


def draw_text_lines(draw, left, y, lines, face, fill, line_gap, shadow):
    for line in lines:
        draw_shadowed(draw, (left, y), line, face, fill, shadow=shadow)
        y += round(face.size + line_gap)
    return y


def draw_course_overlay(image, theme, variant, copy):
    image = add_gradient(image, theme)
    draw = ImageDraw.Draw(image)
    w, h = image.size
    scale = w / 1600
    left = round(w * 0.045)
    top = round(h * 0.075)
    max_width = round(w * (0.56 if variant == "course" else 0.48))

    title_fill = (245, 239, 230, 255) if theme == "dark" else (10, 9, 7, 255)
    descriptor_fill = (245, 239, 230, 255) if theme == "dark" else (35, 31, 25, 255)
    gold = ACADEMY_SUN
    shadow = (0, 0, 0, 205) if theme == "dark" else (255, 255, 255, 180)

    draw_badge(draw, (left, top), copy["label"], scale)

    if variant == "youtube":
        code_face = font(FONT_DISPLAY, round(168 * scale))
        title_face = fit_font_for_lines(
            draw,
            copy["title_lines"],
            FONT_DISPLAY,
            max_width,
            round(94 * scale),
            round(58 * scale),
        )
        accent_face = fit_font_for_lines(
            draw,
            copy["accent_lines"],
            FONT_DISPLAY,
            max_width,
            round(82 * scale),
            round(50 * scale),
        )
        y = round(h * 0.19)
        draw_shadowed(draw, (left, y), copy["code"], code_face, gold, shadow=shadow)
        y += round(172 * scale)
        y = draw_text_lines(draw, left, y, copy["title_lines"], title_face, title_fill, round(8 * scale), shadow)
        draw_text_lines(draw, left, y, copy["accent_lines"], accent_face, gold, round(7 * scale), shadow)
        return image

    if variant == "og":
        code_face = font(FONT_DISPLAY, round(150 * scale))
        title_face = fit_font_for_lines(draw, copy["title_lines"], FONT_DISPLAY, max_width, round(78 * scale), round(50 * scale))
        accent_face = fit_font_for_lines(draw, copy["accent_lines"], FONT_DISPLAY, max_width, round(66 * scale), round(42 * scale))
        descriptor_face = fit_font(draw, copy["descriptor"], FONT_REGULAR, max_width, round(31 * scale), round(22 * scale))
        y = round(h * 0.23)
        draw_shadowed(draw, (left, y), copy["code"], code_face, gold, shadow=shadow)
        y += round(150 * scale)
        y = draw_text_lines(draw, left, y, copy["title_lines"], title_face, title_fill, round(6 * scale), shadow)
        y = draw_text_lines(draw, left, y, copy["accent_lines"], accent_face, gold, round(6 * scale), shadow)
        y += round(8 * scale)
        draw_shadowed(draw, (left, y), copy["descriptor"], descriptor_face, descriptor_fill, shadow=shadow)
        return image

    code_size = round((230 if variant == "course" else 178) * scale)
    title_size = round((98 if variant == "course" else 58) * scale)
    accent_size = round((82 if variant == "course" else 48) * scale)
    descriptor_size = round((28 if variant == "course" else 24) * scale)
    code_face = font(FONT_DISPLAY, code_size)
    title_face = fit_font_for_lines(draw, copy["title_lines"], FONT_DISPLAY, max_width, title_size, round(58 * scale))
    accent_face = fit_font_for_lines(draw, copy["accent_lines"], FONT_DISPLAY, max_width, accent_size, round(48 * scale))
    descriptor_face = fit_font(draw, copy["descriptor"], FONT_REGULAR, max_width, descriptor_size, round(18 * scale))

    y = round(h * (0.18 if variant == "course" else 0.20))
    draw_shadowed(draw, (left, y), copy["code"], code_face, gold, shadow=shadow)
    y = round(h * (0.50 if variant == "course" else 0.53))
    y = draw_text_lines(draw, left, y, copy["title_lines"], title_face, title_fill, round(6 * scale), shadow)
    y = draw_text_lines(draw, left, y, copy["accent_lines"], accent_face, gold, round(6 * scale), shadow)
    y += round(8 * scale)
    draw_shadowed(draw, (left, y), copy["descriptor"], descriptor_face, descriptor_fill, shadow=shadow)
    return image


def needs_overlay(name):
    return (
        name.startswith("course-cover")
        or name.startswith("chapter-cover")
        or name.startswith("youtube-thumbnail")
        or name.startswith("og-image")
    )


def variant_for(name):
    if name.startswith("youtube-thumbnail"):
        return "youtube"
    if name.startswith("og-image"):
        return "og"
    if name.startswith("course-cover"):
        return "course"
    return "chapter"


def main():
    if len(sys.argv) != 2:
        print("Uso: compose_course_assets.py <course>")
        raise SystemExit(2)

    course = sys.argv[1]
    if course not in COPY_BY_COURSE:
        supported = ", ".join(sorted(COPY_BY_COURSE))
        raise SystemExit(f"Curso sin overlay configurado: {course}. Disponibles: {supported}")

    copy = COPY_BY_COURSE[course]
    course_dir = ROOT / "courses" / course
    generated_dir = course_dir / "generated"
    export_dir = course_dir / "export"
    export_dir.mkdir(parents=True, exist_ok=True)

    for name, spec in SPECS.items():
        source = generated_dir / name.replace(".png", ".generated.png")
        if not source.exists():
            raise SystemExit(f"Falta arte base: {source}")

        image = Image.open(source).convert("RGB")
        image = cover_resize(image, (spec["width"], spec["height"]))
        theme = "light" if ".light." in name else "dark"

        if needs_overlay(name):
            image = draw_course_overlay(image, theme, variant_for(name), copy)

        image.convert("RGB").save(export_dir / name, format="PNG", optimize=True)

    print(export_dir)


if __name__ == "__main__":
    main()
