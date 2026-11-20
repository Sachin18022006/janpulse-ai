import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the civic issue'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image of the civic issue'],
    },
    category: {
      type: String,
      required: [true, 'Please select an issue category'],
      enum: [
        'Road Damage',
        'Garbage',
        'Streetlight',
        'Water Leakage',
        'Drainage',
        'Public Safety',
        'Other',
      ],
      default: 'Other',
    },
    severity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 5,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.9,
    },
    department: {
      type: String,
      required: true,
      default: 'BBMP Urban Local Body',
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    detectedObjects: {
      type: [String],
      default: [],
    },
    recommendedAction: {
      type: String,
      default: 'Inspection scheduled by municipal field supervisor.',
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'AI Analyzed',
        'Verified',
        'Assigned',
        'In Progress',
        'Resolved',
      ],
      default: 'Submitted',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
      default: 'Bengaluru, Karnataka, India',
    },
    landmark: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: 'Bengaluru',
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reporterName: {
      type: String,
      default: 'Anonymous Citizen',
    },
    upvotesCount: {
      type: Number,
      default: 0,
    },
    assignedTo: {
      type: String,
      default: 'BBMP Ward Field Engineering Unit',
    },
    officialRemarks: {
      type: String,
      default: '',
    },
    resolutionProofUrl: {
      type: String,
      default: '',
    },
    resolutionDate: {
      type: Date,
    },
    timeline: [
      {
        status: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        updatedBy: { type: String, default: 'System' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    aiRawResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB 2dsphere Geospatial Index for 200m duplicate search and radius queries
complaintSchema.index({ location: '2dsphere' });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ severity: -1 });

export default mongoose.model('Complaint', complaintSchema);
