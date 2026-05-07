# InclusiFit — AI-Powered Adaptive Fashion & Beauty for People with Disabilities

> **Built for:** Perfect Corp × Startup World Cup Silicon Valley Hackathon 2026  
> **Prize:** $2,500 | **Deadline:** May 8, 2026  
> **Live Demo:** Deploy with `pnpm dev` → http://localhost:3000

---

## The Problem

**1.3 billion people** globally have disabilities. They shop online more than anyone — because physical stores are inaccessible, exhausting, or humiliating. Yet every e-commerce platform is built for one body type.

| Stat | Source |
|---|---|
| 71% abandon inaccessible e-commerce immediately | Business Disability Forum |
| 62% of disabled shoppers can't find comfortable clothes | RIDC 2024 |
| $47.3B in adaptive clothing demand goes unmet in the US alone | Coresight Research |
| $8 trillion global disability spending power | Return on Disability |

**The gap is not just filters. It's visualization.** Even if you find an adaptive product, you can't see how it looks on *your* body — shorter limbs, wider feet, with your AFO brace, with your hearing aid. You order blind. You return. You give up.

**InclusiFit fixes this.** Disability-aware smart filters + Perfect Corp's AI/AR virtual try-on = the first platform where people with disabilities can find clothes that fit their life and see how they look before buying.

---

## Solution

Two layers working together:

**Layer 1 — Adaptive Discovery Engine**
Smart filters that don't exist anywhere else:
- Closure type (magnetic snap / velcro / zip / button-free)
- Waistband type (elastic / adjustable / rigid)
- Fit style (loose / relaxed / compression)
- Length (petite / standard / tall)
- Footwear: AFO-compatible / wide width / small adult sizes
- Beauty: container type (pump / squeeze / twist), grip difficulty
- Voice commands: "show loose fit", "AFO only", "clear filters"

**Layer 2 — AI/AR Virtual Try-On (Perfect Corp YouCam API)**
After filtering, users see themselves in the product before buying.

---

## Perfect Corp APIs Used (13 total)

| API | Endpoint | Adaptive Use Case |
|---|---|---|
| AI Clothes VTO v3 | `/s2s/v2.0/task/cloth` | Proportional fit, loose fit, closure visualization |
| AI Shoes VTO | `/s2s/v2.0/task/shoes` | AFO-compatible footwear, wide/small sizes |
| AI Skin Analysis HD | `/s2s/v2.1/task/skin-analysis` | Accessible beauty recommendations |
| AI Makeup VTO | `/s2s/v2.0/task/makeup-vto` | Try before buying (motor disability) |
| AI Hairstyle Generator | `/s2s/v2.0/task/hair-style` | Wig/hairpiece try-on (alopecia) |
| AI Hair Color VTO | `/s2s/v2.0/task/hair-color` | Color try-on for wig shoppers |
| AI Earring VTO | `/s2s/v2.0/task/2d-vto/earring` | Hearing aid compatible jewelry |
| AI Ring VTO | `/s2s/v2.0/task/2d-vto/ring` | Jewelry try-on |
| AI Bracelet VTO | `/s2s/v2.0/task/2d-vto/bracelet` | Adaptive clasp jewelry |
| AI Watch VTO | `/s2s/v2.0/task/2d-vto/watch` | Easy-clasp watches |
| AI Necklace VTO | `/s2s/v2.0/task/2d-vto/necklace` | Magnetic clasp necklaces |
| AI Bag VTO | `/s2s/v2.0/task/bag` | Adaptive bag try-on |
| AI Hat VTO | `/s2s/v2.0/task/hat` | Hat try-on |
| AI Text-to-Image | `/s2s/v2.0/task/text-to-image` | Generate adaptive fashion visuals |
| AI Face Analyzer | `/s2s/v2.0/task/face-attr-analysis` | Face attributes for personalization |

---

## The Five User Journeys

### Journey 1: Shorter Limbs (Achondroplasia, Dwarfism)
1. Profile → select "Shorter limbs"
2. Catalog auto-filters: petite length, high waist rise
3. Select dress → upload photo → **AI Clothes VTO** renders it on their body
4. See actual length on actual body before buying

### Journey 2: Limited Dexterity (Muscular Dystrophy, MS, Parkinson's)
1. Profile → select "Limited dexterity"
2. Fashion filters: velcro/magnetic closures, elastic waistband, loose fit
3. Beauty filters: pump dispensers, easy-grip applicators
4. **AI Clothes VTO** confirms loose fit · **AI Makeup VTO** shows color before application

### Journey 3: AFO / Brace Users (GNE Myopathy, Cerebral Palsy)
1. Profile → select "AFO / brace user"
2. Catalog shows only AFO-compatible footwear
3. Upload foot photo → **AI Shoes VTO** renders shoe on their foot

### Journey 4: Hair Loss (Alopecia, Cancer Treatment)
1. Profile → select "Hair loss / wigs"
2. Upload selfie → **AI Hairstyle Generator** tries on wig styles
3. **AI Hair Color VTO** shows color options
4. Shop from home, with privacy and confidence

### Journey 5: Visual Impairment
1. **AI Skin Analysis** → results read aloud via Web Speech API
2. Products recommended by concern + container type
3. Voice commands: "show loose fit", "read my results", "AFO only"
4. Screen reader compatible throughout

---

## Features

