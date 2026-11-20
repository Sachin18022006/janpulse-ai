# JANPULSE AI — Transparent Civic Grievance & Duplicate Triage Board

> **"Your City. Your Voice. Real Change."**  
> A production-grade citizen civic issue reporting and municipal dispatch platform with Google Gemini Flash multimodal AI analysis, MongoDB 2dsphere 200m geospatial duplicate detection, and live interactive city mapping.

---

## 🎨 Unique Civic-Tech Visual Identity

JanPulse AI departs from standard generic AI SaaS purple gradients and dark blue dashboards, using a distinct, human-centric Indian civic-tech design system:

| Role | Color Name | Hex Code | Purpose |
|---|---|---|---|
| **Background** | Warm Ivory | `#F8F6F0` | Primary app canvas & background |
| **Primary** | Terracotta | `#D66A45` | Brand accents, primary buttons, high severity |
| **Secondary** | Forest Green | `#356B52` | Trust, resolved state, eco & water divisions |
| **Accent** | Mustard Yellow | `#E5B84B` | Medium priority, attention badges, warnings |
| **Text** | Charcoal | `#282B27` | High-contrast readable typography |
| **Secondary Background** | Pale Sage | `#E9EFE7` | Panels, borders, section containers |
| **Cards** | Pure White | `#FFFFFF` | Rounded cards with warm drop shadows |

---

## 🛠️ Complete Tech Stack

### Frontend
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS with custom civic color tokens & animations
- **Routing**: React Router v6
- **Interactive Mapping**: React Leaflet & Leaflet with OpenStreetMap
- **Data Visualizations**: Recharts (Pie, Bar, Area charts)
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT interceptors
- **Celebrations**: Canvas-Confetti

### Backend
- **Runtime**: Node.js v20+ / v24+
- **Framework**: Express.js
- **Database**: MongoDB (Atlas production or zero-config in-memory MongoDB for instant local evaluation)
- **ODM**: Mongoose with MongoDB `2dsphere` geospatial indexing
- **Security**: JWT authentication, bcrypt password hashing, CORS, rate limiting
- **File & Media Handling**: Multer (dual engine: local fallback storage + Cloudinary upload stream)

### Artificial Intelligence
- **Multimodal AI**: Google Gemini Flash API (`gemini-1.5-flash` / `gemini-2.0-flash`)
- **Triage Capabilities**: Photographic defect detection, 1–10 severity scoring, confidence rating, urgency determination, municipal department auto-routing, and engineering directives.
- **Resilience Engine**: Built-in heuristic fallback engine ensuring 100% operational continuity even before API keys are configured.

---

## 🚀 Key Modules & Capabilities

### 1. Landing Page
- Striking hero section with live civic metrics counter.
- 4-step "How It Works" visual pipeline.
- Civic focus sectors (Road Damage, Garbage, Streetlights, Water Leakage, Drainage, Public Safety).
- Live preview ticker of recent Bengaluru civic complaints.

### 2. Civic Issue Reporter with Gemini AI & Drag-and-Drop
- Drag-and-drop photographic evidence uploader with instant client preview.
- Interactive Leaflet map with click-to-pinpoint coordinate selection.
- Browser Geolocation API ("Use My Current Location") with OpenStreetMap reverse-geocoding into human-readable street addresses.
- Structured AI analysis card showing severity gauge, confidence rating, and identified hazards.

### 3. Geospatial 200-Meter Duplicate Grievance Triage (Core Feature)
- Utilizes MongoDB `$near` with `2dsphere` geospatial indexing to query open complaints within a 200-meter radius.
- Computes multi-factor similarity: **Distance proximity (40%) + Category match (40%) + Description text similarity (20%)**.
- Interactive duplicate alert modal displays the existing complaint photo thumbnail, distance in meters, and upvote count.
- Citizens can **Upvote Existing Grievance (+1)** to consolidate community voice and escalate municipal priority without fragmenting records, or **Submit Anyway** if it is a distinct defect.

### 4. Interactive Live City Map
- Full-screen interactive map centered on **Bengaluru** (Indiranagar, Koramangala, HSR Layout, MG Road, Whitefield, Malleshwaram).
- Custom SVG pin markers color-coded by severity:
  - **Critical (9–10)**: Red
  - **High (7–8)**: Terracotta
  - **Medium (4–6)**: Mustard Yellow
  - **Low (1–3)**: Forest Green
- Interactive popups with photos, upvote counters, and direct links to the public timeline.
- Multi-dimensional filters (Category, Status, Severity, Street Search) + Map vs List/Grid view toggle.

### 5. Public Transparency & Triage Dashboard
- KPI summary metrics: Total grievances, resolved cases, resolution percentage, average turnaround time.
- Recharts visualizations:
  - Donut chart: Category breakdown
  - Bar chart: AI Severity score distribution (1 to 10)
  - Area chart: Monthly complaint inflow vs resolution velocity
  - Workload chart: Department-wise active vs resolved caseload

### 6. Public Complaint Details & Auditable Lifecycle Timeline
- Complete lifecycle tracking:
  `Submitted → AI Analyzed → Verified → Assigned → In Progress → Resolved`
- Display of official municipal remarks and **photographic resolution proof**.
- One-click civic upvoting with duplicate prevention.

### 7. Municipal Admin Control Room
- Secure administrative portal for municipal engineers and ward commissioners.
- Triage table with sorting by urgency and severity filters.
- Critical hazard alert banner for unresolved complaints with severity ≥ 8.
- Status update modal with official remarks and resolution photo attachment.
- Department reassignment dropdown.

---

## 🔑 Demo Credentials

