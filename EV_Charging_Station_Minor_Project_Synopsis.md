# MINOR PROJECT SYNOPSIS

---

## 1. Project Title
**EV Charging Station Analysis and Reachability-Based Recommendation System**

---

## 2. Project Category & Domain
- **Domain:** Data Analytics, Applied Machine Learning, Geographic Information Systems (GIS), Intelligent Transportation Systems (ITS)
- **Target Degree:** Bachelor of Technology (B.Tech) in Computer Science & Engineering / Information Technology
- **Project Nature:** Analytics & Decision-Support System

---

## 3. Abstract / Executive Summary
The rapid adoption of Electric Vehicles (EVs) in India demands transparent, data-driven planning and reliable spatial decision-support for end users. While major commercial Charge Point Operators (CPOs) offer consumer applications tailored to their respective networks, existing solutions lack unified multi-operator infrastructure analytics, standardized regional coverage benchmarks, and clear reachability assessment based on vehicle battery state.

This project presents an **EV Charging Station Analysis and Reachability-Based Recommendation System**, an integrated analytics and decision-support platform built on public EV infrastructure datasets. The system ingests, cleans, and normalizes multi-operator station data, persisting it in a relational schema. An **Analytics Engine** evaluates spatial distribution, connector compatibility, and power delivery profiles across states and municipal regions. To benchmark municipal readiness defensively, an unsupervised **K-Means Clustering** model categorizes urban centers into *High, Medium, and Low Coverage* tiers based on normalized spatial features—including station density per $100\text{ km}^2$, DC fast-charger ratios, and mean inter-station distances. Furthermore, a **Reachability Engine** calculates vehicle safe range using state-of-charge ($SoC$), user-configured safety margins, and geodesy principles (Haversine formula), filtering and ranking stations marked as operational within the reachable radius. Delivered through an interactive dashboard, this platform bridges the gap between macro-level infrastructure planning and practical, range-aware destination filtering.

---

## 4. Introduction & Motivation
Electrification of road transport is a cornerstone of India's sustainable mobility agenda, driven by central frameworks (FAME II, PM E-DRIVE) and state-level EV policies. However, widespread consumer adoption continues to be impeded by **range anxiety** and infrastructure opacity:
1. **Fragmented Ecosystem:** Charging stations are deployed across disparate private and municipal CPOs (e.g., Tata Power, Statiq, Jio-bp pulse, municipal smart city transit bays) with isolated apps and closed data silos.
2. **Disproportionate Spatial Distribution:** Charger installations are predominantly clustered around tier-1 city centers and major expressways, leaving peripheral districts and feeder corridors underserved.
3. **Absence of Normalized Coverage Benchmarking:** Municipalities and urban planners lack standardized metrics to assess infrastructure readiness beyond raw station counts.
4. **Need for Transparent, Conservative Reachability:** Drivers approaching low battery levels require a deterministic, conservative recommendation showing stations reachable within their vehicle's estimated remaining buffer, without misleading real-time occupancy assumptions when operating on public static data.

By addressing both macro-level spatial analytics and micro-level vehicle reachability, this project establishes a coherent framework for evaluating and navigating EV infrastructure.

---

## 5. Problem Statement
Existing EV mobile platforms primarily function as commercial discovery or booking utilities for individual operators. Consequently, several critical gaps remain:
- **No Unified Cross-Operator Analysis:** Users and analysts cannot readily perform comparative assessments of connector types, power levels (AC vs. DC), or regional tariff structures across multiple vendors from a unified source.
- **Flawed Coverage Indicators:** Traditional metrics mistakenly equate raw station count with infrastructure sufficiency, failing to account for geographical land area, fast-charging proportions, or station dispersion.
- **Overstated Availability Claims:** Many systems either claim live availability without reliable telemetry or offer unbounded map views that do not filter stations based on actual state-of-charge constraints.

