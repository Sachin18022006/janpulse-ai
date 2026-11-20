import Complaint from '../models/Complaint.js';
import Upvote from '../models/Upvote.js';
import { analyzeCivicIssue } from '../services/geminiService.js';
import { detectDuplicateComplaints, calculateDistanceMeters } from '../services/geospatialService.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to generate unique human-readable complaint ID
const generateComplaintId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `JP-2026-BLR-${randomNum}`;
};

// @desc    Pre-analyze image & description with Gemini AI before submission
// @route   POST /api/ai/analyze
// @access  Public (or protected)
export const analyzeComplaintAI = async (req, res) => {
  try {
    let imageBase64 = null;
    let mimeType = null;

    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype;
    } else if (req.body.imageBase64) {
      imageBase64 = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      mimeType = req.body.mimeType || 'image/jpeg';
    }

    const description = req.body.description || '';
    const categoryHint = req.body.category || '';

    const aiResult = await analyzeCivicIssue({
      imageBase64,
      mimeType,
      description,
      categoryHint,
    });

    res.json({
      success: true,
      data: aiResult,
    });
  } catch (error) {
    console.error('AI analysis controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete AI grievance analysis.',
      error: error.message,
    });
  }
};

// @desc    Check for potential duplicates in real-time by location and category
// @route   GET /api/complaints/nearby
// @access  Public
export const checkNearbyDuplicates = async (req, res) => {
  try {
    const { longitude, latitude, category, description } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required to check nearby complaints.',
      });
    }

    const result = await detectDuplicateComplaints({
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      category: category || '',
      description: description || '',
      maxDistance: 200, // 200m radius
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Nearby duplicates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to query duplicate complaints.',
      error: error.message,
    });
  }
};

// @desc    Create / Report a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      longitude,
      latitude,
      address,
      landmark,
      forceNewComplaint,
    } = req.body;

    if (!description || !longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide issue description, latitude, and longitude.',
      });
    }

    // Process image: Upload to Cloudinary or save to local disk
    let imageUrl = '';
    let imageBase64 = null;
    let mimeType = null;

    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype;

      try {
        const cloudUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        if (cloudUrl) {
          imageUrl = cloudUrl;
        } else {
          // Local fallback
          const filename = `civic-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
          const filepath = path.join(__dirname, '../uploads', filename);
          fs.writeFileSync(filepath, req.file.buffer);
          const host = req.get('host');
          const protocol = req.headers['x-forwarded-proto'] || req.protocol;
          imageUrl = `${protocol}://${host}/uploads/${filename}`;
        }
      } catch (uploadErr) {
        console.warn('Cloudinary upload fallback to local storage:', uploadErr.message);
        const filename = `civic-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
        const filepath = path.join(__dirname, '../uploads', filename);
        fs.writeFileSync(filepath, req.file.buffer);
        const host = req.get('host');
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        imageUrl = `${protocol}://${host}/uploads/${filename}`;
      }
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      // Sample fallback image for demo
      imageUrl = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60';
    }

    const parsedLon = parseFloat(longitude);
    const parsedLat = parseFloat(latitude);

    // 1. Check for duplicate complaints within 200m if citizen hasn't explicitly forced a new submission
    if (forceNewComplaint !== 'true' && forceNewComplaint !== true) {
      const duplicateCheck = await detectDuplicateComplaints({
        longitude: parsedLon,
        latitude: parsedLat,
        category: category || '',
        description,
        maxDistance: 200,
      });

      if (duplicateCheck.hasDuplicates && duplicateCheck.topMatch && duplicateCheck.topMatch.isStrongMatch) {
        return res.status(409).json({
          success: false,
          duplicateDetected: true,
          message: 'Potential duplicate civic complaint detected within 200 meters.',
          data: duplicateCheck,
        });
      }
    }

    // 2. Perform Gemini AI analysis
    const aiAnalysis = await analyzeCivicIssue({
      imageBase64,
      mimeType,
      description,
      categoryHint: category,
    });

    const complaintId = generateComplaintId();

    const newComplaint = await Complaint.create({
      complaintId,
      title: title || `${aiAnalysis.category} issue reported at ${address ? address.split(',')[0] : 'Bengaluru'}`,
      description,
      imageUrl,
      category: aiAnalysis.category,
      severity: aiAnalysis.severity,
      confidence: aiAnalysis.confidence,
      department: aiAnalysis.department,
      urgency: aiAnalysis.urgency,
      detectedObjects: aiAnalysis.detectedObjects,
      recommendedAction: aiAnalysis.recommendedAction,
      status: 'AI Analyzed',
      location: {
        type: 'Point',
        coordinates: [parsedLon, parsedLat],
      },
      address: address || 'Bengaluru, Karnataka, India',
      landmark: landmark || '',
      reporter: req.user._id,
      reporterName: req.user.name,
      timeline: [
        {
          status: 'Submitted',
          title: 'Complaint Registered',
          description: 'Grievance submitted by citizen with photographic evidence.',
          updatedBy: req.user.name,
          timestamp: new Date(),
        },
        {
          status: 'AI Analyzed',
          title: 'Gemini AI Multimodal Verification',
          description: `AI identified ${aiAnalysis.category} with severity ${aiAnalysis.severity}/10 (${aiAnalysis.urgency} urgency) and routed to ${aiAnalysis.department}.`,
          updatedBy: 'JanPulse Gemini AI Engine',
          timestamp: new Date(),
        },
      ],
      aiRawResponse: aiAnalysis,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted and verified by AI successfully!',
      data: newComplaint,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating complaint.',
    });
  }
};

