import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Filter, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Building2, 
  Upload, 
  X, 
  ArrowRight,
  Eye,
  Check,
  RefreshCw
} from 'lucide-react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [search, setSearch] = useState('');

  // Status Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [remarks, setRemarks] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Department Assign Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignedDepartment, setAssignedDepartment] = useState('');
  const [assignedUnit, setAssignedUnit] = useState('');

  const departments = [
    'BBMP Roads & Infrastructure',
    'BBMP Solid Waste Management',
    'BESCOM Street Lighting Division',
    'BWSSB Water Supply Division',
    'BBMP Stormwater Drains & Sanitation',
    'City Traffic & Public Safety Directorate',
  ];

  const fetchAdminComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedUrgency !== 'All') params.urgency = selectedUrgency;
      if (search.trim()) params.search = search.trim();

      const res = await adminAPI.getComplaints(params);
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.error('Error loading admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      // Redirect if not admin
      navigate('/login');
      return;
    }
    fetchAdminComplaints();
  }, [selectedCategory, selectedStatus, selectedUrgency, isAdmin]);

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setRemarks(complaint.officialRemarks || '');
    setProofFile(null);
    setProofPreview(complaint.resolutionProofUrl || '');
    setModalOpen(true);
  };

  const handleProofChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append('remarks', remarks);
      if (proofFile) {
        formData.append('resolutionProof', proofFile);
      }

      const res = await adminAPI.updateStatus(selectedComplaint._id, formData);
      if (res.data.success) {
        setModalOpen(false);
        fetchAdminComplaints();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update complaint status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setAssignedDepartment(complaint.department || departments[0]);
    setAssignedUnit(complaint.assignedTo || 'BBMP Ward Field Engineering Unit');
    setAssignModalOpen(true);
  };

  const handleAssignDepartment = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    try {
      const res = await adminAPI.assignDepartment(selectedComplaint._id, {
        department: assignedDepartment,
        assignedTo: assignedUnit,
      });
      if (res.data.success) {
        setAssignModalOpen(false);
        fetchAdminComplaints();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign department.');
    } finally {
      setIsUpdating(false);
    }
  };

  const criticalPending = complaints.filter(c => c.severity >= 8 && c.status !== 'Resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E9EFE7] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-forest-800">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Municipal Command & Dispatch
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900 mt-1">
            Grievance Triage & Resolution Room
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Logged in as <strong>{user?.name}</strong> • {user?.department || 'BBMP Central Authority'}
          </p>
        </div>

        <button
          onClick={fetchAdminComplaints}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#D5DFD1] text-xs font-bold text-charcoal-700 hover:bg-sage/40 transition-colors shadow-warm self-start"
        >
          <RefreshCw className="w-4 h-4 text-forest" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Critical Hazards Alert Banner */}
      {criticalPending.length > 0 && (
        <div className="p-5 rounded-3xl bg-red-50 border-2 border-red-200 text-red-900 space-y-3">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 animate-bounce" />
            <div>
              <h3 className="font-display font-bold text-base text-red-900">
                Action Required: {criticalPending.length} Unresolved Critical Hazards Flagged
              </h3>
              <p className="text-xs text-red-700">
                AI assigned severity ≥ 8 indicating immediate danger to citizen safety or critical infrastructure failure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {criticalPending.slice(0, 3).map((item) => (
              <div key={item._id} className="p-3 bg-white rounded-2xl border border-red-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-charcoal-700">#{item.complaintId}</span>
                  <SeverityBadge severity={item.severity} size="sm" showText={false} />
                </div>
                <p className="font-bold text-charcoal-900 truncate">{item.title}</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] text-charcoal-500 truncate">{item.address}</span>
                  <button
                    onClick={() => openStatusModal(item)}
                    className="text-[11px] font-bold text-red-700 hover:underline"
                  >
                    Triage Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#E9EFE7] shadow-warm flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[260px]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchAdminComplaints()}
              placeholder="Search by ID, title, street address..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-xs font-semibold text-charcoal-800"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="AI Analyzed">AI Analyzed</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Category selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-xs font-semibold text-charcoal-800"
          >
            <option value="All">All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Garbage">Garbage</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Drainage">Drainage</option>
            <option value="Public Safety">Public Safety</option>
          </select>

          {/* Urgency selector */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-xs font-semibold text-charcoal-800"
          >
            <option value="All">All Urgencies</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Complaints Table */}
      <div className="bg-white rounded-3xl border border-[#E9EFE7] shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-ivory-100 text-charcoal-600 font-bold uppercase tracking-wider text-[11px] border-b border-[#E9EFE7]">
              <tr>
                <th className="px-5 py-4">Complaint ID & Photo</th>
                <th className="px-5 py-4">Category & Location</th>
                <th className="px-5 py-4">Severity & Urgency</th>
                <th className="px-5 py-4">Assigned Department</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EFE7]">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-charcoal-500">
                    No complaints matching current admin filters.
                  </td>
                </tr>
              ) : (
                complaints.map((item) => (
                  <tr key={item._id} className="hover:bg-ivory-50/70 transition-colors">
                    {/* ID & Photo */}
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover bg-charcoal-100 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=200';
                          }}
                        />
                        <div>
                          <span className="font-mono font-bold text-xs text-charcoal-900 block">
                            #{item.complaintId}
                          </span>
                          <span className="text-[11px] text-charcoal-500 truncate max-w-[180px] block font-medium">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Location */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-forest-800 block">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-charcoal-500 truncate max-w-[200px] block">
                          {item.address}
                        </span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="px-5 py-4">
                      <SeverityBadge severity={item.severity} size="sm" />
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <span className="font-medium text-charcoal-800 block">
                          {item.department}
                        </span>
                        <span className="text-[10px] text-charcoal-500 block">
                          {item.assignedTo || 'Unassigned'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openAssignModal(item)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#D5DFD1] text-xs font-semibold hover:bg-sage/40 text-charcoal-700"
                          title="Assign Division"
                        >
                          Assign
                        </button>

                        <button
                          onClick={() => openStatusModal(item)}
                          className="px-3 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm"
                        >
                          Update Status
                        </button>

                        <Link
                          to={`/complaints/${item._id}`}
                          className="p-1.5 rounded-lg hover:bg-ivory-200 text-charcoal-500 hover:text-charcoal"
                          title="View Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATUS UPDATE & RESOLUTION PROOF MODAL */}
      {modalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-warm-xl border border-terracotta-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-charcoal-400 hover:text-charcoal hover:bg-ivory-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#E9EFE7] pb-4">
              <span className="font-mono text-xs font-bold text-terracotta">
                #{selectedComplaint.complaintId}
              </span>
              <h3 className="font-display font-extrabold text-xl text-charcoal-900 mt-0.5">
                Update Complaint Status & Resolution
              </h3>
              <p className="text-xs text-charcoal-500">
                {selectedComplaint.title}
              </p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              {/* Status Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Lifecycle Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-sm font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="AI Analyzed">AI Analyzed</option>
                  <option value="Verified">Verified by Authority</option>
                  <option value="Assigned">Assigned to Field Unit</option>
                  <option value="In Progress">In Progress (Field Work Ongoing)</option>
                  <option value="Resolved">Resolved (Remediation Complete)</option>
                </select>
              </div>

              {/* Official Remarks */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Official Municipal Remarks *
                </label>
                <textarea
                  rows={3}
                  required
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Bitumen hot-mix patching completed. Cordon removed and road cleared for traffic."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-xs sm:text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                ></textarea>
              </div>

              {/* Resolution Proof Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Resolution Proof Photograph (Mandatory for Resolved status)
                </label>

                {proofPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-forest-300 h-44 bg-forest-50 flex items-center justify-center">
                    <img
                      src={proofPreview}
                      alt="Proof"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProofFile(null);
                        setProofPreview('');
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-charcoal/70 text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => document.getElementById('proofInput').click()}
                    className="border-2 border-dashed border-[#D5DFD1] hover:border-forest rounded-2xl p-6 text-center cursor-pointer bg-ivory-50"
                  >
                    <input
                      id="proofInput"
                      type="file"
                      accept="image/*"
                      onChange={handleProofChange}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-forest mx-auto mb-2" />
                    <span className="text-xs font-bold text-charcoal-700 block">
                      Upload Repair / Completion Photo
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      JPG, PNG taken by field inspection team
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E9EFE7]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-charcoal-300 text-xs font-semibold text-charcoal-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm disabled:opacity-50"
                >
                  {isUpdating ? 'Saving Update...' : 'Commit Status & Log Timeline'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* DEPARTMENT REASSIGNMENT MODAL */}
      {assignModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-warm-xl border border-[#D5DFD1] space-y-6 relative">
            <button
              onClick={() => setAssignModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-charcoal-400 hover:text-charcoal hover:bg-ivory-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#E9EFE7] pb-4">
              <span className="font-mono text-xs font-bold text-forest-800">
                #{selectedComplaint.complaintId}
              </span>
              <h3 className="font-display font-extrabold text-xl text-charcoal-900 mt-0.5">
                Assign Municipal Department
              </h3>
              <p className="text-xs text-charcoal-500">
                Route this grievance to the authorized civic engineering division
              </p>
            </div>

            <form onSubmit={handleAssignDepartment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Responsible Municipal Department
                </label>
                <select
                  value={assignedDepartment}
                  onChange={(e) => setAssignedDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-sm font-semibold text-charcoal-800"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Assigned Field Engineering Unit
                </label>
                <input
                  type="text"
                  required
                  value={assignedUnit}
                  onChange={(e) => setAssignedUnit(e.target.value)}
                  placeholder="e.g. BBMP East Zone Rapid Repair Crew #4"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-xs sm:text-sm text-charcoal-800"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E9EFE7]">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-charcoal-300 text-xs font-semibold text-charcoal-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white text-xs font-bold shadow-warm disabled:opacity-50"
                >
                  {isUpdating ? 'Assigning...' : 'Assign & Notify Division'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