### Formal Goal
To design and implement a software platform that:
1. Curates and structures heterogeneous public EV charging records into a standardized relational database.
2. Performs descriptive spatial and technical analytics across regions and charging networks.
3. Classifies urban regions into distinct coverage tiers using K-Means clustering on normalized spatial density features.
4. Implements a range-aware reachability algorithm using the Haversine formula and configurable safety margins to recommend candidate stations marked as operational in the dataset.
5. Presents insights and spatial recommendations through an interactive web-based dashboard.

---

## 6. Literature Review & Existing Systems Comparison

### 6.1 Critical Review of Commercial Platforms
| Platform / System | Primary Focus | Multi-Operator Comparative Analytics | Unsupervised Coverage Benchmarking (ML) | Configurable Battery Range Reachability Filter | Offline / Dataset-Level Transparency |
|---|---|:---:|:---:|:---:|:---:|
| **Tata Power EZ Charge** | Proprietary CPO Network Navigation & Billing | ❌ No (proprietary network only) | ❌ No | ❌ No | ❌ No (commercial API) |
| **Statiq / Jio-bp pulse** | Commercial CPO Aggregation & Booking | ❌ No (limited roaming partners) | ❌ No | ❌ No | ❌ No (commercial API) |
| **PlugShare** | Crowd-sourced Community Directory | ⚠️ Partial (user reviews, basic filters) | ❌ No | ❌ No | ❌ No |
| **Google Maps** | General POI Navigation | ⚠️ Basic (search query: "EV charger") | ❌ No | ❌ No | ❌ No |
| **Proposed System** | **Analytics & Decision-Support System** | **✅ Yes (unified open/public dataset)** | **✅ Yes (K-Means on spatial metrics)** | **✅ Yes (Haversine + configurable buffer)** | **✅ Yes (transparent static dataset scope)** |

### 6.2 Identified Research Gap
> *Existing EV charging applications primarily focus on locating, accessing, booking, or using charging stations within commercial networks. They generally do not provide a unified, cleaned, comparative analysis of charging infrastructure across multiple operators and regions together with statistical coverage analysis and a dataset-based reachability recommendation module.*

---

## 7. System Architecture & Methodology

### 7.1 High-Level Architectural Pipeline

```
┌────────────────────────┐
│  Public EV Station Data │ (Kaggle, Open Data Portals, Municipal CPO Registry)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Preprocessing & Cleaning│ (Null imputation, coordinate validation, connector standardizing)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Relational Database    │ (SQLite / PostgreSQL with Station & Charger schemas)
└───────────┬────────────┘
            │
      ┌─────┴──────────────────────────┐
      ▼                                ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│ Analytics & ML Engine   │      │ Reachability Engine     │
│ • Descriptive Spatial   │      │ • Battery % & Full Range│
│   Analytics (Plotly)    │      │ • Configurable Margin α │
│ • K-Means Coverage      │      │ • Haversine Geodesy     │
│   Classification        │      │ • Dataset Status Filter │
└─────────────┬───────────┘      └────────────┬────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
               ┌─────────────────────────────┐
               │    Interactive Dashboard    │
               │   (Streamlit / Web UI)      │
               └─────────────────────────────┘
```

---

### 7.2 Detailed Reachability Engine Methodology
The recommendation engine eliminates non-viable stations and highlights those within safe reach:

```
User Input:
[Current Latitude, Longitude]
[Current Battery State (%)]
[Vehicle Full Rated Range (km)]
[Safety Factor α (default: 0.8)]
           │
           ▼
Calculate Estimated Remaining Range:
RemainingRange = FullRange × (Battery% / 100)
           │
           ▼
Calculate Conservative Safe Range:
SafeRange = RemainingRange × α
           │
           ▼
Query Database for Stations Marked as Operational:
station_status == "operational" (or "working" in dataset)
           │
           ▼
Compute Haversine Distance (d) from User Coordinates to each Station
           │
           ▼
Filter Criteria:
d ≤ SafeRange
           │
           ▼
Sort Candidate Stations by Distance Ascending (d ↑)
           │
           ▼
Render Output Table + Interactive Map (Folium / Plotly Map)
```

