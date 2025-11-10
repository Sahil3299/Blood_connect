const Registration = require('../models/registration');

const registerDonor = async (req, res) => {
  try {
    const registrationData = req.body;
    const newRegistration = new Registration(registrationData);
    await newRegistration.save();
    res.status(201).json({ message: 'Registration successful', registration: newRegistration });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error during registration', error });
  }
};

const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;
    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = city;
    const donors = await Registration.find(query);
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donors', error });
  }
};

module.exports = {
  registerDonor,
  searchDonors,
};