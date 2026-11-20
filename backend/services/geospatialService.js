import Complaint from '../models/Complaint.js';

/**
 * Calculates the great-circle distance between two points on Earth using the Haversine formula (in meters)
 */
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

/**
 * Tokenizes text and calculates word-level Jaccard similarity (0 to 1)
 */
const textSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  const words1 = new Set(text1.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(text2.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
};

/**
 * Core Duplicate Complaint Detection Service
 * Finds open complaints within 200m radius using MongoDB 2dsphere index and calculates similarity score
 */
export const detectDuplicateComplaints = async ({
  longitude,
  latitude,
  category,
  description = '',
  excludeComplaintId = null,
  maxDistance = 200, // 200 meters as per specification
}) => {
  try {
    // 1. Query MongoDB using geospatial 2dsphere $near within maxDistance meters
    const query = {
      status: { $ne: 'Resolved' },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: maxDistance,
        },
      },
    };

    if (excludeComplaintId) {
      query._id = { $ne: excludeComplaintId };
    }

    const nearbyComplaints = await Complaint.find(query)
      .populate('reporter', 'name email avatar')
      .limit(10)
      .lean();

    if (!nearbyComplaints || nearbyComplaints.length === 0) {
      return {
        hasDuplicates: false,
        count: 0,
        duplicates: [],
      };
    }

    // 2. Score each candidate by distance proximity, category matching, and description overlap
    const evaluated = nearbyComplaints.map((item) => {
      const itemLon = item.location.coordinates[0];
      const itemLat = item.location.coordinates[1];
      const distance = calculateDistanceMeters(latitude, longitude, itemLat, itemLon);

      // Category match score: exact = 1.0, otherwise 0.2
      const categoryMatch = item.category?.toLowerCase() === category?.toLowerCase();
      const categoryScore = categoryMatch ? 1.0 : 0.2;

      // Distance score: 0m = 1.0, 200m = 0.0
      const distanceScore = Math.max(0, (maxDistance - distance) / maxDistance);

      // Text similarity
      const textScore = textSimilarity(description, item.description + ' ' + item.title);

      // Weighted total similarity score
      // Category 40%, Distance 40%, Text 20%
      const totalScore = categoryScore * 0.45 + distanceScore * 0.35 + textScore * 0.20;

      return {
        ...item,
        distanceMeters: distance,
        similarityScore: Math.round(totalScore * 100),
        isStrongMatch: totalScore >= 0.55 || (categoryMatch && distance <= 100),
      };
    });

    // Sort by similarity score descending
    evaluated.sort((a, b) => b.similarityScore - a.similarityScore);

    const duplicates = evaluated.filter(e => e.distanceMeters <= maxDistance);

    return {
      hasDuplicates: duplicates.length > 0,
      count: duplicates.length,
      duplicates,
      topMatch: duplicates[0] || null,
    };
  } catch (error) {
    console.error('Error in geospatial duplicate detection:', error.message);
    return {
      hasDuplicates: false,
      count: 0,
      duplicates: [],
      error: error.message,
    };
  }
};
