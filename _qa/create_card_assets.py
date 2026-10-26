from pathlib import Path
import base64
from html import escape
import json
import subprocess
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'Assets' / 'Images'

def data(path, mime):
    return 'data:' + mime + ';base64,' + base64.b64encode(path.read_bytes()).decode('ascii')

logo = data(OUT / 'logo.png', 'image/png')
rows = [
    ('حل مشاكل أجهزة | iPhone', 'مشاكل النظام والبطء والتحديثات'),
    ('استرجاع | فك | iCloud', 'استعادة وفك الآيكلاود المغلق والمحروق'),
    ('فك سيكور الإيميلات | الحسابات', 'فك قفل الحساب - أو تحقق بخطوتين'),
    ('استعادة الإيميلات | الحسابات المخترقة', 'استعادة حسابك المخترق'),
    ('نقل البيانات والنسخ الاحتياطية', 'بين الأجهزة ومن أندرويد إلى iPhone'),
    ('دعم فني عن بُعد', 'استشارات وتثبيت البرامج والتطبيقات'),
]

items = [
    dict(id='subtitle', text='للمشاكل التقنية ومشاكل الحسابات', x=438.5, y=340, size=27, anchor='center', rtl=True, light=True),
    dict(id='title', text='خدمات تقنية', x=849, y=64, size=47, anchor='right', rtl=True, bold=True),
    dict(id='whatsapp', text='واتساب فقط', x=427, y=339, size=26, anchor='right', rtl=True),
    dict(id='phone', text='0556840949', x=458, y=347, size=51, anchor='left', rtl=False, bold=True),
]
for i, (heading, detail) in enumerate(rows):
    items += [
        dict(id=f'heading{i}', text=heading, x=849, y=104+i*36.5, size=24.2 if i!=3 else 21.5, anchor='right', rtl=True),
        dict(id=f'detail{i}', text=detail, x=499, y=104+i*36.5, size=22.4, anchor='right', rtl=True, light=True),
    ]
manifest = ROOT / '_qa' / 'card-text.json'
outline_file = ROOT / '_qa' / 'card-text-outlines.json'
manifest.write_text(json.dumps(items,ensure_ascii=False), encoding='utf-8')
pwsh = shutil.which('pwsh') or shutil.which('powershell')
if not pwsh:
    raise RuntimeError('PowerShell is required to rebuild the card artwork.')
subprocess.run([str(pwsh), '-NoProfile', '-File', str(ROOT / '_qa' / 'card_text_outlines.ps1'), '-Manifest', str(manifest), '-Output', str(outline_file)], check=True)
outlines = {p['id']:p for p in json.loads(outline_file.read_text(encoding='utf-8'))}

def text_path(key, fill):
    p = outlines[key]
    return f'<g aria-label="{escape(p["text"],quote=True)}"><path fill="{fill}" d="{p["d"]}"/></g>'

def start(title, desc):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1754" height="720" viewBox="0 0 877 360" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title>
<desc id="desc">{escape(desc)}</desc>
'''

front = start('بطاقة رياض العطاوي — الوجه الأمامي', 'الشعار الجديد لرياض العطاوي على خلفية كحلية، مع عبارة: للمشاكل التقنية ومشاكل الحسابات.')
front += f'''<defs>
<radialGradient id="navy" cx="48%" cy="40%" r="80%"><stop offset="0" stop-color="#1d3b45"/><stop offset=".65" stop-color="#142e39"/><stop offset="1" stop-color="#0e212a"/></radialGradient>
<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="8" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
</defs>
<rect width="877" height="360" fill="url(#navy)"/>
<rect width="877" height="360" filter="url(#paper)" opacity=".035"/>
<svg x="238" y="8" width="401" height="305" viewBox="135 300 1010 790" preserveAspectRatio="xMidYMid meet"><image width="1254" height="1254" href="{logo}"/></svg>
{text_path('subtitle', '#edf4d7')}
</svg>'''

back = start('بطاقة رياض العطاوي — الوجه الخلفي', 'خدمات تقنية ومعلومات التواصل عبر واتساب فقط: 0556840949. التصميم والنصوص من البطاقة المرجعية، مع استبدال الشعار القديم بالشعار الجديد.')
back += f'''<defs>
<linearGradient id="lime" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e2f4be"/><stop offset=".6" stop-color="#dcf0b4"/><stop offset="1" stop-color="#ddf1b8"/></linearGradient>
<filter id="ink"><feFlood flood-color="#071b23"/><feComposite in2="SourceAlpha" operator="in"/></filter>
</defs>
<rect width="877" height="360" fill="url(#lime)"/>
<svg x="6" y="17" width="92" height="79" viewBox="135 300 1010 790" preserveAspectRatio="xMidYMid meet"><image width="1254" height="1254" href="{logo}" filter="url(#ink)"/></svg>
<path d="M110 20V94" fill="none" stroke="#354a3c" stroke-width="1.3"/>
{text_path('title', '#071b23')}
'''
for i, (heading, detail) in enumerate(rows):
    baseline = 104 + i * 36.5
    back += text_path(f'heading{i}', '#071b23') + '\n'
    back += text_path(f'detail{i}', '#283c2b') + '\n'
    back += f'<path d="M2 {baseline + 12}H849" stroke="#697c53" stroke-width=".9" opacity=".85"/>\n'

                                                          
back += '''<g transform="translate(204 308)" fill="none" stroke="#071b23" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round">
<path d="M39 19.5A19 19 0 0 1 10 36.3L1 39l2.7-8.6A19 19 0 1 1 39 19.5Z"/>
<path d="M12 10c-3 1-3 5-1 9 3 6 7 10 13 12 4 1 7-1 7-4l-6-3-3 3c-4-2-7-5-9-9l3-2-3-6Z" stroke-width="1.7" fill="#071b23"/>
</g>
<path d="M270 314V345" stroke="#6c8058" stroke-width="1.2"/>
'''
back += text_path('whatsapp', '#071b23') + text_path('phone', '#071b23') + '</svg>'

(OUT / 'business-card-front.svg').write_text(front, encoding='utf-8')
(OUT / 'business-card-back.svg').write_text(back, encoding='utf-8')
for name in ('business-card-front.svg', 'business-card-back.svg'):
    print(name, (OUT / name).stat().st_size, 'bytes')
