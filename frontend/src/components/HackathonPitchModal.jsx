import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const HackathonPitchModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('pitch'); // 'pitch', 'architecture', 'script'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-warm-xl border-2 border-terracotta-200 relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-charcoal-400 hover:text-charcoal hover:bg-ivory-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E9EFE7]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-terracotta to-terracotta-600 text-white flex items-center justify-center font-display font-extrabold text-xl shadow-warm">
            🏆
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-extrabold text-2xl text-charcoal-900">
                JanPulse AI — Hackathon Presentation Deck
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
                Civic-Tech Innovation
              </span>
            </div>
            <p className="text-xs text-charcoal-500 font-medium">
              Transparent Civic Grievance Triage & 200m Geospatial Duplicate Intelligence
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#E9EFE7] pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'pitch'
                ? 'bg-terracotta text-white shadow-warm'
                : 'text-charcoal-700 hover:bg-sage/40'
            }`}
          >
            💡 The Problem & Innovation
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'architecture'
                ? 'bg-terracotta text-white shadow-warm'
                : 'text-charcoal-700 hover:bg-sage/40'
            }`}
          >
            ⚙️ Tech Architecture
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'script'
                ? 'bg-terracotta text-white shadow-warm'
                : 'text-charcoal-700 hover:bg-sage/40'
            }`}
          >
            🎙️ 3-Minute Live Demo Script
          </button>
        </div>

        {/* Tab 1: Pitch */}
        {activeTab === 'pitch' && (
          <div className="space-y-5 text-sm">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center space-x-1.5">
                <span>The Core Civic Problem in Indian Megacities</span>
              </span>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                When a major crater pothole appears on Bengaluru's 100 Feet Road, <strong>40+ residents report the exact same defect</strong> to different portals, helplines, and social handles. This creates an avalanche of duplicate tickets, overwhelms BBMP desk officers, and dilutes genuine urgency. Meanwhile, real critical hazards get lost in the backlog.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-forest" />
                <span>The JanPulse AI Solution</span>
              </span>
              <ul className="text-xs text-charcoal-700 space-y-2 leading-relaxed">
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-forest">1. Multimodal Gemini Flash AI:</span>
                  <span>Evaluates uploaded defect photos, assigns 1–10 severity, detects hazard features (crater, dislodged bitumen, exposed conduit), and auto-routes to the exact municipal agency (BBMP, BESCOM, BWSSB).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-forest">2. MongoDB 2dsphere 200m Duplicate Triage:</span>
                  <span>When a report is submitted, spatial queries check for open complaints within 200 meters. The citizen is shown existing photos and prompted to <strong>Upvote Existing Issue (+1)</strong> instead of duplicating tickets.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-forest">3. Verified Resolution & Public Transparency:</span>
                  <span>Field supervisors must upload photographic completion proof to mark a case Resolved, updating the live city map and citizen SMS feeds in real time.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-ivory-100 border border-[#D5DFD1] space-y-2">
                <div className="text-terracotta font-bold text-sm flex items-center space-x-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>Multimodal AI Layer</span>
                </div>
                <p className="text-charcoal-600">
                  Google Gemini Flash model analyzes photographic pixels + citizen description in under 400ms, returning structured JSON with category, severity (1–10), and engineering directives.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-100 border border-[#D5DFD1] space-y-2">
                <div className="text-forest font-bold text-sm flex items-center space-x-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Spatial 2dsphere Engine</span>
                </div>
                <p className="text-charcoal-600">
                  MongoDB 2dsphere indexing executes spherical `$near` radius search within 200m. Calculates composite similarity: 45% category match + 35% distance proximity + 20% text similarity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-100 border border-[#D5DFD1] space-y-2">
                <div className="text-mustard-800 font-bold text-sm flex items-center space-x-1.5">
                  <Activity className="w-4 h-4" />
                  <span>Interactive Map & KPIs</span>
                </div>
                <p className="text-charcoal-600">
                  React Leaflet cartography with custom SVG severity pins, hazard density thermal heatmap layer, and Recharts transparency telemetry for ward corporators.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sage/50 border border-sage-300 text-charcoal-800 font-mono text-[11px] space-y-1">
              <div className="font-bold text-charcoal-900">End-to-End Triage Data Pipeline:</div>
              <div>Citizen Photo Upload → Gemini Flash Multimodal Inspection → 2dsphere 200m Duplicate Check → Upvote Consolidation → Municipal Dispatch → Photo Resolution Proof → Public Transparency</div>
            </div>
          </div>
        )}

        {/* Tab 3: Live Demo Script */}
        {activeTab === 'script' && (
          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest-200 text-forest-900 font-medium">
              💡 <strong>Follow this 3-minute sequence to present JanPulse AI to judges:</strong>
            </div>

            <ol className="space-y-3 list-decimal list-inside text-charcoal-800">
              <li className="p-2.5 rounded-xl bg-ivory-100 border border-[#E9EFE7]">
                <strong>Step 1: The Landing Page (30s)</strong> — Point out the unique warm civic design system (Warm Ivory, Terracotta, Forest Green) and live Bengaluru stats. Switch the language dropdown to <strong>ಕನ್ನಡ (Kannada)</strong> to show regional inclusivity.
              </li>
              <li className="p-2.5 rounded-xl bg-ivory-100 border border-[#E9EFE7]">
                <strong>Step 2: AI Triage & 200m Duplicate Detection (60s)</strong> — Click <em>Report Issue</em>. Click the <strong>"Sample Pothole (Indiranagar)"</strong> chip. Show Gemini AI instantly grading it Severity 8/10. Click submit: watch the <strong>200m Duplicate Modal</strong> pop up! Click <strong>"Upvote Existing Grievance (+1)"</strong> to show how we prevent duplicate tickets.
              </li>
              <li className="p-2.5 rounded-xl bg-ivory-100 border border-[#E9EFE7]">
                <strong>Step 3: Live Map & Hazard Density Heatmap (45s)</strong> — Go to <em>Explore Map</em>. Toggle between Pins View and <strong>"Show Density Heatmap"</strong> to show municipal corporators where road hazards are geographically clustered.
              </li>
              <li className="p-2.5 rounded-xl bg-ivory-100 border border-[#E9EFE7]">
                <strong>Step 4: Municipal Admin Room & Citizen SMS (45s)</strong> — Click <em>Municipal Admin</em>. Update a ticket to <strong>In Progress</strong> with remarks. Show the <strong>simulated SMS toast</strong> sent to the citizen's phone!
              </li>
            </ol>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-terracotta text-white font-bold text-xs shadow-warm"
          >
            Ready to Present!
          </button>
        </div>

      </div>
    </div>
  );
};

export default HackathonPitchModal;
