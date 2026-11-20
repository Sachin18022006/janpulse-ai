import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all complaints with comprehensive admin filters
// @route   GET /api/admin/complaints
// @access  Private (Admin)
export const getAdminComplaints = async (req, res) => {
  try {
    const {
      status,
      category,
      department,
      urgency,
      severityMin,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 100,
    } = req.query;

    const query = {};

    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;
    if (department && department !== 'All') query.department = department;
    if (urgency && urgency !== 'All') query.urgency = urgency;
    if (severityMin) query.severity = { $gte: parseInt(severityMin) };

    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('reporter', 'name email phone avatar')
      .sort(sort)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      count: complaints.length,
      total,
      data: complaints,
    });
  } catch (error) {
    console.error('Admin complaints fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching admin complaints.',
    });
  }
};

// @desc    Update complaint status, official remarks, and resolution proof
// @route   PUT /api/admin/complaints/:id/status
// @access  Private (Admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    let resolutionProofUrl = complaint.resolutionProofUrl;

    if (req.file) {
      try {
        const cloudUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname, 'janpulse/resolutions');
        if (cloudUrl) {
          resolutionProofUrl = cloudUrl;
        } else {
          const filename = `proof-${Date.now()}-${path.extname(req.file.originalname)}`;
          const filepath = path.join(__dirname, '../uploads', filename);
          fs.writeFileSync(filepath, req.file.buffer);
          resolutionProofUrl = `/uploads/${filename}`;
        }
      } catch (uploadErr) {
        const filename = `proof-${Date.now()}-${path.extname(req.file.originalname)}`;
        const filepath = path.join(__dirname, '../uploads', filename);
        fs.writeFileSync(filepath, req.file.buffer);
        resolutionProofUrl = `/uploads/${filename}`;
      }
    } else if (req.body.resolutionProofUrl) {
      resolutionProofUrl = req.body.resolutionProofUrl;
    }

    const oldStatus = complaint.status;
    complaint.status = status || complaint.status;
    complaint.officialRemarks = remarks || complaint.officialRemarks;
    complaint.resolutionProofUrl = resolutionProofUrl;

    if (status === 'Resolved' && !complaint.resolutionDate) {
      complaint.resolutionDate = new Date();
    }

    // Add entry to timeline
    complaint.timeline.push({
      status: complaint.status,
      title: `Status Changed to ${complaint.status}`,
      description: remarks || `Municipal administrative action: Status updated from ${oldStatus} to ${complaint.status}.`,
      updatedBy: req.user.name + ` (${req.user.department || 'BBMP Administrator'})`,
      timestamp: new Date(),
    });

    await complaint.save();

    res.json({
      success: true,
      message: `Complaint status updated to ${complaint.status} successfully.`,
      data: complaint,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating complaint status.',
    });
  }
};

// @desc    Assign municipal department / field unit
// @route   PUT /api/admin/complaints/:id/assign
// @access  Private (Admin)
export const assignDepartment = async (req, res) => {
  try {
    const { department, assignedTo, remarks } = req.body;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (department) complaint.department = department;
    if (assignedTo) complaint.assignedTo = assignedTo;
    if (complaint.status === 'Submitted' || complaint.status === 'AI Analyzed') {
      complaint.status = 'Assigned';
    }

    complaint.timeline.push({
      status: 'Assigned',
      title: 'Department Assigned',
      description: remarks || `Reassigned to ${department || complaint.department} - ${assignedTo || complaint.assignedTo}`,
      updatedBy: req.user.name,
      timestamp: new Date(),
    });

    await complaint.save();

    res.json({
      success: true,
      message: 'Department assigned successfully.',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error assigning department.',
    });
  }
};

// @desc    Get user management list for admin
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
