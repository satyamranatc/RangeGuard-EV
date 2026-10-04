# ⚡ RangeGuard-EV: EV Intelligence & Reachability Platform

> **"Where can I charge with my current range?"**  
> A premium, production-quality EV decision-support and spatial intelligence platform built with the design principles of Apple's Human Interface Guidelines: extreme clarity, restraint, strong hierarchy, generous whitespace, and progressive disclosure.

---

## 🌟 The Product Philosophy

Traditional academic projects present a cluttered dashboard with 15 generic charts and raw ML labels (`Cluster 0`, `Cluster 1`).

**RangeGuard-EV** redesigns the experience around the driver's primary question:
**“Where can I charge with my current battery?”**

The analytics, K-Means clustering, and dataset methodology exist as supporting intelligence underneath a calm, intuitive interface.

---

## 🧭 Information Architecture

The platform is structured into 5 deliberate, non-redundant product experiences:

1. **⚡ Find Charger (Signature Hero)**
   - Ridiculously simple hero screen with confident typography.
   - Interactive State of Charge (SoC) slider from 2% to 100%.
   - Instant calculation of **Remaining Range** ($R_{rem} = \text{FullRange} \times \frac{SoC}{100}$) and **Conservative Safe Range** ($R_{safe} = R_{rem} \times \alpha$).
   - Quick preset origin selection (Indore core hubs, regional corridors, or live browser GPS).
   - Instant live counter of reachable stations within your safe operating radius.

2. **🗺️ Explore Map (The WOW Canvas)**
   - Generous, full-bleed interactive map canvas powered by Leaflet & CartoDB Positron architectural tiles.
   - Dynamic pulsing user location beacon and electric teal reachability radius circle that smoothly expands/shrinks as you adjust your battery slider.
   - Floating station cards over the map with power ratings, connector types, distance, and estimated battery arrival buffer bars.
   - Minimalist floating filter sheet (DC Fast $\ge 50\text{ kW}$, CPO filter, municipal territory filter).

3. **🟢 Coverage (Human-First K-Means Benchmarking)**
   - Machine learning presented in human language:
     - 🟢 **Strong Coverage** (Bengaluru, Mumbai MMR, Delhi NCR — Mature transit grids, $< 2.4\text{ km}$ spacing)
     - 🟡 **Developing** (Indore, Hyderabad, Ahmedabad — Expanding corridors, $\sim 3.6\text{ km}$ spacing)
     - 🔴 **Limited Coverage** (Jaipur, Bhopal, Lucknow — Early infrastructure, $> 5.8\text{ km}$ spacing)
   - Standardized municipal comparison matrix table.
   - Progressive disclosure: *"How was this calculated?"* revealing unsupervised K-Means ($k=3$), normalized spatial density per $100\text{ km}^2$, DC ratio, and silhouette score ($0.5524$).

4. **📊 Insights (Editorial Data Storytelling)**
   - Replaces generic PowerBI clutter with intentional data stories.
   - Headline metric: **2,481 verified stations across 18 states**.
   - Clean horizontal bar chart: Stations by Territory (Maharashtra, Delhi NCR, Karnataka, Gujarat, Madhya Pradesh, etc.).
   - *"What we're seeing"* editorial narrative block explaining Tier-1 vs Tier-2 fast-charging dynamics.
   - Power Delivery split (52.4% DC Fast vs 47.6% AC Slow) and CPO market share (Tata Power, Statiq, Jio-bp, Zeon).

5. **📁 Data & Methodology**
   - Verified station registry with search and inspection.
   - Complete mathematical formulations (Haversine geodesic spherical trigonometry, safe margin buffer $\alpha = 0.80$).
   - Data cleaning pipeline and academic integrity disclosure (strictly excluding non-operational stations).

---

## 🎨 Design System & Visual Restraint

- **Palette**: Calm off-white background (`#F5F5F7`), white elevated cards (`#FFFFFF`), near-black typography (`#1D1D1F`), soft gray secondary text (`#6E6E73`), and a sophisticated electric green accent (`#00A86B`).
- **Typography**: Inter / Apple SF Pro with strict scale hierarchy (48px / 32px / 20px / 14px / 12px) and ample breathing room.
- **Microinteractions**: Smooth spring-inspired slider feedback, animated reachability circle, and interactive map marker elevation.
- **Zero Decorative Clutter**: No neon glow effects, no noisy gradients, and no meaningless decorations.

---

## 🚀 Running Locally

```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 📂 Project Structure

```
RangeGuard-EV/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BatteryRangeSlider.jsx   # Signature Apple-style interactive battery control
│   │   │   ├── MapView.jsx              # Leaflet CartoDB map with dynamic radius circle & pins
│   │   │   ├── StationCard.jsx          # Reusable station card with arrival buffer bar
│   │   │   └── StationDetailModal.jsx   # Deep hardware & connector inspection modal
│   │   ├── data/
│   │   │   └── evData.js                # Ground-truth stations, presets, K-Means clusters, insights
│   │   ├── views/
│   │   │   ├── FindChargerHero.jsx      # Clean hero view with instant recommendations
│   │   │   ├── ExploreMap.jsx           # Full-height map canvas with floating station cards
│   │   │   ├── CoverageView.jsx         # Human K-Means coverage benchmarks with disclosure
│   │   │   ├── InsightsView.jsx         # Editorial data storytelling view
│   │   │   └── DataView.jsx             # Dataset registry, mathematical formulations & defense
│   │   ├── App.jsx                      # Main orchestrator & Apple segmented navigation
│   │   ├── index.css                    # Design tokens & Leaflet custom styling
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── EV_Charging_Station_Minor_Project_Synopsis.md
└── README.md
```