#### Mathematical Formulations

1. **Estimated Remaining Range ($R_{\text{rem}}$):**
   $$R_{\text{rem}} = R_{\text{full}} \times \left(\frac{SoC}{100}\right)$$
   Where:
   - $R_{\text{full}}$ = Manufacturer-rated vehicle full range (km)
   - $SoC$ = Current State of Charge (Battery percentage, $0 \le SoC \le 100$)

2. **Conservative Safe Operating Range ($R_{\text{safe}}$):**
   $$R_{\text{safe}} = R_{\text{rem}} \times \alpha$$
   Where:
   - $\alpha$ is a **user-configurable safety margin** (default value: $0.80$, representing an $80\%$ buffer to account for real-world environmental factors such as auxiliary HVAC consumption, terrain elevation, traffic delays, and battery degradation).

3. **Haversine Great-Circle Distance ($d$):**
   Given user location $(\phi_1, \lambda_1)$ and station coordinates $(\phi_2, \lambda_2)$ in radians:
   $$\Delta\phi = \phi_2 - \phi_1, \quad \Delta\lambda = \lambda_2 - \lambda_1$$
   $$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
   $$c = 2 \cdot \arctan2\left(\sqrt{a}, \sqrt{1-a}\right)$$
   $$d = R_{\text{earth}} \cdot c$$
   Where $R_{\text{earth}} \approx 6371.0\text{ km}$.

4. **Recommendation Condition:**
   A station $S_i$ is recommended if and only if:
   $$\text{Status}(S_i) \equiv \text{"operational"} \quad \land \quad d(U, S_i) \le R_{\text{safe}}$$

> **Academic Precision Disclaimer:** The reachability module calculates straight-line geodesic distance (Haversine approximation). It provides an estimated spatial filter based on station records marked operational in the source dataset, without asserting real-time telemetry, queue wait times, or road network turn-by-turn routing guarantees.

---

### 7.3 K-Means Coverage Analysis Methodology
A critical flaw in standard EV analyses is asserting that *"cities with more charging stations naturally possess higher coverage."* This is statistically invalid because municipal surface areas and populations vary drastically. 

To create a mathematically sound machine learning model, our unsupervised K-Means clustering algorithm defines municipal infrastructure coverage through **multi-attribute normalized density features**:

1. **Station Spatial Density ($f_1$):**
   $$f_1 = \frac{N_{\text{stations}}}{\text{Municipal Area in } 100\text{ km}^2}$$
2. **Population Density Ratio ($f_2$, where demographic census data is accessible):**
   $$f_2 = \frac{N_{\text{stations}}}{\text{Population in } 100,000\text{ units}}$$
3. **High-Power DC Fast-Charger Proportion ($f_3$):**
   $$f_3 = \frac{N_{\text{DC Fast Connectors}}}{N_{\text{Total Connectors}}}$$
4. **Mean Nearest-Neighbor Station Distance ($f_4$):**
   $$f_4 = \frac{1}{N}\sum_{i=1}^{N} \min_{j \ne i} d(S_i, S_j)$$

#### Clustering Pipeline:
- **Feature Scaling:** All features are normalized using `StandardScaler` ($\mu = 0, \sigma = 1$) to prevent scale dominance.
- **Hyperparameter Selection:** Optimal clusters $k$ are selected via the **Elbow Method** (Within-Cluster Sum of Squares, WCSS) and verified with **Silhouette Analysis** ($k=3$).
- **Output Clusters:**
  - **High Coverage:** High station spatial density, elevated DC fast-charger ratio, low inter-station spacing.
  - **Medium Coverage:** Moderate density, developing fast-charging corridors, intermediate spacing.
  - **Low Coverage:** Sparse distribution, reliance on slow AC sockets, significant spatial dispersion.

