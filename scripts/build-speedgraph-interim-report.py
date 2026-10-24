#!/usr/bin/env python3
"""Build the research interim report PDF from encyclopedia Markdown pages.

Requires Python markdown and pypdf, Google Chrome, and the installed Noto Serif CJK KR font.
The output is the sole public PDF under files/speedgraph/.
"""
from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import markdown
except ModuleNotFoundError:
    sys.path.append('/usr/lib/python3/dist-packages')
    import markdown
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'encyclopedia' / 'speedgraph'
PDF = ROOT / 'files' / 'speedgraph' / 'project-interim-report.pdf'
HTML = Path(tempfile.gettempdir()) / 'pdfs' / 'speedgraph-report-source.html'
FIG = ROOT / 'public' / 'speedgraph' / 'figures'

CHAPTERS = [
    ('1. 서론', 'introduction.md'),
    ('2. 이론적 배경과 선행 연구 고찰', 'background.md'),
    ('3. 연구 방법', 'methods.md'),
    ('4. 연구 결과', 'results.md'),
    ('5. 결론 및 한계점, 후속 연구 제안', 'conclusion.md'),
]
SUBCHAPTERS = [
    ('6.1 Receiver MoE 구조와 통제 비교', 'receiver-moe.md'),
    ('6.2 극단 조건과 라우팅 기전 진단', 'extreme-and-mechanism.md'),
    ('6.3 비용 민감 라우터 손실 실험', 'cost-sensitive-router.md'),
]
TOC = ['초록', *[title for title, _ in CHAPTERS], '6. 폐기된 설정과 실험',
       *[title for title, _ in SUBCHAPTERS], '참고문헌']
CITE = {'stgcn': '[1]', 'dcrnn': '[2]', 'kgraph': '[3]', 'klstm': '[4]'}
REFS = [
    '[1] Yu, B., Yin, H., and Zhu, Z. (2018). Spatio-Temporal Graph Convolutional Networks: A Deep Learning Framework for Traffic Forecasting. Proceedings of the 27th International Joint Conference on Artificial Intelligence, 3634-3640. https://doi.org/10.24963/ijcai.2018/505',
    '[2] Li, Y., Yu, R., Shahabi, C., and Liu, Y. (2018). Diffusion Convolutional Recurrent Neural Network: Data-Driven Traffic Forecasting. International Conference on Learning Representations.',
    '[3] Kim, S., Park, J., and Choi, Y. (2021). Traffic Speed Prediction Based on Graph Neural Networks for Intelligent Transportation System. Journal of Korean Society of Intelligent Transport Systems, 20(1), 70-85. https://doi.org/10.12815/kits.2021.20.1.70',
    '[4] Park, B., Bae, S. H., and Jung, B. (2021). Speed Prediction of Urban Freeway Using LSTM and CNN-LSTM Neural Network. Journal of Korean Society of Intelligent Transport Systems, 20(1), 86-99. https://doi.org/10.12815/kits.2021.20.1.86',
]
TABLE_CAPTIONS = {
    'methods.md': [
        '표 1. 데이터셋별 센서 수와 학습·검증·시험 기간 및 표본 수.',
    ],
    'results.md': [
        '표 2. 수정 STGCN 기준 모델과 최종 모델의 전체 및 마지막 시점 평균절대오차.',
        '표 3. 속도 단일 입력 구조에서 정규화 구성에 따른 평균절대오차.',
    ],
    'discarded-settings.md': [
        '표 4. 최종 모델에서 제외한 설정의 단계별 실험 결과.',
    ],
    'discarded-settings/extreme-and-mechanism.md': [
        '표 5. 사전 정의 극단 조건에서 두 모델의 평균절대오차와 우월성 통과 수.',
    ],
    'discarded-settings/cost-sensitive-router.md': [
        '표 6. 비용 민감 보조 손실 추가 전후의 전체 평균절대오차와 우월성 통과 수.',
    ],
}

