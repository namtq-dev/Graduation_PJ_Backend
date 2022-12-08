const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../helpers/tokens');
const { sendVerificationEmail } = require('../helpers/mailer');
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require('../helpers/validation');

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'invalid email address',
      });
    }
    const isUsedEmail = await User.findOne({ email });
    if (isUsedEmail) {
      return res.status(400).json({
        message: 'this email is already associated with an account',
      });
    }

    if (!validateLength(firstName, 3, 30)) {
      return res.status(400).json({
        message: 'firstName must be between 3 and 30 characters',
      });
    }

    if (!validateLength(lastName, 3, 30)) {
      return res.status(400).json({
        message: 'lastName must be between 3 and 30 characters',
      });
    }

    if (!validateLength(password, 6, 50)) {
      return res.status(400).json({
        message: 'password must have at least 6 characters',
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);
    let generatedUsername = await validateUsername(firstName + lastName);

    const user = await new User({
      firstName,
      lastName,
      email,
      password: cryptedPassword,
      username: generatedUsername,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();

    const emailVerificationToken = generateToken({ id: user._id }, '30m');
    const emailVerificationUrl = `${process.env.FRONTEND_BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.firstName, emailVerificationUrl);

    const loginToken = generateToken({ id: user._id }, '7d');
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      firstName: user.firstName,
      lastName: user.lastName,
      loginToken,
      verified: user.verified,
      message:
        'Register successfully! Please check your email to activate your account!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