---

## 8. Database Design

The system implements a normalized relational database schema (SQLite / PostgreSQL) separating station metadata from granular connector attributes and historical records:

```text
┌─────────────────────────────────┐
│             STATION             │
├─────────────────────────────────┤
│ station_id     (PK, VARCHAR)    │
│ station_name   (VARCHAR)        │
│ operator       (VARCHAR)        │
│ state          (VARCHAR)        │
│ city           (VARCHAR)        │
│ latitude       (DOUBLE PRECISION│
│ longitude      (DOUBLE PRECISION│
│ status         (VARCHAR)        │ <-- e.g., 'operational', 'non-operational'
│ address        (TEXT)           │
└───────────────┬─────────────────┘
                │ 1
                │
                │ N
┌───────────────┴─────────────────┐
│             CHARGER             │
├─────────────────────────────────┤
│ charger_id     (PK, VARCHAR)    │
│ station_id     (FK, VARCHAR)    │
│ charger_type   (VARCHAR)        │ <-- 'AC' / 'DC Fast'
│ connector_type (VARCHAR)        │ <-- 'CCS2', 'Type 2', 'Bharat DC-001'
│ power_kw       (FLOAT)          │ <-- e.g., 3.3, 7.4, 30.0, 60.0, 120.0
└─────────────────────────────────┘

┌─────────────────────────────────┐
│      USAGE_SESSION [OPTIONAL]   │
├─────────────────────────────────┤
│ session_id     (PK, VARCHAR)    │
│ station_id     (FK, VARCHAR)    │
│ start_time     (TIMESTAMP)      │
│ end_time       (TIMESTAMP)      │
│ energy_kwh     (FLOAT)          │
└─────────────────────────────────┘
*(Note: USAGE_SESSION is retained as an optional entity for datasets containing empirical utilization records).*
```

---

## 9. Technology Stack

| Layer / Component | Technology Selected | Rationale & Academic Justification |
|---|---|---|
| **Programming Language** | Python 3.10+ | Standard ecosystem for scientific computing, geospatial processing, and ML. |
| **Data Manipulation** | Pandas, NumPy | High-performance vectorized tabular transformations, missing value handling. |
| **Machine Learning** | Scikit-learn | Proven implementation of `KMeans`, `StandardScaler`, and clustering evaluation metrics. |
| **Geospatial & Geodesy** | Haversine / GeoPy | Exact mathematical formulation of great-circle spherical distance. |
| **Data Visualization** | Plotly | Dynamic, interactive charts for exploratory data analysis (power distribution, CPO shares). |
| **Map Rendering** | Folium / Plotly Mapbox | Spatial point plotting, cluster map visualization, and reachable radius overlays. |
| **User Interface / Dashboard** | Streamlit (Python) / React | Rapid, interactive decision-support interface with reactive input sliders. |
| **Database** | SQLite / PostgreSQL | Lightweight, ACID-compliant relational storage for station and connector tables. |
| **Development & VCS** | VS Code, Git, GitHub | Reproducible development, branch management, and open-source project tracking. |

*(Note: Heavy raster libraries like Matplotlib/Seaborn are intentionally omitted in favor of modern interactive web plotting via Plotly and Folium).*

---

## 10. Verification, Testing & Mathematical Validation

### 10.1 Mathematical Verification Test Case
To demonstrate algorithmic predictability, consider the following deterministic benchmark test:

| Parameter | Test Value | Calculation / Derivation |
|---|---|---|
| **Vehicle Rated Full Range ($R_{\text{full}}$)** | $300\text{ km}$ | Manufacturer WLTP / ARAI baseline specification |
| **Current Battery State ($SoC$)** | $10\%$ | Dashboard user slider input |
| **Unadjusted Remaining Range ($R_{\text{rem}}$)** | $30\text{ km}$ | $300 \times \left(\frac{10}{100}\right) = 30\text{ km}$ |
| **Configurable Safety Factor ($\alpha$)** | $0.80\text{ (80%)}$ | Applied to prevent battery depletion in real conditions |
| **Conservative Safe Range ($R_{\text{safe}}$)** | **$24.0\text{ km}$** | **$30\text{ km} \times 0.80 = 24.0\text{ km}$** |
| **Dataset Operational Filter** | Passed | Stations where `status == "operational"` only |
| **Expected Station Output** | Candidate Set | Only operational stations with $d \le 24.0\text{ km}$, ordered by $d$ ascending |

