const mongoose = require('mongoose');

const criteriaSchema = new mongoose.Schema({
  type: String,
  threshold: Number
});
const achievementSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  criteria: criteriaSchema,
  rarity: String,   // common, rare, epic, legendary
  xpReward: Number
});

module.exports = mongoose.model('Achievement', achievementSchema);