// @desc    Get all complaints with filters, search, pagination, and sorting
// @route   GET /api/complaints
// @access  Public
export const getComplaints = async (req, res) => {
  try {
    const {
      category,
      status,
      severityMin,
      severityMax,
      search,
      department,
      sort = '-createdAt',
      page = 1,
      limit = 50,
      reporter,
    } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (reporter) {
      query.reporter = reporter;
    }

    if (severityMin || severityMax) {
      query.severity = {};
      if (severityMin) query.severity.$gte = parseInt(severityMin);
      if (severityMax) query.severity.$lte = parseInt(severityMax);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('reporter', 'name email avatar badge')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: complaints.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: complaints,
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching complaints.',
    });
  }
};

// @desc    Get single complaint by ID or complaintId
// @route   GET /api/complaints/:id
// @access  Public
export const getComplaintById = async (req, res) => {
  try {
    const id = req.params.id;
    let complaint;

    if (id.startsWith('JP-')) {
      complaint = await Complaint.findOne({ complaintId: id }).populate('reporter', 'name email avatar badge');
    } else {
      complaint = await Complaint.findById(id).populate('reporter', 'name email avatar badge');
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    let userHasUpvoted = false;
    if (req.user) {
      const existingUpvote = await Upvote.findOne({
        complaint: complaint._id,
        user: req.user._id,
      });
      userHasUpvoted = !!existingUpvote;
    }

    res.json({
      success: true,
      data: {
        ...complaint.toObject(),
        userHasUpvoted,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching complaint.',
    });
  }
};

// @desc    Upvote an existing complaint to prevent duplicate spam and boost priority
// @route   POST /api/complaints/:id/upvote
// @access  Private (Citizen)
export const upvoteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user._id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Check if user has already upvoted
    const existingUpvote = await Upvote.findOne({
      complaint: complaintId,
      user: userId,
    });

    if (existingUpvote) {
      // Toggle upvote off (remove)
      await Upvote.findByIdAndDelete(existingUpvote._id);
      complaint.upvotesCount = Math.max(0, complaint.upvotesCount - 1);
      await complaint.save();

      return res.json({
        success: true,
        message: 'Upvote removed.',
        upvoted: false,
        upvotesCount: complaint.upvotesCount,
      });
    }

    // Add new upvote
    await Upvote.create({
      complaint: complaintId,
      user: userId,
    });

    complaint.upvotesCount += 1;
    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint upvoted successfully! Municipal triage priority increased.',
      upvoted: true,
      upvotesCount: complaint.upvotesCount,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already upvoted this complaint.',
      });
    }
    console.error('Upvote error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error processing upvote.',
    });
  }
};

// @desc    Get current citizen's submitted complaints and upvotes
// @route   GET /api/users/my-complaints
// @access  Private
export const getMyComplaints = async (req, res) => {
  try {
    const myComplaints = await Complaint.find({ reporter: req.user._id }).sort('-createdAt');
    const myUpvotes = await Upvote.find({ user: req.user._id }).populate({
      path: 'complaint',
      populate: { path: 'reporter', select: 'name email' },
    });

    res.json({
      success: true,
      data: {
        submitted: myComplaints,
        upvoted: myUpvotes.map(u => u.complaint).filter(Boolean),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user contributions.',
    });
  }
};