### 10.2 Academic Terminology Adherence
To maintain academic rigor and avoid overstated capabilities, the project strictly applies consistent technical terminology throughout documentation and code:

| ❌ Informal / Misleading Phrasing | ✅ Academically Rigorous Replacement |
|---|---|
| *"Hides stations that are not working"* | **"Excludes stations whose dataset status is marked as non-operational."** |
| *"Shows only working stations"* | **"Shows only stations marked as operational in the source dataset."** |
| *"Guaranteed reachable charging stations"* | **"Estimated reachable stations based on straight-line Haversine distance."** |
| *"Real-time charger availability"* | **"Static public operational status as recorded in the published registry."** |
| *"Cities with more chargers have better coverage"* | **"Cities categorized by multi-feature density (chargers per $100\text{ km}^2$, DC ratio, dispersion)."** |

---

## 11. Project Plan & Milestones (Gantt Schedule)

```
Phase 1: Dataset Collection, Data Cleaning & Schema Design        [Weeks 1 – 3]
Phase 2: Exploratory Data Analysis & Spatial Visualization        [Weeks 4 – 5]
Phase 3: K-Means Clustering on Multi-Feature Coverage Metrics     [Weeks 6 – 7]
Phase 4: Reachability Engine (Haversine & Configurable Safety α)  [Weeks 8 – 9]
Phase 5: Interactive Dashboard Integration & UI Testing          [Weeks 10 – 11]
Phase 6: Final Documentation, Validation & Synopsis Submission   [Weeks 12]
```

---

## 12. Expected Deliverables & Outcomes
1. **Cleaned & Normalized Database:** Multi-operator station and charger registry.
2. **Empirical Analysis Notebooks:** Reproducible EDA covering operator distribution, charging speeds (AC vs DC), and regional infrastructure imbalances.
3. **Validated K-Means Model:** Objective grouping of regional centers based on infrastructure density rather than population bias.
4. **Range-Aware Recommendation Module:** Verified reachability calculations preventing edge-of-range failures.
5. **Integrated Web Dashboard:** Interactive portal demonstrating analytical charts and reachable station maps.

---

## 13. References & Bibliography
1. **Ministry of Power, Government of India (2022).** *Charging Infrastructure for Electric Vehicles (EV) – Revised Consolidated Guidelines & Standards.* Bureau of Energy Efficiency (BEE), New Delhi.
2. **NITI Aayog, Ministry of Power, Department of Heavy Industry (2021).** *Handbook of Electric Vehicle Charging Infrastructure Implementation.* Government of India.
3. **Sinnott, R. W. (1984).** *Virtues of the Haversine.* Sky and Telescope, 68(2), 159.
4. **MacQueen, J. (1967).** *Some Methods for classification and Analysis of Multivariate Observations.* Proceedings of the 5th Berkeley Symposium on Mathematical Statistics and Probability, 1(14), 281–297.
5. **Pedregosa, F., et al. (2011).** *Scikit-learn: Machine Learning in Python.* Journal of Machine Learning Research (JMLR), 12, 2825–2830.
6. **Central Electricity Authority (CEA) (2023).** *Report on Charging Infrastructure Development for Electric Mobility in India.* Ministry of Power, New Delhi.
7. **Open Government Data (OGD) Platform India (data.gov.in) & NITI Aayog e-AMRIT Portal.** *Public datasets on Electric Vehicle Supply Equipment (EVSE).*

---
