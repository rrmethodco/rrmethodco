"""
Restore — Investor Pitch Deck v1
Generates restore-pitch-deck-v1.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from copy import deepcopy
import os

# ── BRAND ────────────────────────────────────────────────────────────────
TEAL = RGBColor(0x0F, 0x76, 0x6E)        # brand-700
TEAL_DARK = RGBColor(0x11, 0x5E, 0x59)   # brand-800
TEAL_LIGHT = RGBColor(0xCC, 0xFB, 0xF1)  # brand-100
SLATE_900 = RGBColor(0x0F, 0x17, 0x2A)
SLATE_700 = RGBColor(0x33, 0x41, 0x55)
SLATE_500 = RGBColor(0x64, 0x74, 0x8B)
SLATE_400 = RGBColor(0x94, 0xA3, 0xB8)
SLATE_200 = RGBColor(0xE2, 0xE8, 0xF0)
SLATE_50 = RGBColor(0xF8, 0xFA, 0xFC)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
ROSE = RGBColor(0xE1, 0x1D, 0x48)
EMERALD = RGBColor(0x05, 0x96, 0x69)
AMBER = RGBColor(0xD9, 0x77, 0x06)

FONT = "Calibri"  # widely available; client can switch to Gotham later

# ── 16:9 SETUP ───────────────────────────────────────────────────────────
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
SW, SH = prs.slide_width, prs.slide_height

BLANK_LAYOUT = prs.slide_layouts[6]


def add_slide():
    s = prs.slides.add_slide(BLANK_LAYOUT)
    return s


def add_rect(slide, x, y, w, h, fill, line=None):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line
        shape.line.width = Pt(0.5)
    shape.shadow.inherit = False
    return shape


def add_text(slide, x, y, w, h, text, *, size=14, bold=False, color=SLATE_900,
             align=PP_ALIGN.LEFT, font=FONT, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Emu(0)
    tf.margin_top = tf.margin_bottom = Emu(0)
    tf.vertical_anchor = anchor
    if not isinstance(text, list):
        text = [text]
    for i, line in enumerate(text):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        if isinstance(line, dict):
            run = p.add_run()
            run.text = line["text"]
            run.font.name = font
            run.font.size = Pt(line.get("size", size))
            run.font.bold = line.get("bold", bold)
            run.font.color.rgb = line.get("color", color)
        else:
            run = p.add_run()
            run.text = line
            run.font.name = font
            run.font.size = Pt(size)
            run.font.bold = bold
            run.font.color.rgb = color
    return tb


def chrome(slide, slide_num, total, label=None):
    """Brand mark + slide number footer on every slide."""
    # Footer brand
    add_rect(slide, Inches(0.6), Inches(7.05), Inches(0.18), Inches(0.18), TEAL)
    add_text(slide, Inches(0.85), Inches(6.99), Inches(2), Inches(0.3),
             "Restore", size=10, bold=True, color=SLATE_700)
    if label:
        add_text(slide, Inches(2.0), Inches(7.0), Inches(6), Inches(0.3),
                 label, size=9, color=SLATE_400)
    add_text(slide, Inches(11.5), Inches(7.0), Inches(1.3), Inches(0.3),
             f"{slide_num} / {total}", size=9, color=SLATE_400, align=PP_ALIGN.RIGHT)


def add_chip(slide, x, y, label, *, fill=TEAL_LIGHT, color=TEAL_DARK, size=10):
    """Small uppercase pill label."""
    w = Inches(max(0.7, len(label) * 0.085 + 0.4))
    h = Inches(0.32)
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    shape.adjustments[0] = 0.5
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.fill.background()
    tf = shape.text_frame
    tf.margin_left = Emu(0)
    tf.margin_right = Emu(0)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run = p.add_run()
    run.text = label
    run.font.name = FONT
    run.font.size = Pt(size)
    run.font.bold = True
    run.font.color.rgb = color
    return shape


# Slide titles for chrome label
TITLES = []
def title_block(slide, eyebrow, title, *, eyebrow_color=TEAL):
    add_text(slide, Inches(0.6), Inches(0.6), Inches(8), Inches(0.3),
             eyebrow.upper(), size=11, bold=True, color=eyebrow_color)
    add_text(slide, Inches(0.6), Inches(0.95), Inches(12), Inches(0.9),
             title, size=36, bold=True, color=SLATE_900)


# ────────────────────────────────────────────────────────────────────────
# SLIDE 1 — TITLE
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
add_rect(s, Inches(0), Inches(0), SW, SH, WHITE)
# Subtle teal gradient panel bottom-left
add_rect(s, Inches(0), Inches(5.5), Inches(5), Inches(2), TEAL)
# Brand mark
add_rect(s, Inches(0.8), Inches(0.8), Inches(0.6), Inches(0.6), TEAL)
add_text(s, Inches(1.55), Inches(0.85), Inches(2), Inches(0.5),
         "Restore", size=18, bold=True, color=SLATE_900)
# Hero
add_text(s, Inches(0.8), Inches(2.4), Inches(11), Inches(1.3),
         "AI that wins dental claims back.",
         size=58, bold=True, color=SLATE_900)
add_text(s, Inches(0.8), Inches(3.9), Inches(10), Inches(0.6),
         "Pre-authorizations, claim appeals, and referral letters — drafted from your PMS, approved in one click. Carrier intelligence that gets smarter every week.",
         size=18, color=SLATE_500)
# Footer credentials
add_text(s, Inches(0.8), Inches(6.2), Inches(8), Inches(0.4),
         "Investor pitch · Seed round · 2026", size=11, bold=True, color=WHITE)
add_text(s, Inches(0.8), Inches(6.55), Inches(8), Inches(0.4),
         "restore-demo.vercel.app · github.com/rrmethodco/rrmethodco",
         size=10, color=TEAL_LIGHT)
TITLES.append(("Title", None))


# ────────────────────────────────────────────────────────────────────────
# SLIDE 2 — PROBLEM A
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "The bleed", "Carriers deny 20-30% of valid claims. Most practices give up.")
# Left col — narrative
add_text(s, Inches(0.6), Inches(2.1), Inches(7), Inches(3.8),
         [
             {"text": "An office manager bills at ~$40/hr. A 90-minute appeal letter for a claim that ", "size": 14, "color": SLATE_700},
             {"text": "might", "size": 14, "color": SLATE_700, "bold": True},
             {"text": " get paid in three months is a losing bet — so it doesn't get written.\n", "size": 14, "color": SLATE_700},
             {"text": "\n", "size": 8},
             {"text": "Endo specifically: $5K-$15K claims routinely written off because no office manager has 90 minutes to fight a carrier.\n", "size": 14, "color": SLATE_700},
             {"text": "\n", "size": 8},
             {"text": "And generic AI text generators don't fix this. Every carrier wants a different narrative. Without per-carrier intelligence, generic appeals lose 60-70% of the time.", "size": 14, "color": SLATE_700},
         ], size=14)
# Right col — stat block
add_rect(s, Inches(8.2), Inches(2.0), Inches(4.5), Inches(4.5), SLATE_50)
add_text(s, Inches(8.5), Inches(2.2), Inches(4), Inches(0.4),
         "THE MATH TODAY", size=10, bold=True, color=SLATE_500)
stats = [
    ("$500K–$2M", "annually written off per practice in justified revenue"),
    ("90+ min", "of office-manager time per appeal letter — labor cost often exceeds expected recovery"),
    ("35-50%", "success rate when practices draft appeals themselves"),
    ("No learning loop", "every appeal a practice writes loses its lessons the moment the case closes"),
]
y = 2.7
for headline, desc in stats:
    add_text(s, Inches(8.5), Inches(y), Inches(4.0), Inches(0.4),
             headline, size=16, bold=True, color=ROSE)
    add_text(s, Inches(8.5), Inches(y + 0.4), Inches(4.0), Inches(0.7),
             desc, size=11, color=SLATE_700)
    y += 0.95
chrome(s, 2, 16, "Problem A — The bleed")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 3 — PROBLEM B
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Problem", "Why practices don't appeal — even when they should.")
panels = [
    ("Time cost > revenue probability",
     "Office manager billable at ~$40/hr. 90 min appeal = $60 cost. 50% win rate × $500 avg = $250 EV. The practice breaks even at best."),
    ("Every carrier wants a different narrative",
     "Cigna wants anatomical specificity. Delta wants ADA-CDT-exact terminology. MetLife wants conservative-alternatives-considered language. Generic letters lose 60-70% of the time."),
    ("No learning loop",
     "This appeal lost? Next case gets the same flawed template. Practice has zero visibility into why denials cluster. Carrier intelligence dies with the person who drafted the letter."),
]
x = 0.6
for headline, body in panels:
    add_rect(s, Inches(x), Inches(2.2), Inches(4.05), Inches(4.0), SLATE_50)
    add_rect(s, Inches(x), Inches(2.2), Inches(0.15), Inches(4.0), TEAL)
    add_text(s, Inches(x + 0.35), Inches(2.4), Inches(3.6), Inches(0.6),
             headline, size=16, bold=True, color=SLATE_900)
    add_text(s, Inches(x + 0.35), Inches(3.1), Inches(3.6), Inches(3.0),
             body, size=12, color=SLATE_700)
    x += 4.3
chrome(s, 3, 16, "Problem B — Why it persists")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 4 — WHY NOW
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Why now", "Three converging shifts make this practical in 2026.")
items = [
    ("01", "LLM reasoning extracts carrier patterns at scale",
     "Read 1,000 EOBs across one carrier, identify denial clusters. Inference cost <$0.10 per narrative. Vision models parse claim forms and clinical notes at speed."),
    ("02", "Dental PMS integrations have matured",
     "PBS Endo, TDO, Endovision, Dentrix, Open Dental all stream events in real time. New TX plans, EOBs, completed treatments — live webhooks. No new login friction for staff."),
    ("03", "Sophisticated buyers + BAA-grade AI",
     "DSO consolidation (16% → 32% of practices) creates RCM-aware buyers. Endo specifically measures insurance leakage as a P&L line. Anthropic API ships BAA out of the box — compliance friction = zero."),
]
x = 0.6
for num, headline, body in items:
    add_rect(s, Inches(x), Inches(2.2), Inches(4.05), Inches(4.2), WHITE, line=SLATE_200)
    add_text(s, Inches(x + 0.35), Inches(2.4), Inches(2), Inches(0.7),
             num, size=32, bold=True, color=TEAL)
    add_text(s, Inches(x + 0.35), Inches(3.1), Inches(3.6), Inches(0.7),
             headline, size=14, bold=True, color=SLATE_900)
    add_text(s, Inches(x + 0.35), Inches(4.0), Inches(3.6), Inches(2.4),
             body, size=11, color=SLATE_700)
    x += 4.3
chrome(s, 4, 16, "Why now")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 5 — SOLUTION
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Solution", "Watch. Draft. Approve. Done.")
add_text(s, Inches(0.6), Inches(2.0), Inches(11), Inches(0.7),
         "Restore lives inside the practice's PMS. When something happens that needs a response, we draft it. The office manager reviews and submits in one click. Submission to clearinghouse + PMS document center is autonomous.",
         size=14, color=SLATE_700)
steps = [
    ("01", "Trigger", "PMS webhook fires.\nNew TX plan, EOB with denial code, treatment marked complete."),
    ("02", "Draft", "Restore reads case context.\nPer-carrier intelligence applied. Confidence rationale shown.\nSometimes the answer is DO NOT APPEAL."),
    ("03", "Review", "Office manager opens inbox.\n60-90 second review.\nApprove, edit, or skip with reason."),
    ("04", "Submit", "Auto-submits to clearinghouse.\nLogs to PMS Doc Center.\nAudit trail captured."),
]
x = 0.6
for num, headline, body in steps:
    add_rect(s, Inches(x), Inches(3.2), Inches(2.95), Inches(3.1), SLATE_50)
    add_text(s, Inches(x + 0.25), Inches(3.4), Inches(2), Inches(0.5),
             num, size=22, bold=True, color=TEAL)
    add_text(s, Inches(x + 0.25), Inches(4.0), Inches(2.5), Inches(0.5),
             headline, size=15, bold=True, color=SLATE_900)
    add_text(s, Inches(x + 0.25), Inches(4.55), Inches(2.5), Inches(2),
             body, size=10, color=SLATE_700)
    x += 3.1
add_text(s, Inches(0.6), Inches(6.4), Inches(12), Inches(0.4),
         "Result: 90 minutes of work compressed to 90 seconds of review.",
         size=13, bold=True, color=TEAL_DARK, align=PP_ALIGN.CENTER)
chrome(s, 5, 16, "Solution")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 6 — THE MOAT
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "The moat", "Carrier intelligence that compounds.")
add_text(s, Inches(0.6), Inches(2.0), Inches(11), Inches(0.6),
         "Every approved claim makes the next narrative smarter. Every denied claim teaches us not to make that mistake again — across the customer base.",
         size=14, color=SLATE_700)
sections = [
    ("Denial patterns", "Cigna: 75% of denials cluster on codes X, Y, Z\nDelta: 41% on D3331 bundling\nMetLife: 36% on apicoectomy 'try retreatment first'"),
    ("Narrative preferences", "Cigna: lead with anatomical specificity\nDelta: ADA CDT-exact terminology\nAetna: front-load financial impact"),
    ("DO NOT APPEAL patterns", "Plan-level exclusions, exhausted caps, contractual limits.\nAppealing degrades carrier credibility for the cases that DO matter."),
    ("Escalation paths", "When peer-to-peer\nWhen DOI complaint\nWhich carriers respond on first ask vs. require 3 attempts"),
]
x = 0.6
y = 2.95
for i, (h, b) in enumerate(sections):
    col = i % 2
    row = i // 2
    cx = x + col * 6.05
    cy = y + row * 1.85
    add_rect(s, Inches(cx), Inches(cy), Inches(5.8), Inches(1.7), WHITE, line=SLATE_200)
    add_text(s, Inches(cx + 0.25), Inches(cy + 0.18), Inches(5.4), Inches(0.4),
             h, size=14, bold=True, color=TEAL_DARK)
    add_text(s, Inches(cx + 0.25), Inches(cy + 0.6), Inches(5.4), Inches(1.0),
             b, size=10.5, color=SLATE_700)
add_text(s, Inches(0.6), Inches(6.7), Inches(12), Inches(0.4),
         "1 practice finds a pattern → 1,000 practices learn instantly. The intelligence isn't the AI; it's the feedback loop.",
         size=12, bold=True, color=TEAL_DARK, align=PP_ALIGN.CENTER)
chrome(s, 6, 16, "The moat")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 7 — DIFFERENTIATION
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Differentiation", "Three things no one else pairs together.")
# Comparison table
tbl_x = 0.6
tbl_y = 2.2
col_widths = [4.0, 2.05, 2.05, 2.05, 2.05]
headers = ["Capability", "Restore", "Vyne Dental", "DentalRobot", "Pearl AI"]
rows = [
    ("Carrier intelligence (per-carrier)", "✓", "Legacy rules", "Generic", "—"),
    ("Case lifecycle threading", "✓", "Query-based", "Single doc", "—"),
    ("DO NOT APPEAL discipline", "✓", "—", "—", "—"),
    ("Real-time PMS integration", "✓", "Manual upload", "Manual upload", "Imaging only"),
    ("Autonomous submission", "✓", "Draft only", "Draft only", "—"),
]
# Header row
x_acc = tbl_x
for i, h in enumerate(headers):
    add_rect(s, Inches(x_acc), Inches(tbl_y), Inches(col_widths[i]), Inches(0.5), TEAL)
    add_text(s, Inches(x_acc + 0.1), Inches(tbl_y + 0.08), Inches(col_widths[i]), Inches(0.4),
             h, size=12, bold=True, color=WHITE,
             align=PP_ALIGN.LEFT if i == 0 else PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    x_acc += col_widths[i]
# Data rows
ry = tbl_y + 0.5
for r_i, row in enumerate(rows):
    fill = WHITE if r_i % 2 == 0 else SLATE_50
    x_acc = tbl_x
    for i, cell in enumerate(row):
        add_rect(s, Inches(x_acc), Inches(ry), Inches(col_widths[i]), Inches(0.55), fill, line=SLATE_200)
        align = PP_ALIGN.LEFT if i == 0 else PP_ALIGN.CENTER
        bold = i == 0 or cell == "✓"
        color = TEAL_DARK if cell == "✓" else SLATE_700
        add_text(s, Inches(x_acc + 0.1), Inches(ry + 0.13), Inches(col_widths[i]), Inches(0.4),
                 cell, size=11, bold=bold, color=color, align=align, anchor=MSO_ANCHOR.MIDDLE)
        x_acc += col_widths[i]
    ry += 0.55
add_text(s, Inches(0.6), Inches(6.5), Inches(12), Inches(0.4),
         "The gap we fill: carrier intelligence that learns + case threading that doesn't break + the discipline to say 'don't appeal.'",
         size=12, bold=True, color=TEAL_DARK, align=PP_ALIGN.CENTER)
chrome(s, 7, 16, "Differentiation")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 8 — MARKET
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Market size", "$135M SOM. $870M SAM. $4.5B+ TAM.")
add_text(s, Inches(0.6), Inches(2.0), Inches(11), Inches(0.5),
         "Bottom-up. Endo first because density of pre-auth + appeal events per practice is 3-5× general dentistry.",
         size=12, color=SLATE_500)
# Three concentric segments side-by-side
mkt = [
    ("SOM", "Endodontic practices", "4,486", "$30K ACV", "$135M", TEAL_DARK,
     "PBS Endo + TDO + Endovision coverage. Win endo, the carrier intelligence layer compounds."),
    ("SAM", "Dental specialty (endo, OS, perio, ortho, pedo)", "29,015", "$30K ACV", "$870M", TEAL,
     "All ADA-recognized specialties. Insurance-heavy workflows."),
    ("TAM", "All US dental + DSO premium", "178,000+", "$25K blended", "$4.5B+", SLATE_500,
     "GP at lower ACV. DSO contracts ($50-150K build + $5-15K/mo) lift blended ARPU."),
]
x = 0.6
for label, desc, count, acv, dollars, color, body in mkt:
    add_rect(s, Inches(x), Inches(2.65), Inches(4.05), Inches(4.0), WHITE, line=SLATE_200)
    add_rect(s, Inches(x), Inches(2.65), Inches(4.05), Inches(0.5), color)
    add_text(s, Inches(x + 0.25), Inches(2.73), Inches(3), Inches(0.4),
             label, size=14, bold=True, color=WHITE)
    add_text(s, Inches(x + 0.25), Inches(3.3), Inches(3.6), Inches(0.7),
             desc, size=11, color=SLATE_500)
    add_text(s, Inches(x + 0.25), Inches(4.0), Inches(3.6), Inches(1),
             dollars, size=32, bold=True, color=color)
    add_text(s, Inches(x + 0.25), Inches(5.0), Inches(3.6), Inches(0.4),
             f"{count} practices · {acv}", size=11, bold=True, color=SLATE_700)
    add_text(s, Inches(x + 0.25), Inches(5.5), Inches(3.6), Inches(1.1),
             body, size=10, color=SLATE_500)
    x += 4.3
add_text(s, Inches(0.6), Inches(6.85), Inches(12), Inches(0.3),
         "Sources: ADA HPI 2025 · Becker's Dental 2026 · Grand View Research (DSO 2025) · Towards Healthcare 2025",
         size=8, color=SLATE_400, align=PP_ALIGN.CENTER)
chrome(s, 8, 16, "Market — TAM/SAM/SOM")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 9 — UNIT ECONOMICS
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Unit economics", "14-day customer payback. 86% gross margin.")
# Two side-by-side panels
# Left — Customer ROI
add_rect(s, Inches(0.6), Inches(2.2), Inches(6.05), Inches(4.2), SLATE_50)
add_text(s, Inches(0.85), Inches(2.4), Inches(5.5), Inches(0.5),
         "CUSTOMER ROI", size=12, bold=True, color=SLATE_500)
add_text(s, Inches(0.85), Inches(2.85), Inches(5.5), Inches(0.5),
         "4-doc endo practice", size=14, bold=True, color=SLATE_900)
roi_rows = [
    ("Subscription", "$18,000/yr", SLATE_900),
    ("Revenue recovered", "$214,000/yr", EMERALD),
    ("Hours saved (725 × $35)", "$25,375/yr", EMERALD),
    ("Total annual value", "$239,000", EMERALD),
    ("Payback period", "14 days", TEAL_DARK),
    ("ROI multiple", "13.3×", TEAL_DARK),
]
y = 3.45
for label, val, color in roi_rows:
    add_text(s, Inches(0.85), Inches(y), Inches(3.5), Inches(0.4),
             label, size=11, color=SLATE_500)
    add_text(s, Inches(4.4), Inches(y), Inches(2.0), Inches(0.4),
             val, size=12, bold=True, color=color, align=PP_ALIGN.RIGHT)
    y += 0.42

# Right — SaaS economics
add_rect(s, Inches(7.0), Inches(2.2), Inches(5.7), Inches(4.2), WHITE, line=SLATE_200)
add_text(s, Inches(7.25), Inches(2.4), Inches(5.0), Inches(0.5),
         "SAAS ECONOMICS", size=12, bold=True, color=TEAL_DARK)
add_text(s, Inches(7.25), Inches(2.85), Inches(5.0), Inches(0.5),
         "Per practice", size=14, bold=True, color=SLATE_900)
saas_rows = [
    ("ACV (sub + amortized build)", "$22,167"),
    ("Gross margin", "86%"),
    ("CAC (Year 1 blended)", "$9,500"),
    ("CAC payback", "5.0 months"),
    ("Logo churn (assumption)", "5% annual"),
    ("Net dollar retention", "115%"),
    ("LTV (4yr life)", "$74,500"),
    ("LTV / CAC", "7.8×"),
]
y = 3.45
for label, val in saas_rows:
    add_text(s, Inches(7.25), Inches(y), Inches(3.2), Inches(0.4),
             label, size=11, color=SLATE_500)
    add_text(s, Inches(10.5), Inches(y), Inches(2), Inches(0.4),
             val, size=12, bold=True, color=SLATE_900, align=PP_ALIGN.RIGHT)
    y += 0.35
chrome(s, 9, 16, "Unit economics")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 10 — 3-YEAR MODEL
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Financial model", "$0 → $5.4M ARR in 36 months.")
# Table headers
tbl_x = 0.6
tbl_y = 2.2
cols = ["Period", "Practices", "MRR ($K)", "ARR ($K)", "Gross Profit ($K)", "Opex ($K)", "EBITDA ($K)"]
col_w = [1.6, 1.45, 1.45, 1.6, 1.85, 1.55, 1.65]
data = [
    ("Q4'26 pilot", "1", "$1.5", "$18", "$15", "$180", "($165)"),
    ("Q2'27", "8", "$13", "$156", "$134", "$310", "($176)"),
    ("Q4'27", "28", "$50", "$600", "$516", "$475", "$41"),
    ("Q2'28", "65", "$128", "$1,536", "$1,321", "$640", "$681"),
    ("Q4'28", "130", "$260", "$3,120", "$2,683", "$880", "$1,803"),
    ("Q4'29", "240 + 4 DSOs", "$450", "$5,400", "$4,644", "$1,400", "$3,244"),
]
# Header
x_acc = tbl_x
for i, c in enumerate(cols):
    add_rect(s, Inches(x_acc), Inches(tbl_y), Inches(col_w[i]), Inches(0.45), TEAL_DARK)
    add_text(s, Inches(x_acc + 0.06), Inches(tbl_y + 0.08), Inches(col_w[i]), Inches(0.35),
             c, size=10, bold=True, color=WHITE,
             align=PP_ALIGN.LEFT if i == 0 else PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)
    x_acc += col_w[i]
# Rows
ry = tbl_y + 0.45
for r_i, row in enumerate(data):
    fill = WHITE if r_i % 2 == 0 else SLATE_50
    is_breakeven = "Q4'27" in row[0]
    if is_breakeven:
        fill = TEAL_LIGHT
    x_acc = tbl_x
    for i, cell in enumerate(row):
        add_rect(s, Inches(x_acc), Inches(ry), Inches(col_w[i]), Inches(0.42), fill, line=SLATE_200)
        align = PP_ALIGN.LEFT if i == 0 else PP_ALIGN.RIGHT
        color = SLATE_900
        if i == 6 and "(" in cell:
            color = ROSE
        elif i == 6 and "$" in cell:
            color = EMERALD
        add_text(s, Inches(x_acc + 0.06), Inches(ry + 0.1), Inches(col_w[i] - 0.1), Inches(0.3),
                 cell, size=10.5, bold=is_breakeven, color=color, align=align, anchor=MSO_ANCHOR.MIDDLE)
        x_acc += col_w[i]
    ry += 0.42
# Assumptions footer
add_text(s, Inches(0.6), Inches(6.0), Inches(12), Inches(0.3),
         "ASSUMPTIONS", size=10, bold=True, color=SLATE_500)
add_text(s, Inches(0.6), Inches(6.3), Inches(12), Inches(0.6),
         "Logo churn 5% · NDR 115% (skill expansion + DSO upsell) · CAC $11K → $7.5K Y1→Y3 · Build fees deferred over 12mo · Cash break-even Q1'29 at ~$3M ARR · 4 DSO contracts in Y3 = $360K incremental ARR",
         size=10, color=SLATE_700)
chrome(s, 10, 16, "Financial model")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 11 — PRICING
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Pricing", "Three tiers. Same engine. Different leverage.")
add_text(s, Inches(0.6), Inches(2.0), Inches(11), Inches(0.5),
         "We don't price per seat. We price per insurance complexity.",
         size=12, color=SLATE_500)
tiers = [
    ("Solo Practice", "1-2 doc endo / specialty", "$10,000", "$1,250/mo", "$120K+ recovered/yr",
     ["All 3 core skills", "1 PMS integration", "Standard support"], SLATE_50, SLATE_900),
    ("Group Practice", "3-8 doc, multi-loc", "$15,000", "$2,000/mo", "$250-500K recovered/yr",
     ["All Solo features", "Multi-location dashboard", "Carrier benchmarking", "Priority queue"],
     TEAL_LIGHT, TEAL_DARK),
    ("DSO / Enterprise", "10+ practices", "$50K-$150K", "$5K-$15K/mo", "$2M+ recovered/yr at 50 locations",
     ["All Group features", "SSO + custom BAA", "Custom carrier playbooks", "API access", "Dedicated CSM"],
     SLATE_900, WHITE),
]
x = 0.6
for name, desc, build, sub, anchor, feats, fill, text_color in tiers:
    add_rect(s, Inches(x), Inches(2.65), Inches(4.05), Inches(4.3), fill)
    add_text(s, Inches(x + 0.3), Inches(2.85), Inches(3.6), Inches(0.45),
             name, size=18, bold=True, color=text_color)
    add_text(s, Inches(x + 0.3), Inches(3.35), Inches(3.6), Inches(0.4),
             desc, size=10, color=text_color if text_color == WHITE else SLATE_500)
    add_text(s, Inches(x + 0.3), Inches(3.85), Inches(3.6), Inches(0.4),
             f"Build: {build}", size=11, bold=True, color=text_color)
    add_text(s, Inches(x + 0.3), Inches(4.2), Inches(3.6), Inches(0.4),
             f"Subscription: {sub}", size=11, bold=True, color=text_color)
    add_text(s, Inches(x + 0.3), Inches(4.65), Inches(3.6), Inches(0.4),
             "→ " + anchor, size=10, bold=True,
             color=EMERALD if text_color != WHITE else TEAL_LIGHT)
    fy = 5.15
    for f in feats:
        add_text(s, Inches(x + 0.3), Inches(fy), Inches(3.6), Inches(0.3),
                 "• " + f, size=10,
                 color=text_color if text_color == WHITE else SLATE_700)
        fy += 0.3
    x += 4.3
chrome(s, 11, 16, "Pricing")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 12 — GTM
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Go-to-market", "From pilot to $5M ARR in three channels.")
# Channel table
tbl_x = 0.6
tbl_y = 2.15
cols = ["Channel", "Y1-Y3 logos", "CAC", "Conversion", "Logic"]
col_w = [3.0, 1.6, 1.3, 1.7, 4.55]
header_data = cols
rows = [
    ("AAE Annual + regional", "60", "$8K", "8% booth→close", "Endo's mecca · 8K members · we exhibit Y1, sponsor Y2"),
    ("Study clubs / KOL referrals", "110", "$4K", "25% warm→close", "Endo is a small world · pilot becomes 4 case studies · NPS loop"),
    ("Cold outbound (top-200 endo groups)", "50", "$14K", "6% BDR→close", "Apollo + ZoomInfo list · founder-led · high-ACV groups"),
    ("DSO BD (Heartland, Pacific, MB2)", "4 DSOs / 20 logos", "$35K", "1 of 8 convs", "Long cycle (9-12mo) · founder-led · PE-friendly economics"),
]
# Header
x_acc = tbl_x
for i, c in enumerate(cols):
    add_rect(s, Inches(x_acc), Inches(tbl_y), Inches(col_w[i]), Inches(0.45), TEAL_DARK)
    add_text(s, Inches(x_acc + 0.1), Inches(tbl_y + 0.08), Inches(col_w[i]), Inches(0.35),
             c, size=11, bold=True, color=WHITE,
             align=PP_ALIGN.LEFT if i == 0 or i == 4 else PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    x_acc += col_w[i]
ry = tbl_y + 0.45
for r_i, row in enumerate(rows):
    fill = WHITE if r_i % 2 == 0 else SLATE_50
    x_acc = tbl_x
    for i, cell in enumerate(row):
        add_rect(s, Inches(x_acc), Inches(ry), Inches(col_w[i]), Inches(0.55), fill, line=SLATE_200)
        align = PP_ALIGN.LEFT if i == 0 or i == 4 else PP_ALIGN.CENTER
        bold = i == 0
        color = SLATE_900 if i < 4 else SLATE_700
        size = 10 if i == 4 else 11
        add_text(s, Inches(x_acc + 0.1), Inches(ry + 0.12), Inches(col_w[i] - 0.15), Inches(0.4),
                 cell, size=size, bold=bold, color=color, align=align, anchor=MSO_ANCHOR.MIDDLE)
        x_acc += col_w[i]
    ry += 0.55
add_rect(s, Inches(0.6), Inches(5.4), Inches(12.1), Inches(0.7), TEAL_LIGHT)
add_text(s, Inches(0.85), Inches(5.55), Inches(12), Inches(0.5),
         "Blended CAC $8.5K vs. ACV $22.2K = 2.6× first-year payback. 240 endo practices = 5.3% of addressable endo market.",
         size=12, bold=True, color=TEAL_DARK, anchor=MSO_ANCHOR.MIDDLE)
add_text(s, Inches(0.6), Inches(6.3), Inches(12), Inches(0.5),
         "Funnel example (study club): 200 referred convos → 80 demos → 40 pilots → 28 paid (35% pilot-to-paid)",
         size=11, color=SLATE_500)
chrome(s, 12, 16, "Go-to-market")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 13 — TRACTION
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Traction", "From pilot to playbook to portfolio.")
phases = [
    ("PILOT", "June 2026 → December 2026",
     ["Design partner: founder's mother's 4-doc endo practice (PBS Endo)",
      "Live: pre-auth narratives, claim appeals (with DO NOT APPEAL scoring), referrals",
      "Baseline appeal success: 40% → Target: 60%+ by month 4",
      "Expected outcome: $150-200K annual revenue impact (1 practice)"]),
    ("YEAR 1", "Jan – Dec 2027",
     ["50 endo practices live",
      "10,000+ claims/mo flowing through carrier intelligence layer",
      "PBS Endo + TDO + Endovision integrations hardened",
      "Cohort avg appeal success rate: 55%"]),
    ("YEAR 2+", "2028 onward",
     ["Specialty expansion: oral surgery (750), perio (1,200), ortho (2,500)",
      "DSO platform integrations: Heartland, Pacific Dental, MB2",
      "Network effects on carrier intelligence compound",
      "Long-term: carriers themselves licensing Restore for adjudication"]),
]
y = 2.15
for label, period, bullets in phases:
    add_rect(s, Inches(0.6), Inches(y), Inches(0.18), Inches(1.5), TEAL)
    add_text(s, Inches(0.95), Inches(y), Inches(2.5), Inches(0.4),
             label, size=14, bold=True, color=TEAL_DARK)
    add_text(s, Inches(0.95), Inches(y + 0.4), Inches(3.5), Inches(0.4),
             period, size=10, color=SLATE_500)
    bx = 4.5
    by = y
    for b in bullets:
        add_text(s, Inches(bx), Inches(by), Inches(8), Inches(0.4),
                 "·  " + b, size=11, color=SLATE_700)
        by += 0.32
    y += 1.65
chrome(s, 13, 16, "Traction")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 14 — VISION
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Vision", "Restore as infrastructure.")
add_text(s, Inches(0.6), Inches(2.0), Inches(11.5), Inches(0.5),
         "In five years, Restore is the operating system for dental insurance — inside practices and inside carrier networks.",
         size=14, color=SLATE_700)
layers = [
    ("Y1-Y2", "Practice insurance operations",
     "Restore = the brain for appeal strategy + pre-auth management.\nEndo → Oral surgery → Perio → Ortho → Pedo → GP.",
     TEAL_DARK),
    ("Y3-Y4", "DSO intelligence layer",
     "Heartland / Pacific / MB2 license Restore for portfolio intelligence. DSOs use it for portfolio-level insurance revenue optimization.",
     TEAL),
    ("Y5+", "Carrier adjudication (the inverse market)",
     "Carriers license Restore to grade appeals. \"Should we approve or deny this?\" Restore becomes the industry standard.",
     SLATE_500),
]
y = 2.85
for label, headline, body, color in layers:
    add_rect(s, Inches(0.6), Inches(y), Inches(1.4), Inches(1.0), color)
    add_text(s, Inches(0.6), Inches(y + 0.3), Inches(1.4), Inches(0.5),
             label, size=14, bold=True, color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(2.2), Inches(y + 0.05), Inches(10), Inches(0.45),
             headline, size=15, bold=True, color=SLATE_900)
    add_text(s, Inches(2.2), Inches(y + 0.5), Inches(10), Inches(0.6),
             body, size=11, color=SLATE_700)
    y += 1.25
add_text(s, Inches(0.6), Inches(6.7), Inches(12), Inches(0.4),
         "Same intelligence, compounding value at every layer. $150B dental market with $40B insurance friction.",
         size=12, bold=True, color=TEAL_DARK, align=PP_ALIGN.CENTER)
chrome(s, 14, 16, "Vision")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 15 — TEAM
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "Team", "Hospitality operator. Honest design partner. Financial discipline.")
panels = [
    ("FOUNDER", "Ross Richardson",
     ["EVP Finance & Accounting, Method Co.\n(Philadelphia hospitality, 10 hotels + F&B)",
      "Led financial operations across 2,000+ employees",
      "Obsessed with: systems that scale, unit economics that don't lie, operator feedback loops",
      "Zero prior healthcare startup experience — zero dogma"]),
    ("DESIGN PARTNER", "4-doc endodontic practice (PBS Endo)",
     ["15+ years operating · $2M+/yr in insurance disputes",
      "Weekly product feedback (she tells me what doesn't work in 30 sec)",
      "Not a cheerleader — a customer who will switch if it's broken",
      "Product-market fit pressure-tests in real time"]),
    ("ADVISORY THESIS", "Building",
     ["Insurance ops experts (RCM, appeal specialists)",
      "Dental PMS integration partners (PBS Endo, TDO, Dentrix)",
      "DSO executives (Heartland, Pacific, MB2)",
      "Carrier contacts for early intelligence loop"]),
]
x = 0.6
for label, name, bullets in panels:
    add_rect(s, Inches(x), Inches(2.15), Inches(4.05), Inches(4.7), WHITE, line=SLATE_200)
    add_rect(s, Inches(x), Inches(2.15), Inches(4.05), Inches(0.45), TEAL)
    add_text(s, Inches(x + 0.2), Inches(2.22), Inches(3.5), Inches(0.35),
             label, size=11, bold=True, color=WHITE, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(x + 0.2), Inches(2.75), Inches(3.7), Inches(0.5),
             name, size=14, bold=True, color=SLATE_900)
    by = 3.3
    for b in bullets:
        add_text(s, Inches(x + 0.2), Inches(by), Inches(3.7), Inches(0.7),
                 "·  " + b, size=10, color=SLATE_700)
        by += 0.85
    x += 4.3
add_text(s, Inches(0.6), Inches(6.95), Inches(12), Inches(0.3),
         "Founder who ships · customer who keeps honest · unit-economics flywheel from day one.",
         size=11, bold=True, color=TEAL_DARK, align=PP_ALIGN.CENTER)
chrome(s, 15, 16, "Team")


# ────────────────────────────────────────────────────────────────────────
# SLIDE 16 — THE ASK
# ────────────────────────────────────────────────────────────────────────
s = add_slide()
title_block(s, "The ask", "$2.5M seed → 18 months → $1.5M ARR.")
# Use of funds — left side
add_text(s, Inches(0.6), Inches(2.1), Inches(6), Inches(0.4),
         "USE OF FUNDS ($2.5M)", size=11, bold=True, color=SLATE_500)
funds = [
    ("Engineering & AI", "$1,050K", "42%", "3 engineers + 1 ML/eval · PMS integrations · carrier playbook tooling"),
    ("GTM", "$625K", "25%", "Founder-led + 1 BDR + 1 CSM · AAE booth · study club sponsorships"),
    ("Compliance", "$200K", "8%", "HIPAA audit · SOC 2 Type 1 · BAA legal · cyber insurance"),
    ("Working capital", "$400K", "16%", "DSO contract bridge (long AR) · 6mo cash buffer"),
    ("Founder + ops", "$225K", "9%", "Below-market through M18"),
]
y = 2.55
for label, amt, pct, body in funds:
    add_rect(s, Inches(0.6), Inches(y), Inches(0.5), Inches(0.5), TEAL)
    add_text(s, Inches(0.6), Inches(y + 0.1), Inches(0.5), Inches(0.3),
             pct, size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(1.25), Inches(y), Inches(2.5), Inches(0.3),
             label, size=12, bold=True, color=SLATE_900)
    add_text(s, Inches(3.7), Inches(y), Inches(1.5), Inches(0.3),
             amt, size=12, bold=True, color=TEAL_DARK)
    add_text(s, Inches(1.25), Inches(y + 0.3), Inches(5.4), Inches(0.3),
             body, size=9.5, color=SLATE_500)
    y += 0.65
# 18-month milestones — right side
add_rect(s, Inches(7.3), Inches(2.1), Inches(5.4), Inches(4.4), TEAL_LIGHT)
add_text(s, Inches(7.55), Inches(2.25), Inches(5), Inches(0.4),
         "18-MONTH MILESTONES", size=11, bold=True, color=TEAL_DARK)
miles = [
    ("65 paying practices", "$1.5M ARR run-rate"),
    ("86% gross margin", "Validated at scale"),
    ("2 DSO LOIs signed", "Heartland-tier conversations"),
    ("8,000+ resolved claims", "Carrier intelligence dataset across 25+ carriers"),
    ("Series A target", "$8-12M at $40-60M post on $4M+ ARR (Q3'28)"),
]
y = 2.75
for label, sub in miles:
    add_text(s, Inches(7.55), Inches(y), Inches(5), Inches(0.3),
             "✓  " + label, size=12, bold=True, color=SLATE_900)
    add_text(s, Inches(7.85), Inches(y + 0.3), Inches(5), Inches(0.3),
             sub, size=10, color=SLATE_500)
    y += 0.7
chrome(s, 16, 16, "The ask")


# ── SAVE ─────────────────────────────────────────────────────────────────
out = "/Users/rossrichardson/Documents/Claude/Projects/Claude Experiments/rrmethodco/pitch/restore-pitch-deck-v1.pptx"
os.makedirs(os.path.dirname(out), exist_ok=True)
prs.save(out)
print(f"Saved: {out}")
print(f"Slide count: {len(prs.slides)}")
