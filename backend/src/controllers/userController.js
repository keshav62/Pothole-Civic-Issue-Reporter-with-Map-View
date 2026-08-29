import User from '../models/User.js';

/**
 * GET /api/users
 * Returns list of real registered users from MongoDB Atlas.
 * Supports query params: role, department, ward, search, page, limit.
 */
export const getUsers = async (req, res, next) => {
  try {
    const { role, department, ward, search, page = 1, limit = 100 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (ward) query.ward = ward;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const formattedUsers = users.map(u => ({
      id: u._id,
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone || '+91 98765 43210',
      role: u.role,
      roleLabel: u.role?.replace('_', ' '),
      department: u.department || 'General',
      ward: u.ward || 'General Ward',
      status: u.isActive ? 'ACTIVE' : 'INACTIVE',
      avatar: u.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
      createdAt: u.createdAt,
      lastActive: u.updatedAt ? new Date(u.updatedAt).toLocaleTimeString() : 'Just now'
    }));

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: formattedUsers,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: user.department,
          ward: user.ward,
          status: user.isActive ? 'ACTIVE' : 'INACTIVE'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 * Create a new user in MongoDB database.
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, role, department, ward, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = await User.create({
      firebaseUid: `admin-created-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: role || 'CITIZEN',
      department: department || null,
      ward: ward || null,
      phone: phone || null
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    const { name, role, department, ward, phone, status, isActive } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (department !== undefined) updateData.department = department;
    if (ward !== undefined) updateData.ward = ward;
    if (phone !== undefined) updateData.phone = phone;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (status) updateData.isActive = (status === 'ACTIVE');

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