CSS = r'''
@page {
  size: A4;
  margin: 17mm 21mm 20mm 21mm;
  @bottom-center { content: counter(page); font: 8pt "Noto Serif CJK KR"; color: #687780; }
}
@page:first { @bottom-center { content: none; } }
html { font-family: "Noto Serif CJK KR", serif; color: #172936; }
body { margin: 0; font-size: 10pt; line-height: 1.6; text-align: justify; }
p { margin: 0 0 1pt; orphans: 2; widows: 2; }
h1, h2, h3 { font-weight: 600; text-align: left; break-after: avoid; }
h1 { font-size: 14pt; line-height: 1.6; margin: 0 0 10pt; }
h2 { font-size: 12pt; line-height: 1.6; margin: 9pt 0 5pt; }
h3 { font-size: 11pt; line-height: 1.6; margin: 7pt 0 3pt; }
.cover, .frontmatter { break-after: page; }
.cover { height: 260mm; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.cover .title { font-size: 18pt; line-height: 1.6; font-weight: 600; margin-bottom: 17mm; }
.cover .subtitle, .cover .date { font-size: 14pt; line-height: 1.6; }
.cover .date { margin-top: 45mm; }
.frontmatter .abstract h1 { margin-bottom: 8pt; }
.frontmatter .toc h1 { margin: 12pt 0 10pt; }
.toc-row { display: flex; align-items: baseline; gap: 8pt; margin-bottom: 5pt; font-size: 10pt; line-height: 1.6; }
.toc-row.sub { padding-left: 13pt; }
.toc-row .label { white-space: nowrap; }
.toc-row .leader { flex: 1; border-bottom: 1px dotted #8898a0; height: 0.72em; }
.toc-row .page { min-width: 18pt; text-align: right; }
.chapter { break-before: auto; }
.abstract { break-before: auto; }
.subchapter { break-before: auto; }
.chapter > h1, .subchapter > h2 { margin-top: 12pt; }
.note { color: #435760; }
table { border-collapse: collapse; width: 100%; margin: 8pt 0 11pt; font-size: 10pt; line-height: 1.6; text-align: left; table-layout: fixed; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th, td { padding: 4pt 4.5pt; vertical-align: top; overflow-wrap: anywhere; }
th { background: #eaf1f4; border-bottom: .6pt solid #557385; font-weight: 400; }
tbody tr:nth-child(even) { background: #f7fafb; }
tbody tr:last-child { border-bottom: .4pt solid #c6d4db; }
pre { font-family: "Noto Serif CJK KR", serif; font-size: 10pt; line-height: 1.6; white-space: pre-wrap; margin: 5pt 0 8pt; padding: 5pt 8pt; background: #f7fafb; }
code { font-family: inherit; font-size: inherit; }
ul, ol { padding-left: 18pt; margin: 3pt 0 8pt; }
li { margin-bottom: 2pt; }
.figure { text-align: center; break-inside: avoid; margin: 10pt auto 1pt; width: 100%; }
.figure svg { max-width: 100%; max-height: 125mm; height: auto; display: block; margin: 0 auto; }
.caption { font-size: 9pt; line-height: 1.6; text-align: center; margin: 3pt auto 12pt; }
.table-caption { font-size: 9pt; line-height: 1.6; text-align: center; margin: -5pt auto 12pt; break-before: avoid; }
.references { break-before: page; }
.reference { font-family: "Batang", "Noto Serif CJK KR", serif; font-size: 9pt; line-height: 1.6; margin: 0 0 7pt; text-align: justify; letter-spacing: -.05em; padding-left: 10pt; break-inside: avoid; }
.reference-inner { transform: scaleX(.95); transform-origin: left top; width: 105.263%; }
'''


def source_markdown(name: str, *, abstract=False, nested=False) -> str:
    text = (SRC / name).read_text(encoding='utf-8')
    text = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.S)
    text = re.sub(r'^\[\^[^\]]+\]:.*$', '', text, flags=re.M)
    text = re.sub(r'\[\^([^\]]+)\]', lambda m: CITE.get(m.group(1), ''), text)
    if abstract:
        text = text.split('## 본문 구성')[0]
        text = text.replace('## 초록\n', '', 1)
        text = re.sub(r'^\*\*주제어:\*\*.*$', '', text, flags=re.M)
    if name == 'background.md':
        text = text.replace('인용은 모델 선택의 학술적 맥락을 제공한다. 인용 논문의 데이터셋·단위·분할을 본 연구의 시험 수치와 같은 실험으로 취급하지 않는다.', '')
    if name == 'conclusion.md':
        text = text.replace('이 항목들은 **추후 논문 또는 별도 연구를 위한 질문**이다. 2026년 10월 24일의 최종 모델 동결을 해제하거나 새로운 구조 실험을 승인하는 내용은 아니다.', '')
    text = text.replace('**', '')
    text = re.sub(r'^\[(?:초록|서론|이론적 배경과 선행 연구 고찰|연구 방법|연구 결과|폐기된 설정|결론 및 한계점, 후속 연구 제안)\]\([^\n]+$', '', text, flags=re.M)
    text = re.sub(r'\[([^\]]+)\]\((?:\.\.?/)?[^)]*\.md(?:#[^)]*)?\)', r'\1', text)
    if nested:
        text = re.sub(r'^## ', '### ', text, flags=re.M)
    text = re.sub(r'^!\[[^\]]*\]\(/Resources/speedgraph/figures/(model-flow|error-reduction)\.svg\)$',
                  lambda m: f'\n<FIGURE:{m.group(1)}>\n', text, flags=re.M)
    return text.strip()


