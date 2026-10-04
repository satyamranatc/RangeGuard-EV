# 🛡️ RangeGuard-EV: EV Charging Station Analysis & Reachability Recommendation System

An integrated data analytics and decision-support web application for Electric Vehicle (EV) infrastructure in India, built **100% in React**.

---

## 🚀 Quick Start (Running with ONLY React)

You do **not** need Node backend or Python to run this application. Everything runs directly in the browser!

```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🎯 What This React Application Does

1. **🔋 Battery Reachability Engine (Real-Time Client Calculations)**
   - Enter current battery state of charge (SoC %) and full vehicle range (or select popular presets: Tata Nexon EV, MG ZS EV, Mahindra XUV400, etc.).
   - Adjust the **Safety Factor ($\alpha$)** slider (e.g. 0.8 / 80%).
   - Calculates **Remaining Range** ($FullRange \times \frac{SoC\%}{100}$) and **Safe Range** ($RemainingRange \times \alpha$).
   - Calculates geodesic distance using the **Haversine formula**.
   - Filters out non-operational stations and stations outside safe range.
   - Computes expected battery drain % and arrival buffer % for every candidate station.

2. **📊 K-Means Municipal Coverage & Infrastructure Benchmarking**
   - Displays unsupervised K-Means clustering results classifying urban centers into **High, Medium, and Low Coverage** tiers.
   - Compares cities across:
     - Station Density per $100\text{ km}^2$
     - DC Fast-Charger Proportion (%)
     - Average Geodesic Inter-Station Spacing (km)
     - Population ratio
   - Demonstrates why raw station counts distort actual infrastructure readiness.

3. **🗺️ Comprehensive Station Directory & Interactive Visualizer**
   - Filter by City (Indore, Bhopal, Delhi NCR, Bengaluru, Mumbai, etc.).
   - Filter by Charge Point Operator (Tata Power, Jio-bp pulse, Statiq, AICTSL Smart City, Kazam, etc.).
   - Fast Charger toggle ($\ge 50\text{ kW}$ DC).
   - One-click Google Maps navigation routing for every station.

---

## 📂 Project Structure

```
EvCharger/
├── frontend/                                      # ⚡ 100% Standalone React + Vite Application
│   ├── src/
│   │   ├── App.jsx                                # Complete Dashboard (Reachability + ML Analytics + Directory)
│   │   ├── index.css                              # UI Styles
│   │   └── main.jsx                               # React Root Mount
│   ├── package.json                               # Dependencies: React, Lucide Icons, Vite
│   └── vite.config.js                             # Vite Bundler Config
│
├── EV_Charging_Station_Minor_Project_Synopsis.md  # Academic synopsis and defense guide
└── README.md                                      # Project documentation
```
