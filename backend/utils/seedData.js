import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Upvote from '../models/Upvote.js';

export const seedDatabaseIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already populated. Skipping auto-seeding.');
      return;
    }

    console.log('🌱 Populating JanPulse AI demonstration database with Bengaluru civic data...');

    // 1. Create Demo Users
    const citizen = await User.create({
      name: 'Aarav Sharma',
      email: 'citizen@example.com',
      password: 'citizen123',
      role: 'citizen',
      phone: '+91 98450 12345',
      badge: 'Civic Guardian 🌟',
    });

    const citizen2 = await User.create({
      name: 'Priyanka Rao',
      email: 'priyanka@example.com',
      password: 'citizen123',
      role: 'citizen',
      phone: '+91 98765 43210',
      badge: 'Neighborhood Watch 🛡️',
    });

    const admin = await User.create({
      name: 'Dr. Ramesh Kumar, IAS',
      email: 'admin@janpulse.gov.in',
      password: 'admin123',
      role: 'admin',
      phone: '+91 80 2221 1122',
      department: 'BBMP Central Grievance Command',
      badge: 'Chief Municipal Commissioner',
    });

    // 2. Realistic Sample Complaints across Bengaluru
    const sampleComplaints = [
      {
        complaintId: 'JP-2026-BLR-1001',
        title: 'Deep Crater Pothole on 100ft Road Indiranagar',
        description: 'Dangerous 1.5-foot deep pothole directly opposite Sony Center on 100 Feet Road. Two two-wheeler riders skidded during evening rain yesterday.',
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
        category: 'Road Damage',
        severity: 8,
        confidence: 0.95,
        department: 'BBMP Roads & Infrastructure',
        urgency: 'High',
        detectedObjects: ['Severe Asphalt Crater', 'Dislodged Bitumen', 'Traffic Hazard Zone'],
        recommendedAction: 'Deploy urgent emergency cold-mix asphalt patching and notify traffic wardens.',
        status: 'In Progress',
        location: {
          type: 'Point',
          coordinates: [77.6406, 12.9719], // [lon, lat] Indiranagar 100ft Rd
        },
        address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, 560038',
        landmark: 'Opposite Sony Center',
        reporter: citizen._id,
        reporterName: citizen.name,
        upvotesCount: 24,
        assignedTo: 'BBMP East Zone Road Engineering Division #4',
        officialRemarks: 'Work order #ENG-4892 issued. Bitumen hot-mix vehicle scheduled for nighttime deployment.',
        timeline: [
          {
            status: 'Submitted',
            title: 'Grievance Lodged',
            description: 'Resident uploaded geo-tagged photograph and hazard report.',
            updatedBy: citizen.name,
            timestamp: new Date(Date.now() - 36 * 3600 * 1000),
          },
          {
            status: 'AI Analyzed',
            title: 'Gemini AI Assessment',
            description: 'AI classified as Road Damage with Severity 8/10. Routed to BBMP Roads & Infrastructure.',
            updatedBy: 'JanPulse Gemini AI',
            timestamp: new Date(Date.now() - 35 * 3600 * 1000),
          },
          {
            status: 'Assigned',
            title: 'Division Assigned',
            description: 'Assigned to Executive Engineer, East Zone BBMP.',
            updatedBy: admin.name,
            timestamp: new Date(Date.now() - 24 * 3600 * 1000),
          },
          {
            status: 'In Progress',
            title: 'Repair In Motion',
            description: 'Barricades placed. Asphalt crew dispatched.',
            updatedBy: 'BBMP East Zone Engineer',
            timestamp: new Date(Date.now() - 6 * 3600 * 1000),
          },
        ],
      },
      // Target for Duplicate Detection Test: 45 meters away from complaint 1001 on the same stretch!
      {
        complaintId: 'JP-2026-BLR-1002',
        title: 'Asphalt Depression Near 12th Main Corner',
        description: 'Road damage and broken bitumen along 100ft Road just past 12th Main junction. Pothole causing sudden braking.',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?w=800&auto=format&fit=crop&q=80',
        category: 'Road Damage',
        severity: 7,
        confidence: 0.92,
        department: 'BBMP Roads & Infrastructure',
        urgency: 'High',
        detectedObjects: ['Pothole Edge', 'Surface Crack', 'Loose Gravel'],
        recommendedAction: 'Schedule joint milling and resurfacing with neighboring distress spot.',
        status: 'Assigned',
        location: {
          type: 'Point',
          coordinates: [77.6409, 12.9722], // ~45 meters from 1001!
        },
        address: '12th Main Rd / 100 Feet Rd Junction, Indiranagar, Bengaluru',
        landmark: 'Near 12th Main Crossing',
        reporter: citizen2._id,
        reporterName: citizen2.name,
        upvotesCount: 16,
        assignedTo: 'BBMP East Zone Road Engineering Division #4',
        timeline: [
          {
            status: 'Submitted',
            title: 'Complaint Registered',
            description: 'Citizen submitted grievance.',
            updatedBy: citizen2.name,
            timestamp: new Date(Date.now() - 20 * 3600 * 1000),
          },
          {
            status: 'AI Analyzed',
            title: 'Duplicate Detected by AI',
            description: 'System identified proximity to #JP-2026-BLR-1001 (45m away).',
            updatedBy: 'JanPulse Geospatial Triage',
            timestamp: new Date(Date.now() - 19 * 3600 * 1000),
          },
        ],
      },
      {
        complaintId: 'JP-2026-BLR-1003',
        title: 'Critical Open Stormwater Drain on 80ft Road Koramangala',
        description: 'Huge broken concrete slab on main stormwater drain sidewalk. Severe pedestrian hazard, especially in dark hours. Risk of fatal fall.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        category: 'Drainage',
        severity: 9,
        confidence: 0.98,
        department: 'BBMP Stormwater Drains & Sanitation',
        urgency: 'Critical',
        detectedObjects: ['Open Drain Chasm', 'Broken RCC Slab', 'Pedestrian Walkway Breach'],
        recommendedAction: 'Immediate safety cordon placement and replacement of pre-cast reinforced concrete slabs.',
        status: 'Assigned',
        location: {
          type: 'Point',
          coordinates: [77.6256, 12.9352], // Koramangala 80ft Rd
        },
        address: '80 Feet Rd, 6th Block, Koramangala, Bengaluru, 560095',
        landmark: 'Near Koramangala Indoor Stadium',
        reporter: citizen._id,
        reporterName: citizen.name,
        upvotesCount: 42,
        assignedTo: 'South Zone Stormwater Drain Division',
        officialRemarks: 'Emergency barrier installed. Replacement reinforced cement concrete slab ordered from vendor.',
        timeline: [
          {
            status: 'Submitted',
            title: 'Grievance Lodged',
            description: 'Emergency safety hazard reported.',
            updatedBy: citizen.name,
            timestamp: new Date(Date.now() - 48 * 3600 * 1000),
          },
          {
            status: 'AI Analyzed',
            title: 'Urgent AI Triage',
            description: 'Severity 9/10 flagged. Immediate supervisor alert dispatched.',
            updatedBy: 'JanPulse Gemini AI',
            timestamp: new Date(Date.now() - 47 * 3600 * 1000),
          },
          {
            status: 'Assigned',
            title: 'Dispatched to Rapid Action Force',
            description: 'Contractor instructed to secure site within 2 hours.',
            updatedBy: admin.name,
            timestamp: new Date(Date.now() - 40 * 3600 * 1000),
          },
        ],
      },
      {
        complaintId: 'JP-2026-BLR-1004',
        title: 'Massive Garbage Dumping & Burning Hazard at HSR Sector 2',
        description: 'Illegal commercial waste dumping ground forming near 24th Main park corner. Waste accumulation emitting toxic fumes from sporadic burning.',
        imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
        category: 'Garbage',
        severity: 8,
        confidence: 0.94,
        department: 'BBMP Solid Waste Management',
        urgency: 'High',
        detectedObjects: ['Commercial Plastic Refuse', 'Decomposing Food Waste', 'Stagnant Leachate'],
        recommendedAction: 'Deploy mechanical tipper loaders, establish CCTV surveillance, and conduct sanitization spray.',
        status: 'In Progress',
        location: {
          type: 'Point',
          coordinates: [77.6499, 12.9116], // HSR Sector 2
        },
        address: '24th Main Rd, Sector 2, HSR Layout, Bengaluru, 560102',
        landmark: 'Opposite Neighborhood Sector Park',
        reporter: citizen2._id,
        reporterName: citizen2.name,
        upvotesCount: 31,
        assignedTo: 'HSR Ward 174 Sanitation Team',
        timeline: [
          {
            status: 'Submitted',
            title: 'Reported by Residents Welfare Association',
            description: 'Grievance submitted regarding sanitation health risks.',
            updatedBy: citizen2.name,
            timestamp: new Date(Date.now() - 28 * 3600 * 1000),
          },
          {
            status: 'In Progress',
            title: 'Tipper Dispatched',
            description: 'Solid waste management crew actively clearing the perimeter.',
            updatedBy: 'Ward 174 Health Inspector',
            timestamp: new Date(Date.now() - 10 * 3600 * 1000),
          },
        ],
      },
      {
        complaintId: 'JP-2026-BLR-1005',
        title: 'Drinking Water Pipeline Burst on 10th Cross Malleshwaram',
        description: 'Potable water gushing onto the road under high pressure. Thousands of liters being wasted, causing water pressure drop in nearby residences.',
        imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80',
        category: 'Water Leakage',
        severity: 8,
        confidence: 0.96,
        department: 'BWSSB Water Supply Division',
        urgency: 'High',
        detectedObjects: ['Subsurface Main Rupture', 'Water Gush', 'Road Flooding'],
        recommendedAction: 'Isolate Malleshwaram feeder valve #3 and weld/sleeve 200mm ductile iron pipe.',
        status: 'Resolved',
        location: {
          type: 'Point',
          coordinates: [77.5702, 12.9988], // Malleshwaram
        },
        address: '10th Cross Rd, Malleshwaram, Bengaluru, 560003',
        landmark: 'Near Margosa Road Junction',
        reporter: citizen._id,
        reporterName: citizen.name,
        upvotesCount: 38,
        assignedTo: 'BWSSB North Sub-Division Team 2',
        officialRemarks: 'Feeder valve isolated. Main line excavated and permanent ductile iron collar sleeve welded. Supply restored.',
        resolutionProofUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        resolutionDate: new Date(Date.now() - 4 * 3600 * 1000),
        timeline: [
          {
            status: 'Submitted',
            title: 'Pipeline Burst Logged',
            description: 'Citizen reported massive water waste.',
            updatedBy: citizen.name,
            timestamp: new Date(Date.now() - 52 * 3600 * 1000),
          },
          {
            status: 'AI Analyzed',
            title: 'AI Automated Triage',
            description: 'Routed instantly to BWSSB Water Supply Division.',
            updatedBy: 'JanPulse Gemini AI',
            timestamp: new Date(Date.now() - 51 * 3600 * 1000),
          },
          {
            status: 'In Progress',
            title: 'Excavation & Repair',
            description: 'Emergency crew repaired pipe rupture.',
            updatedBy: 'BWSSB Field Engineer',
            timestamp: new Date(Date.now() - 14 * 3600 * 1000),
          },
          {
            status: 'Resolved',
            title: 'Civic Grievance Resolved',
            description: 'Pressure tested and photographic resolution proof submitted.',
            updatedBy: admin.name,
            timestamp: new Date(Date.now() - 4 * 3600 * 1000),
          },
        ],
      },
      {
        complaintId: 'JP-2026-BLR-1006',
        title: 'Non-Functional Streetlights on MG Road Metro Boulevard',
        description: 'Entire sequence of 6 LED streetlights completely dark along the pedestrian walkway from Trinity Circle to MG Road station.',
        imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
        category: 'Streetlight',
        severity: 5,
        confidence: 0.91,
        department: 'BESCOM Street Lighting Division',
        urgency: 'Medium',
        detectedObjects: ['Dark Luminaire Cluster', 'Unlit Pedestrian Corridor'],
        recommendedAction: 'Inspect underground feeder cable and reset phase fuse in distribution pillar.',
        status: 'Submitted',
        location: {
          type: 'Point',
          coordinates: [77.6074, 12.9756], // MG Road
        },
        address: 'Mahatma Gandhi Rd, Bengaluru, 560001',
        landmark: 'Between Trinity Circle & Metro Station',
        reporter: citizen2._id,
        reporterName: citizen2.name,
        upvotesCount: 9,
        assignedTo: 'BESCOM Central Division',
        timeline: [
          {
            status: 'Submitted',
            title: 'Grievance Submitted',
            description: 'Resident notified civic body of dark corridor.',
            updatedBy: citizen2.name,
            timestamp: new Date(Date.now() - 8 * 3600 * 1000),
          },
        ],
      },
      {
        complaintId: 'JP-2026-BLR-1007',
        title: 'Exposed High-Voltage Cable at ITPL Main Road Whitefield',
        description: 'Trench dug for utility laying left uncovered with live insulated cable hanging directly next to bus stop shelter. Severe hazard during rain.',
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
        category: 'Public Safety',
        severity: 9,
        confidence: 0.97,
        department: 'City Traffic & Public Safety Directorate',
        urgency: 'Critical',
        detectedObjects: ['Exposed Electrical Conduit', 'Open Trench', 'Public Bus Stop Hazard'],
        recommendedAction: 'Immediate BESCOM safety shutdown, cable encasing, and trench backfilling.',
        status: 'In Progress',
        location: {
          type: 'Point',
          coordinates: [77.7499, 12.9866], // Whitefield ITPL
        },
        address: 'ITPL Main Rd, Pattandur Agrahara, Whitefield, Bengaluru, 560066',
        landmark: 'Near ITPL Gate 2 Bus Stop',
        reporter: citizen._id,
        reporterName: citizen.name,
        upvotesCount: 56,
        assignedTo: 'BESCOM & Public Safety Rapid Response',
        officialRemarks: 'Site cordoned off with high-visibility danger tape. Power de-energized on auxiliary line.',
        timeline: [
          {
            status: 'Submitted',
            title: 'Critical Safety Hazard Reported',
            description: 'Reported by daily commuter.',
            updatedBy: citizen.name,
            timestamp: new Date(Date.now() - 18 * 3600 * 1000),
          },
          {
            status: 'In Progress',
            title: 'Emergency Intervention',
            description: 'Cordon established and power isolated.',
            updatedBy: admin.name,
            timestamp: new Date(Date.now() - 12 * 3600 * 1000),
          },
        ],
      },
    ];

    const insertedComplaints = await Complaint.insertMany(sampleComplaints);
    console.log(`Successfully seeded ${insertedComplaints.length} demonstration complaints.`);

    // 3. Seed upvotes
    await Upvote.create({
      complaint: insertedComplaints[0]._id,
      user: citizen2._id,
    });
    await Upvote.create({
      complaint: insertedComplaints[2]._id,
      user: citizen._id,
    });

    console.log('Seed data setup completed successfully! 🎉');
  } catch (error) {
    console.error('Error seeding demonstration database:', error);
  }
};
