const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'cantaflow_pixellab_secret_jwt_key_2026_production',
    { expiresIn: '30d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, churchName, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'E-mail já cadastrado no CantaFlow.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      churchName: churchName || 'AD Guaratinguetá',
      role: role || 'musician',
      plan: 'free',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        churchName: user.churchName,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Dados de usuário inválidos.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        churchName: user.churchName,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upgrade / Toggle Plan (Free vs Pro)
// @route   POST /api/auth/toggle-plan
const togglePlan = async (req, res) => {
  try {
    const { targetPlan, email } = req.body;
    let user = null;

    if (req.user && req.user._id !== 'guest_user_id') {
      user = await User.findById(req.user._id);
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      // Mock update for guest session
      return res.json({
        success: true,
        plan: targetPlan || 'pro',
        message: `Plano atualizado para ${targetPlan ? targetPlan.toUpperCase() : 'PRO'} (PixelLab)`,
      });
    }

    user.plan = targetPlan || (user.plan === 'pro' ? 'free' : 'pro');
    await user.save();

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      plan: user.plan,
      message: `Plano atualizado com sucesso para ${user.plan.toUpperCase()}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    if (!req.user || req.user._id === 'guest_user_id') {
      return res.json({
        _id: 'guest_user_id',
        name: 'Músico Convidado',
        email: 'convidado@cantaflow.pixellab.com',
        plan: req.headers['x-plan'] || 'free',
        churchName: 'AD Guaratinguetá',
        role: 'musician',
      });
    }

    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, togglePlan, getUserProfile };
