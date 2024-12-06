/**
 * This is the indexer for contractor model
 * @author Manthan Vaghasiya
 * @since Saturday, May 28, 2022
 */

const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  contractorType: { type: String },
  companyName: { type: String },
  phone: { type: String },
  email: { type: String },
  password: { type: String },
  micsConNotes: { type: String },
  address1: { type: String, default: "ra" },
  address2: { type: String },
  loginToken: [
    {
      token: {
        type: String,
      },
    },
  ],
  city: { type: String },
  state: { type: String },
  zipcode: { type: String },
  country: { type: String },
  empIdentiNumber: { type: String },
  licenseInfo: { type: String },
  insureanceInfo: { type: String },
  bondInfo: { type: String },
  mainUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Number,
  isUpdated: Boolean,
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("contractor", contractorSchema);