### Pages
| Page | URL | Description |
|---|---|---|
| Landing | `/` | Cinematic hero with glassmorphic panels, feature showcase |
| Onboarding | `/profile` | 3-step: welcome → interactive demo → condition selector |
| Dashboard | `/dashboard` | Full dashboard: quick actions, analytics, settings |
| Catalog | `/catalog` | 15 adaptive products, advanced filters, voice commands |
| AI Studio | `/studio` | Upload once → 8 APIs run in parallel |
| Clothes VTO | `/tryon` | Virtual try-on with before/after comparison |
| Shoes VTO | `/shoes` | AFO-compatible footwear try-on |
| Beauty | `/beauty` | Skin analysis + makeup VTO |
| Hair & Wigs | `/hair` | Hair color + wig style try-on |
| Accessories | `/accessories` | Ring, bracelet, watch, necklace, bag, hat VTO |

### Accessibility Features
| Feature | Who It Helps |
|---|---|
| Voice commands ("show loose fit", "AFO only") | Motor disability, visual impairment |
| Skin results read aloud (Web Speech API) | Visual impairment |
| Screen reader compatible (WCAG 2.1 AA) | Visual impairment |
| Large tap targets (min 44×44px) | Motor disability, tremors |
| Session save (localStorage) | Fatigue conditions (MS, ME/CFS) |
| Before/after comparison | All users |
| Free returns banner | All users with disabilities |
| Caregiver mode toggle | Severe motor disability |
| High contrast mode toggle | Low vision |

### Adaptive Product Catalog (15 products)
- **Clothing (5):** Adaptive Wrap Dress, Velcro Tunic, Pull-On Trousers, Magnetic Zip Jacket, Adaptive Midi Skirt
- **Footwear (3):** AFO-Compatible Sneaker, Wide-Fit Loafer, Adaptive Boot with Side Zip
- **Beauty (3):** Easy-Pump Foundation, Large-Grip Lip Color, Easy-Grip Mascara
- **Hair (2):** Natural Wave Wig, Short Pixie Wig
- **Jewelry (2):** Hearing Aid Friendly Studs, Magnetic Clasp Necklace

Each product tagged with adaptive metadata: closure type, waistband, fit style, AFO compatibility, container type, grip difficulty.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Font | Inter (Google Fonts) |
| AI/AR | Perfect Corp YouCam API (13 endpoints) |
| Voice | Web Speech API (built-in browser) |
| State | React useState + localStorage |
| Deploy | Vercel |

---

## Setup

### 1. Clone & install
```bash
git clone https://github.com/Tasfia-17/Inclusift.git
cd Inclusift
pnpm install
```

### 2. Environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
PERFECT_CORP_API_KEY=your_api_key_here
```

Get your free API key + 1,000 units ($179 value):
1. Sign up at https://yce.makeupar.com
2. Go to Account → Redeem Code
3. Enter: `Pegasus1000`

### 3. Run
```bash
pnpm dev
```

Open http://localhost:3000

### 4. Deploy to Vercel
```bash
vercel --prod
# Add PERFECT_CORP_API_KEY in Vercel dashboard → Environment Variables
```

---

## API Architecture

All Perfect Corp API calls go through Next.js Route Handlers (server-side). The API key is **never exposed to the client**.

```
Browser → /api/vto/upload    → Perfect Corp file upload (pre-signed URL)
Browser → /api/vto/clothes   → POST /s2s/v2.0/task/cloth
Browser → /api/vto/clothes/[taskId] → GET poll until success
```

### Correct API formats (tested & verified)

**Clothes VTO:**
```json
{
  "src_file_id": "...",
  "ref_file_url": "https://...",
  "garment_category": "auto"
}
```

**Shoes VTO:**
```json
{
  "src_file_id": "...",
  "ref_file_url": "https://...",
  "gender": "female"
}
```

**Skin Analysis:**
```json
{
  "src_file_id": "...",
  "dst_actions": ["hd_acne", "hd_pore", "hd_moisture", ...],
  "miniserver_args": { "enable_mask_overlay": true }
}
```

**File Upload:**
```json
{
  "files": [{
    "file_name": "photo.jpg",
    "file_size": 123456,
    "content_type": "image/jpeg"
  }]
}
```

---

## Business Case

| Metric | Value |
|---|---|
| Global disability spending power | $8 trillion |
| US adaptive clothing market | $47.3B untapped |
| AFO footwear market | $251M → $390M by 2032 |
| Higher conversion with AR vs static | 94% |
| Fewer returns with VTO | 64% |
| Benefit Cosmetics sales uplift (skin analysis) | 14× |
| Avon conversion boost (VTO) | 320% |

**Brand partnership potential:** Tommy Hilfiger Adaptive, Nike FlyEase, Zappos Adaptive, Rare Beauty, Guide Beauty — all have adaptive product lines with zero VTO. InclusiFit is the missing layer.

---

## Why This Wins

1. **Unexpected use case** — no one else is building VTO for disability
2. **Real documented pain points** — real conditions, real barriers, real community
3. **13 Perfect Corp APIs** — more than any competitor, each solving a specific problem
4. **$8T market** — the biggest underserved retail segment on earth
5. **Social impact + business ROI** — rare combination
6. **Perfect Corp's own gap** — their accessibility statement admits no speech output. InclusiFit fills it using their own APIs

---

## One-Paragraph Pitch

> InclusiFit is an AI-powered adaptive fashion and beauty platform that combines disability-aware smart filters with Perfect Corp's virtual try-on technology. People with disabilities — whether they have shorter limbs, limited dexterity, use an AFO brace, experience hair loss, or have visual impairment — can filter products by the features that matter to their body and their life, then see exactly how those products look on them before buying. No more ordering blind. No more returning five items to keep one. We serve 1.3 billion people, $8 trillion in spending power, and a $47.3B adaptive market that every mainstream platform has ignored. Fashion should fit everyone.

---

## License

MIT — built for the Perfect Corp × Startup World Cup Hackathon 2026.
