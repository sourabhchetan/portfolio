from PIL import Image, ImageDraw, ImageFont

BASE = "/home/claude/portfolio/Portfolio/assets"
MONO_BOLD = f"{BASE}/JetBrainsMono-Bold.ttf"
MONO_REG = f"{BASE}/JetBrainsMono-Regular.ttf"

BG_DARK = "#0a0f1a"
PANEL_DARK = "#111a2b"
PANEL_DARK_2 = "#0e1622"
LINE_DARK = (231, 236, 239, 26)  # ~0.10 alpha of #e7ecef on dark
TEXT_ONDARK = "#e7ecef"
TEXT_MUTED = "#8b96a5"
ACCENT = "#22d3a4"
ACCENT_DIM = "#17916f"


def rounded_rect(draw, box, radius, **kwargs):
    draw.rounded_rectangle(box, radius=radius, **kwargs)


def make_mark(size, radius, pad_ratio=0.16, bg=PANEL_DARK_2, border=ACCENT):
    """Core SC monogram mark, transparent canvas, used for favicon/apple icon."""
    scale = 4  # supersample for crisp edges
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    r = int(radius * scale)
    border_w = max(2, int(s * 0.035))
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=r, fill=bg)
    d.rounded_rectangle(
        [border_w / 2, border_w / 2, s - 1 - border_w / 2, s - 1 - border_w / 2],
        radius=r,
        outline=border,
        width=border_w,
    )

    # "SC" monogram, tight kerning, bold
    font_size = int(s * 0.50)
    font = ImageFont.truetype(MONO_BOLD, font_size)
    text = "SC"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (s - tw) / 2 - bbox[0]
    ty = (s - th) / 2 - bbox[1] - s * 0.03
    d.text((tx, ty), text, font=font, fill=ACCENT)

    # terminal-cursor accent: small underline bar, like a blinking cursor
    bar_w = s * 0.16
    bar_h = max(2 * scale, int(s * 0.045))
    bar_x = (s - bar_w) / 2
    bar_y = ty + th + s * 0.06
    d.rounded_rectangle(
        [bar_x, bar_y, bar_x + bar_w, bar_y + bar_h],
        radius=bar_h / 2,
        fill=ACCENT,
    )

    img = img.resize((size, size), Image.LANCZOS)
    return img


def save_png_icons():
    for size, name in [(16, "favicon-16.png"), (32, "favicon-32.png"), (48, "favicon-48.png")]:
        icon = make_mark(size, radius=size * 0.28)
        icon.save(f"{BASE}/{name}")

    apple = make_mark(180, radius=180 * 0.22, bg=PANEL_DARK_2)
    # apple touch icons are typically opaque with the OS applying its own mask
    bg = Image.new("RGBA", apple.size, BG_DARK)
    bg.paste(apple, (0, 0), apple)
    bg.convert("RGB").save(f"{BASE}/apple-touch-icon.png")


def draw_terminal_dots(d, x, y, scale):
    for i in range(3):
        cx = x + i * 22 * scale
        d.ellipse([cx, y, cx + 12 * scale, y + 12 * scale], fill="#374151")


def make_og_image():
    scale = 2
    W, H = 1200 * scale, 630 * scale
    img = Image.new("RGB", (W, H), BG_DARK)
    d = ImageDraw.Draw(img, "RGBA")

    # subtle radial-ish glow top-right (approximate with soft ellipse)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gx, gy = int(W * 0.88), int(H * 0.12)
    for i, r in enumerate(range(int(W * 0.42), 0, -6)):
        alpha = int(10 * (1 - i / (W * 0.42 / 6)))
        if alpha <= 0:
            continue
        gd.ellipse([gx - r, gy - r, gx + r, gy + r], fill=(34, 211, 164, alpha))
    img.paste(Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB"), (0, 0))
    d = ImageDraw.Draw(img, "RGBA")

    # terminal card
    card_margin_x = 90 * scale
    card_margin_y = 70 * scale
    card_box = [card_margin_x, card_margin_y, W - card_margin_x, H - card_margin_y]
    d.rounded_rectangle(card_box, radius=22 * scale, fill=PANEL_DARK,
                         outline=(231, 236, 239, 30), width=1 * scale)

    # terminal bar
    bar_h = 46 * scale
    bar_box = [card_box[0], card_box[1], card_box[2], card_box[1] + bar_h]
    d.rounded_rectangle(bar_box, radius=22 * scale, fill=PANEL_DARK_2)
    d.rectangle([card_box[0], card_box[1] + bar_h - 22 * scale, card_box[2], card_box[1] + bar_h],
                fill=PANEL_DARK_2)
    draw_terminal_dots(d, card_box[0] + 22 * scale, card_box[1] + 17 * scale, scale)

    title_font = ImageFont.truetype(MONO_REG, 13 * scale)
    d.text((card_box[0] + 84 * scale, card_box[1] + 14 * scale), "sourabh@portfolio — zsh",
           font=title_font, fill=TEXT_MUTED)

    # SC mark inside card
    mark_size = 92 * scale
    mark = make_mark(mark_size // 1, radius=mark_size * 0.24)
    mark = mark.resize((mark_size, mark_size), Image.LANCZOS)
    mark_x = card_box[0] + 60 * scale
    mark_y = card_box[1] + bar_h + 46 * scale
    img.paste(mark, (int(mark_x), int(mark_y)), mark)

    # name
    name_font = ImageFont.truetype(MONO_BOLD, 46 * scale)
    role_font = ImageFont.truetype(MONO_BOLD, 25 * scale)
    stack_font = ImageFont.truetype(MONO_REG, 19 * scale)
    prompt_font = ImageFont.truetype(MONO_REG, 17 * scale)

    text_x = mark_x + mark_size + 34 * scale
    d.text((text_x, mark_y + 2 * scale), "Sourabh Chetan", font=name_font, fill=TEXT_ONDARK)
    d.text((text_x, mark_y + 2 * scale + 58 * scale), "Backend-Leaning Full Stack Developer",
           font=role_font, fill=ACCENT)

    # divider
    div_y = mark_y + mark_size + 40 * scale
    d.line([card_box[0] + 60 * scale, div_y, card_box[2] - 60 * scale, div_y],
           fill=(231, 236, 239, 26), width=1 * scale)

    # prompt lines
    line1_y = div_y + 34 * scale
    d.text((card_box[0] + 60 * scale, line1_y), "$", font=prompt_font, fill=ACCENT)
    d.text((card_box[0] + 60 * scale + 18 * scale, line1_y), "cat stack.txt",
           font=prompt_font, fill=TEXT_ONDARK)
    d.text((card_box[0] + 60 * scale, line1_y + 34 * scale),
           "> Java · Python · Django · Flask · JavaScript",
           font=stack_font, fill=TEXT_MUTED)

    line2_y = line1_y + 34 * scale + 44 * scale
    d.text((card_box[0] + 60 * scale, line2_y), "$", font=prompt_font, fill=ACCENT)
    d.text((card_box[0] + 60 * scale + 18 * scale, line2_y), "./run ev-yatra --status",
           font=prompt_font, fill=TEXT_ONDARK)
    d.text((card_box[0] + 60 * scale, line2_y + 34 * scale),
           "> flagship project — flask + mysql rental platform",
           font=stack_font, fill=TEXT_MUTED)

    img = img.resize((1200, 630), Image.LANCZOS)
    img.save(f"{BASE}/og-image.png", quality=92)


if __name__ == "__main__":
    save_png_icons()
    make_og_image()
    print("done")
