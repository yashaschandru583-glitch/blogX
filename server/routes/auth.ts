import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from '../db.js';
import { requireAuth, AuthenticatedRequest, JWT_SECRET } from '../middleware/auth.js';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password, avatar, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are all required fields.' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long.' 
      });
    }

    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'An account with this email address already exists.' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await dbService.createUser({
      name,
      email,
      password: hashedPassword,
      avatar,
      bio
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...sanitizedUser } = user;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to BLOGX.',
      user: sanitizedUser,
      token
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during registration.' 
    });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both email and password.' 
      });
    }

    const user = await dbService.findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password. Please check your credentials.' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password. Please check your credentials.' 
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...sanitizedUser } = user;

    return res.json({
      success: true,
      message: 'Login successful!',
      user: sanitizedUser,
      token
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during login.' 
    });
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await dbService.findUserById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User profile not found.' 
      });
    }

    const stats = await dbService.getUserStats(userId);
    const { password: _, ...sanitizedUser } = user;

    return res.json({
      success: true,
      user: {
        ...sanitizedUser,
        stats
      }
    });
  } catch (err: any) {
    console.error('Fetch me error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve user profile.' 
    });
  }
});

// PUT /api/auth/profile
authRouter.put('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { name, avatar, bio } = req.body;

    const updates: any = {};
    if (name && name.trim()) updates.name = name.trim();
    if (avatar !== undefined) updates.avatar = avatar.trim();
    if (bio !== undefined) updates.bio = bio.trim();

    const updated = await dbService.updateUser(userId, updates);
    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    const stats = await dbService.getUserStats(userId);
    const { password: _, ...sanitizedUser } = updated;

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        ...sanitizedUser,
        stats
      }
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile.' 
    });
  }
});
