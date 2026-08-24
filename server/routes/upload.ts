import { Router, Response } from 'express';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const uploadRouter = Router();

// POST /api/upload - Handle image upload
uploadRouter.post('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { image, name, type } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided. Please provide a base64 or Data URI string.'
      });
    }

    if (typeof image !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Expected a string URL or Data URI.'
      });
    }

    // Validate size (max 8MB payload)
    const approximateSize = Math.round((image.length * 3) / 4);
    if (approximateSize > 8 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size exceeds maximum limit of 8MB.'
      });
    }

    // In this full-stack architecture, return the valid data URL / image url
    return res.json({
      success: true,
      message: 'Photo processed and uploaded successfully',
      url: image,
      name: name || 'uploaded-photo.webp',
      size: approximateSize,
      uploadedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Photo upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload photo.'
    });
  }
});