For quick evaluation, pre-seeded accounts and 1-click quick login buttons are available on the `/login` page:

| Role | Email | Password | Persona |
|---|---|---|---|
| **Citizen** | `citizen@example.com` | `citizen123` | Aarav Sharma (Civic Guardian) |
| **Municipal Admin** | `admin@janpulse.gov.in` | `admin123` | Dr. Ramesh Kumar, IAS (BBMP Central Command) |

---

## 📂 Project Structure

```
janpulse-ai/
├── backend/
│   ├── config/
│   │   ├── db.js                # MongoDB connection (Atlas + MongoMemoryServer fallback)
│   │   └── cloudinary.js        # Cloudinary stream setup + fallback
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   ├── complaintController.js # CRUD, AI pre-analysis, upvotes, duplicate triage
│   │   ├── adminController.js   # Admin status transitions & department routing
│   │   └── dashboardController.js # Aggregations for Recharts & KPIs
│   ├── middleware/
│   │   ├── auth.js              # JWT verification & role authorization
│   │   └── upload.js            # Multer image upload & validation
│   ├── models/
│   │   ├── User.js              # Citizen & Admin schema
│   │   ├── Complaint.js         # Grievance schema with 2dsphere geospatial index
│   │   └── Upvote.js            # Compound unique index {complaint, user}
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth
│   │   ├── complaintRoutes.js   # /api/complaints
│   │   ├── aiRoutes.js          # /api/ai
│   │   ├── adminRoutes.js       # /api/admin
│   │   └── dashboardRoutes.js   # /api/dashboard
│   ├── services/
│   │   ├── geminiService.js     # Google Gemini Flash multimodal prompt engine
│   │   └── geospatialService.js # 2dsphere distance calculations & similarity scoring
│   ├── utils/
│   │   └── seedData.js          # Bengaluru seed complaints, upvotes, & accounts
│   ├── uploads/                 # Local image storage fallback
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Main Express server
└── frontend/
    ├── public/
    │   └── favicon.svg          # Warm terracotta civic favicon
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # Responsive header with mobile drawer
    │   │   ├── Footer.jsx       # Civic footer with tech stack references
    │   │   ├── SeverityBadge.jsx# Severity indicator (1–10) with exact palette
    │   │   ├── StatusBadge.jsx  # Lifecycle status pill
    │   │   ├── AIAnalysisCard.jsx # Gemini AI structured assessment card
    │   │   ├── DuplicateAlertModal.jsx # 200m duplicate triage modal
    │   │   ├── TimelineView.jsx # Auditable grievance lifecycle log
    │   │   └── LeafletMap.jsx   # React-Leaflet interactive cartography
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global JWT auth, demo logins, localStorage
    │   ├── pages/
    │   │   ├── LandingPage.jsx  # Hero, stats, how it works, recent issues
    │   │   ├── ReportIssuePage.jsx # Drag-and-drop, AI preview, map pin picker
    │   │   ├── MapExplorerPage.jsx # Live city map with filters & list view
    │   │   ├── DashboardPage.jsx# Recharts analytics & metrics
    │   │   ├── ComplaintDetailsPage.jsx # Details, timeline, proof, upvotes
    │   │   ├── TrackComplaintPage.jsx   # Ticket ID search
    │   │   ├── AdminDashboardPage.jsx   # Admin dispatch & triage room
    │   │   ├── LoginPage.jsx    # Authentication with 1-click demo buttons
    │   │   ├── RegisterPage.jsx # Account registration
    │   │   └── ProfilePage.jsx  # Citizen grievance history & upvotes
    │   ├── services/
    │   │   └── api.js           # Axios instance & API client
    │   ├── App.jsx              # Routes configuration
    │   ├── index.css            # Tailwind custom scrollbar & animations
    │   └── main.jsx
    ├── tailwind.config.js       # Warm ivory, terracotta, forest, mustard tokens
    ├── vite.config.js
    └── package.json
```

---

## 🏃 Local Setup & Installation

### Prerequisites
- Node.js v18+ (tested on Node.js v20 and v24)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/your-username/janpulse-ai.git
cd janpulse-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
*(Optional)* Add your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/) and your `MONGODB_URI` from MongoDB Atlas. If left blank, the backend automatically runs a zero-config in-memory MongoDB instance with full 2dsphere indexing and auto-seeds sample complaints!

Start backend server:
```bash
npm start
# Server listens on http://localhost:5000
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
# Vite runs at http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Testing the Core Hackathon Flow

1. Click **Login** and press **Citizen Demo** (logged in as Aarav Sharma).
2. Click **Report Issue**.
3. Pick a location along **100 Feet Road, Indiranagar** (coordinates `[12.9719, 77.6406]`).
4. Type description: *"Dangerous deep pothole on road"*.
5. Click **Submit Grievance to Municipal Board**.
6. The **200m Spatial Duplicate Alert Modal** will pop up, identifying complaint `#JP-2026-BLR-1001` (45 meters away)!
7. Click **Upvote Existing Grievance (+1)** to consolidate priority.
8. Switch to the **Municipal Admin Portal** (Login as Admin) to inspect the grievance and update its status to **Resolved** with remarks and resolution proof!

---

## 🚢 Deployment Guidelines

### Frontend (Vercel)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend (Render / Railway)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGODB_URI=mongodb+srv://<user>:<pwd>@cluster.mongodb.net/janpulse?retryWrites=true&w=majority`
  - `JWT_SECRET=<your-secure-secret>`
  - `GEMINI_API_KEY=<your-google-ai-studio-key>`
  - *(Optional)* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

## 📜 License
MIT License. Built for transparent, accountable, and citizen-empowered municipal governance.
