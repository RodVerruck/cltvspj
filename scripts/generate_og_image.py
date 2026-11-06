import os
from PIL import Image, ImageDraw, ImageFont

def generate_og():
    width = 1200
    height = 630

    # Colors
    bg_color = (245, 241, 232)      # #f5f1e8 Paper
    paper_dark = (235, 229, 214)    # #ebe5d6
    ink_color = (26, 22, 20)        # #1a1614
    ink_muted = (89, 81, 69)        # #595145
    rule_color = (212, 205, 190)    # #d4cdbe
    money_color = (12, 74, 62)      # #0c4a3e
    money_light = (230, 239, 233)   # #e6efe9
    white = (255, 255, 255)

    img = Image.new("RGBA", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Windows fonts
    win_dir = os.environ.get('WINDIR', 'C:\\Windows')
    font_serif_path = os.path.join(win_dir, 'Fonts', 'georgia.ttf')
    font_serif_b_path = os.path.join(win_dir, 'Fonts', 'georgiab.ttf')
    font_sans_path = os.path.join(win_dir, 'Fonts', 'segoeui.ttf')
    font_sans_b_path = os.path.join(win_dir, 'Fonts', 'segoeuib.ttf')
    font_mono_path = os.path.join(win_dir, 'Fonts', 'consola.ttf')

    f_eyebrow = ImageFont.truetype(font_mono_path, 18)
    f_title_serif = ImageFont.truetype(font_serif_b_path if os.path.exists(font_serif_b_path) else font_serif_path, 54)
    f_title_highlight = ImageFont.truetype(font_serif_b_path if os.path.exists(font_serif_b_path) else font_serif_path, 50)
    f_sub = ImageFont.truetype(font_sans_path, 23)
    f_card_label = ImageFont.truetype(font_sans_b_path if os.path.exists(font_sans_b_path) else font_sans_path, 17)
    f_card_sub = ImageFont.truetype(font_sans_path, 15)
    f_footer = ImageFont.truetype(font_mono_path, 16)

    # Subtle background grid pattern
    for x in range(0, width, 48):
        draw.line([(x, 0), (x, height)], fill=(240, 234, 222), width=1)
    for y in range(0, height, 48):
        draw.line([(0, y), (width, y)], fill=(240, 234, 222), width=1)

    # Outer decorative frame
    margin = 32
    draw.rectangle([margin, margin, width - margin, height - margin], outline=rule_color, width=2)
    draw.rectangle([margin + 6, margin + 6, width - margin - 6, height - margin - 6], outline=money_color, width=3)

    # Eyebrow Badge (top left)
    badge_x = margin + 36
    badge_y = margin + 36
    badge_w = 420
    badge_h = 36
    draw.rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h], fill=money_color)
    draw.text((badge_x + 18, badge_y + 8), "CALCULADORA CLT VS PJ  •  2026", font=f_eyebrow, fill=white)

    # Year / Status pill (top right)
    pill_text = "TRIBUTAÇÃO ATUALIZADA"
    pill_bbox = draw.textbbox((0, 0), pill_text, font=f_eyebrow)
    pill_w = (pill_bbox[2] - pill_bbox[0]) + 32
    pill_x = width - margin - 36 - pill_w
    draw.rectangle([pill_x, badge_y, pill_x + pill_w, badge_y + badge_h], fill=paper_dark, outline=rule_color, width=1)
    draw.text((pill_x + 16, badge_y + 8), pill_text, font=f_eyebrow, fill=money_color)

    # Main Headline
    title_y = badge_y + 60
    draw.text((badge_x, title_y), "Vale a pena trocar CLT por PJ?", font=f_title_serif, fill=ink_color)
    draw.text((badge_x, title_y + 64), "Compare Salário Líquido, Impostos e Benefícios.", font=f_title_highlight, fill=money_color)

    # Subtitle
    sub_y = title_y + 130
    sub_text1 = "Simulação precisa considerando IRPF, INSS, Simples Nacional (Fator R / Anexo III),"
    sub_text2 = "provisão real de 13º, férias, FGTS e cálculo exato de Ponto de Equilíbrio."
    draw.text((badge_x, sub_y), sub_text1, font=f_sub, fill=ink_muted)
    draw.text((badge_x, sub_y + 32), sub_text2, font=f_sub, fill=ink_muted)

    # 3 Feature Cards
    cards_y = sub_y + 90
    cards_h = 92
    total_card_space = (width - margin * 2 - 72)
    card_w = (total_card_space - 32) // 3

    cards_data = [
        ("Ponto de Equilíbrio PJ", "Faturamento mínimo para empatar com pacote CLT completo."),
        ("Otimização no Simples (Fator R)", "Simulação automática entre Anexo III (6%) e Anexo V (15,5%)."),
        ("Benefícios & Provisões Reais", "Alimentação, transporte, plano de saúde, FGTS e férias.")
    ]

    for i, (title, desc) in enumerate(cards_data):
        cx = badge_x + i * (card_w + 16)
        # Card background
        draw.rectangle([cx, cards_y, cx + card_w, cards_y + cards_h], fill=white, outline=rule_color, width=1)
        # Top green accent indicator
        draw.rectangle([cx, cards_y, cx + card_w, cards_y + 4], fill=money_color)
        draw.text((cx + 16, cards_y + 16), title, font=f_card_label, fill=ink_color)
        
        # Word wrap desc in card
        words = desc.split()
        line1 = ""
        line2 = ""
        for w in words:
            test_line = (line1 + " " + w).strip()
            bbox = draw.textbbox((0, 0), test_line, font=f_card_sub)
            if bbox[2] - bbox[0] < card_w - 32:
                line1 = test_line
            else:
                line2 = (line2 + " " + w).strip()
        
        draw.text((cx + 16, cards_y + 42), line1, font=f_card_sub, fill=ink_muted)
        if line2:
            draw.text((cx + 16, cards_y + 62), line2, font=f_card_sub, fill=ink_muted)

    # Footer section
    footer_y = height - margin - 42
    draw.line([(badge_x, footer_y - 12), (width - margin - 36, footer_y - 12)], fill=rule_color, width=1)
    draw.text((badge_x, footer_y), "https://calculadora-cltvspj.vercel.app", font=f_footer, fill=money_color)
    
    right_note = "SIMULADOR GRATUITO  •  SEM CADASTRO"
    r_bbox = draw.textbbox((0, 0), right_note, font=f_footer)
    draw.text((width - margin - 36 - (r_bbox[2] - r_bbox[0]), footer_y), right_note, font=f_footer, fill=ink_muted)

    out_path = os.path.join("public", "og-image.png")
    img.save(out_path, "PNG")
    print(f"Generated {out_path} ({width}x{height}) successfully!")

if __name__ == "__main__":
    generate_og()

