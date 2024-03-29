const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema(
  {
    email: { type: String },
    otp: { type: String },
    status: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

const OTP = mongoose.model("Otp", otpSchema);
module.exports = OTP;