def rendered(name: str, **kwargs) -> str:
    text = source_markdown(name, **kwargs)
    figures = {}
    for key in ('model-flow', 'error-reduction'):
        if f'<FIGURE:{key}>' in text:
            svg = (FIG / f'{key}.svg').read_text(encoding='utf-8')
            svg = re.sub(r'<\?xml[^>]*\?>', '', svg).strip()
            marker = f'FIGUREPLACEHOLDER{len(figures)}'
            figures[marker] = f'<div class="figure">{svg}</div>'
            text = text.replace(f'<FIGURE:{key}>', marker)
    out = markdown.markdown(text, extensions=['tables', 'fenced_code'])
    for marker, fig_html in figures.items():
        out = out.replace(f'<p>{marker}</p>', fig_html)
    out = re.sub(r'<p><em>(그림\s*\d+\..*?)</em></p>', r'<p class="caption">\1</p>', out, flags=re.S)
    captions = TABLE_CAPTIONS.get(name, [])
    if out.count('</table>') != len(captions):
        raise ValueError(f'Table caption count mismatch in {name}')
    caption_iter = iter(captions)
    out = re.sub(r'</table>',
                 lambda _: f'</table><p class="table-caption">{next(caption_iter)}</p>', out)
    return out


def html_document(page_map: dict[str, int]) -> str:
    toc_rows = []
    for title in TOC:
        page = page_map.get(title, '')
        cls = 'toc-row sub' if title.startswith('6.') and title != '6. 폐기된 설정과 실험' else 'toc-row'
        toc_rows.append(f'<div class="{cls}"><span class="label">{title}</span><span class="leader"></span><span class="page">{page}</span></div>')
    parts = [
        '<!doctype html><html lang="ko"><head><meta charset="utf-8">',
        '<title>프로젝트 중간 보고서</title>', f'<style>{CSS}</style></head><body>',
        '<section class="cover"><div class="title">다중 시점 교통 속도 예측을 위한<br>STGCN 개선 및 재설계</div><div class="subtitle">프로젝트 중간 보고서</div><div class="date">2026년 10월 24일</div></section>',
        '<section class="frontmatter"><div class="abstract"><h1>초록</h1>', rendered('README.md', abstract=True), '</div>',
        '<div class="toc"><h1>목차</h1>', *toc_rows, '</div></section>',
    ]
    for title, name in CHAPTERS:
        parts.extend([f'<section class="chapter"><h1>{title}</h1>', rendered(name), '</section>'])
    parts.extend(['<section class="chapter"><h1>6. 폐기된 설정과 실험</h1>', rendered('discarded-settings.md')])
    for title, name in SUBCHAPTERS:
        parts.extend([f'<section class="subchapter"><h2>{title}</h2>', rendered(f'discarded-settings/{name}', nested=True), '</section>'])
    parts.append('</section>')
    parts.extend(['<section class="references"><h1>참고문헌</h1>'])
    for ref in REFS:
        parts.append(f'<div class="reference"><div class="reference-inner">{ref}</div></div>')
    parts.extend(['</section></body></html>'])
    return '\n'.join(parts)


def print_pdf():
    subprocess.run([
        'google-chrome', '--headless', '--no-sandbox', '--disable-gpu',
        '--disable-dev-shm-usage', '--allow-file-access-from-files',
        '--no-pdf-header-footer', '--user-data-dir=/tmp/speedgraph-report-chrome',
        f'--print-to-pdf={PDF}', HTML.as_uri(),
    ], check=True, capture_output=True, text=True)


def discover_pages() -> dict[str, int]:
    reader = PdfReader(PDF)
    mapping = {'초록': 2}
    normalize = lambda value: re.sub(r'\s+', '', value)
    for page_number, page in enumerate(reader.pages, 1):
        if page_number <= 2:
            continue
        text = page.extract_text() or ''
        lines = [normalize(line) for line in text.splitlines()]
        for title in TOC:
            if title in mapping:
                continue
            if normalize(title) in lines:
                mapping[title] = page_number
    missing = [x for x in TOC if x not in mapping]
    if missing:
        raise RuntimeError(f'TOC headings not found: {missing}')
    return mapping


def main():
    HTML.parent.mkdir(parents=True, exist_ok=True)
    PDF.parent.mkdir(parents=True, exist_ok=True)
    HTML.write_text(html_document({}), encoding='utf-8')
    print_pdf()
    for _ in range(3):
        pages = discover_pages()
        HTML.write_text(html_document(pages), encoding='utf-8')
        print_pdf()
        if pages == discover_pages():
            break
    else:
        raise RuntimeError('TOC pagination did not stabilize')
    print(PDF)
    print(f'pages: {len(PdfReader(PDF).pages)}')


if __name__ == '__main__':
    main()
