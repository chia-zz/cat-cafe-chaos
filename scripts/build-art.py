"""把 src/art-source/ 的原始 PNG 轉成遊戲用的 WebP（src/assets/）。

用法：python scripts/build-art.py   （需要 Pillow）
- 貓咪：16 張使用同一個裁切框，確保換表情時貓咪位置完全不動
- 背景：裁掉外框與透明邊
- Logo：輸出 WebP 與 favicon PNG
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src' / 'art-source'
OUT = ROOT / 'src' / 'assets'
CATS = ['orange', 'calico', 'black', 'white']
MOODS = ['happy', 'waiting', 'impatient', 'angry']

CAT_BOX = (36, 123, 1255, 1184)  # 16 張的聯集外框（含表情符號）再留一點邊
CAT_WIDTH = 400
BG_BOX = (74, 82, 1682, 834)  # 去掉圓角木框
BG_WIDTH = 1200


def save_webp(im, path, quality=82):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, 'WEBP', quality=quality, method=6)
    print(f'{path.relative_to(ROOT)}  {im.size}  {path.stat().st_size // 1024} KB')


def resize_w(im, width):
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


for cat in CATS:
    for mood in MOODS:
        im = Image.open(SRC / f'{cat}-{mood}.png').convert('RGBA').crop(CAT_BOX)
        save_webp(resize_w(im, CAT_WIDTH), OUT / 'cats' / f'{cat}-{mood}.webp')

bg = Image.open(SRC / 'bg.png').convert('RGB').crop(BG_BOX)
save_webp(resize_w(bg, BG_WIDTH), OUT / 'cafe-bg.webp', quality=80)

logo = Image.open(SRC / 'cat cafe logo.png').convert('RGBA')
logo = logo.crop(logo.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox())
side = max(logo.size)
square = Image.new('RGBA', (side, side))
square.alpha_composite(logo, ((side - logo.width) // 2, (side - logo.height) // 2))
save_webp(square.resize((256, 256), Image.LANCZOS), OUT / 'logo.webp')
fav = ROOT / 'public' / 'favicon.png'
square.resize((64, 64), Image.LANCZOS).save(fav, optimize=True)
print(f'{fav.relative_to(ROOT)}  {fav.stat().st_size // 1024} KB')
