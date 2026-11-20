import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Compass, 
  ArrowRight,
  ShieldAlert,
  Loader2,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { complaintAPI } from '../services/api';
import LeafletMap from '../components/LeafletMap';
import AIAnalysisCard from '../components/AIAnalysisCard';
import DuplicateAlertModal from '../components/DuplicateAlertModal';
import confetti from 'canvas-confetti';

export const ReportIssuePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const { sendNotification } = useNotification();
  const navigate = useNavigate();

  // Form State
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Road Damage');
  const [address, setAddress] = useState('100 Feet Rd, Indiranagar, Bengaluru');
  const [landmark, setLandmark] = useState('');

  // Location coordinates (Default: Indiranagar, Bengaluru [12.9719, 77.6406])
  const [selectedPosition, setSelectedPosition] = useState([12.9719, 77.6406]);
  const [locating, setLocating] = useState(false);

  // AI & Duplicate State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [duplicatesData, setDuplicatesData] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Speech Recognition / Voice Dictation State
  const [isListening, setIsListening] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successComplaint, setSuccessComplaint] = useState(null);

  const categories = [
    'Road Damage',
    'Garbage',
    'Streetlight',
    'Water Leakage',
    'Drainage',
    'Public Safety',
    'Other',
  ];

  // Speech-to-Text handler
  const handleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use Google Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
      if (file) {
        triggerAIAnalysis(file, `${description} ${transcript}`, category);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Handle Drag & Drop / File Select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processSelectedFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processSelectedFile(droppedFile);
    }
  };

  const processSelectedFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setErrorMessage('');

    // Trigger instant AI analysis preview with Gemini
    triggerAIAnalysis(selectedFile, description, category);
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl('');
    setAiAnalysis(null);
  };

  // Reverse Geocode coordinates to human street address using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (e) {
      setAddress(`${lat.toFixed(4)}, ${lon.toFixed(4)}, Bengaluru, Karnataka`);
    }
  };

  // Handle map click
  const handleMapPinSelect = (lat, lon) => {
    setSelectedPosition([lat, lon]);
    reverseGeocode(lat, lon);
  };

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedPosition([latitude, longitude]);
        reverseGeocode(latitude, longitude);
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setErrorMessage('Could not fetch location automatically. Please click your spot on the map.');
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Trigger Gemini AI Pre-analysis
  const triggerAIAnalysis = async (imageFile, desc, cat) => {
    setIsAnalyzingAI(true);
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('description', desc || 'Road hazard or civic problem in Bengaluru');
      formData.append('category', cat || category);

      const res = await complaintAPI.analyzeAI(formData);
      if (res.data.success) {
        setAiAnalysis(res.data.data);
        if (res.data.data.category && res.data.data.category !== category) {
          setCategory(res.data.data.category);
        }
      }
    } catch (err) {
      console.warn('AI preview error:', err);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Form Submission
  const handleSubmit = async (e, forceNewComplaint = false) => {
    if (e) e.preventDefault();

    if (!description.trim()) {
      setErrorMessage('Please describe the civic issue.');
      return;
    }

    if (!selectedPosition) {
      setErrorMessage('Please pick the problem location on the map.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim() || `${category} reported at ${address.split(',')[0]}`);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('longitude', selectedPosition[1]);
      formData.append('latitude', selectedPosition[0]);
      formData.append('address', address);
      formData.append('landmark', landmark);
      formData.append('forceNewComplaint', forceNewComplaint ? 'true' : 'false');

      if (file) {
        formData.append('image', file);
      }

      const res = await complaintAPI.create(formData);

      if (res.data.success) {
        setSuccessComplaint(res.data.data);
        setShowDuplicateModal(false);

        // Trigger SMS notification simulation to citizen
        sendNotification({
          title: 'Grievance Acknowledged',
          recipient: user?.phone || '+91 98450 12345 (Aarav Sharma)',
          message: `Grievance #${res.data.data.complaintId} lodged successfully! AI Severity: ${res.data.data.severity}/10. Dispatched to ${res.data.data.department}.`,
        });

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.duplicateDetected) {
        setDuplicatesData(err.response.data.data);
        setShowDuplicateModal(true);
      } else {
        setErrorMessage(err.response?.data?.message || 'Failed to submit grievance. Please ensure you are logged in.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle upvoting existing complaint when duplicate is detected
  const handleUpvoteExisting = async (existingId) => {
    if (!existingId) return;
    setIsSubmitting(true);
    try {
      const res = await complaintAPI.upvote(existingId);
      if (res.data.success) {
        setShowDuplicateModal(false);

        sendNotification({
          title: 'Priority Upvoted',
          recipient: user?.phone || '+91 98450 12345 (Aarav Sharma)',
          message: `Your upvote has been registered! Complaint priority escalated in the BBMP engineering dispatch queue.`,
        });

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        navigate(`/complaints/${existingId}`);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not register upvote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-[#E9EFE7] pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
          Citizen Reporting Portal
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900 mt-1">
          {t('reportIssue')}
        </h1>
        <p className="text-sm text-charcoal-600 mt-1">
          Upload photo evidence or dictate verbally. Gemini AI classifies the defect and performs a 200m spatial proximity triage.
        </p>
      </div>

      {/* Success View */}
      {successComplaint ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-forest-300 shadow-warm-lg text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-forest-100 text-forest flex items-center justify-center mx-auto shadow-warm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-2xl text-charcoal-900">
              Grievance Successfully Registered & AI Triage Complete!
            </h2>
            <p className="text-sm text-charcoal-600 max-w-lg mx-auto">
              Your report has been assigned unique ID <strong className="text-terracotta font-mono font-bold">#{successComplaint.complaintId}</strong> and forwarded to <strong className="text-forest-800">{successComplaint.department}</strong>.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-ivory-100 border border-[#E9EFE7] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-charcoal-500">AI Calculated Severity:</span>
              <span className="font-bold text-terracotta">{successComplaint.severity}/10 ({successComplaint.urgency})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Location:</span>
              <span className="font-medium text-charcoal-800 truncate max-w-[240px]">{successComplaint.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Status:</span>
              <span className="font-bold text-forest-700">{successComplaint.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/complaints/${successComplaint._id}`)}
              className="px-6 py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-warm transition-transform transform hover:-translate-y-0.5"
            >
              Track Live Grievance Timeline
            </button>
            <button
              onClick={() => {
                setSuccessComplaint(null);
                setFile(null);
                setPreviewUrl('');
                setDescription('');
                setTitle('');
              }}
              className="px-6 py-3 rounded-xl border border-charcoal-300 text-charcoal-700 font-semibold text-sm hover:bg-sage/40 transition-colors"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      ) : (
        /* Reporting Form */
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Photographic Evidence */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9EFE7] shadow-warm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-charcoal-900">
                  1. Upload Photographic Evidence
                </h3>
                <p className="text-xs text-charcoal-500">
                  Clear pictures ensure higher Gemini AI confidence and faster municipal response.
                </p>
              </div>
              <span className="text-xs font-bold text-terracotta uppercase">Step 1 of 3</span>
            </div>

            {previewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-terracotta-200 bg-charcoal-50 max-h-96 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Complaint Preview"
                  className="max-h-96 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 rounded-full bg-charcoal/70 text-white hover:bg-charcoal transition-colors shadow-warm"
                  title="Remove Image"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs text-charcoal-800 text-xs px-3 py-1.5 rounded-xl font-semibold shadow-warm flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-forest" />
                  <span>Photo Ready for AI Inspection</span>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#D5DFD1] hover:border-terracotta-400 bg-ivory-100 hover:bg-ivory-200/60 rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer group"
                onClick={() => document.getElementById('imageFileInput').click()}
              >
                <input
                  id="imageFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-terracotta-100 text-terracotta flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="font-display font-bold text-base text-charcoal-800">
                  Drag and drop civic issue photograph here
                </h4>
                <p className="text-xs text-charcoal-500 mt-1">
                  Supports JPG, PNG, WEBP up to 10MB
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 rounded-xl bg-white border border-[#D5DFD1] text-xs font-bold text-charcoal-700 shadow-warm group-hover:border-terracotta"
                >
                  Or Browse From Device
                </button>
              </div>
            )}
          </div>

          {/* Section 2: AI Analysis Card */}
          {(isAnalyzingAI || aiAnalysis) && (
            <div className="space-y-2">
              <AIAnalysisCard analysis={aiAnalysis} isAnalyzing={isAnalyzingAI} />
            </div>
          )}

          {/* Section 3: Grievance Details & Category + Voice Dictation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9EFE7] shadow-warm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-charcoal-900">
                  2. Issue Details & Accessibility
                </h3>
                <p className="text-xs text-charcoal-500">
                  Type or click voice dictate to explain the hazard in Kannada, Hindi, or English.
                </p>
              </div>
              <span className="text-xs font-bold text-terracotta uppercase">Step 2 of 3</span>
            </div>

            {/* Category Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      if (file) triggerAIAnalysis(file, description, cat);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      category === cat
                        ? 'bg-terracotta text-white border-terracotta shadow-warm'
                        : 'bg-ivory-100 text-charcoal-700 border-[#D5DFD1] hover:border-terracotta-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Grievance Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep pothole causing skids opposite Sony Center"
                className="w-full px-4 py-3 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
              />
            </div>

            {/* Description + Voice Button */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Detailed Description *
                </label>

                {/* Voice Dictate Button */}
                <button
                  type="button"
                  onClick={handleVoiceDictation}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-warm ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-forest-100 hover:bg-forest-200 text-forest-800'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? t('listening') : t('voiceInput')}</span>
                </button>
              </div>

              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe size, depth, ongoing traffic hazard, water pooling, or risk to pedestrians..."
                className="w-full px-4 py-3 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
              ></textarea>
            </div>
          </div>

          {/* Section 4: Interactive Bengaluru Map Pin */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9EFE7] shadow-warm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-lg text-charcoal-900">
                  3. Pinpoint Location on City Map
                </h3>
                <p className="text-xs text-charcoal-500">
                  Click anywhere on the map to place the pinpoint, or click below to detect current location.
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-forest-100 hover:bg-forest-200 text-forest-800 text-xs font-bold transition-colors shadow-warm"
              >
                <Compass className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Locating...' : 'Use My Current Location'}</span>
              </button>
            </div>

            {/* Map Picker */}
            <div className="space-y-3">
              <LeafletMap
                center={selectedPosition}
                zoom={14}
                interactivePicker={true}
                selectedPosition={selectedPosition}
                onSelectPosition={handleMapPinSelect}
                height="380px"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-ivory-100 border border-[#E9EFE7] space-y-1">
                  <span className="text-charcoal-500 font-semibold">Street Address:</span>
                  <p className="font-bold text-charcoal-800 line-clamp-1">{address}</p>
                </div>
                <div className="p-3 rounded-xl bg-ivory-100 border border-[#E9EFE7] space-y-1">
                  <span className="text-charcoal-500 font-semibold">Coordinates:</span>
                  <p className="font-mono font-bold text-forest-800">
                    {selectedPosition[0].toFixed(5)}, {selectedPosition[1].toFixed(5)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-charcoal-500 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-forest" />
              <span>Protected by 200m duplicate detection. Real-time BBMP routing.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-base shadow-warm-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying & Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Submit Grievance to Municipal Board</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* Duplicate Alert Modal */}
      <DuplicateAlertModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        duplicatesData={duplicatesData}
        onUpvoteExisting={handleUpvoteExisting}
        onProceedAnyway={() => handleSubmit(null, true)}
        isSubmitting={isSubmitting}
      />

    </div>
  );
};

export default ReportIssuePage;
