
const jwt = require("jsonwebtoken");
const User=require("../models/UsersModel");
const OTP=require("../models/OTPModel");
const SendEmailUtility=require("../utility/SMTPEmail");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.EMAIL_KEY);

// registration
exports.registration = (req, res) => {
  let reqBody = req.body;
  User.create(reqBody)
    .then((data) => {
      res.status(200).json({ status: "success", data: data });
    })
    .catch((error) => {
      // console.log(error)
      res.status(200).json({ status: "fail", data: error });
    });
};

//login
exports.login = async (req, res) => {
  try {
    let reqBody = req.body;
    let data = await User.aggregate([
      { $match: reqBody },
      {
        $project: {
          _id: 0,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
        },
      },
    ]);
    // console.log(result.length);
    if (data) {
      if (data.length > 0) {
        let payload = {exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,data: data[0]["email"],
        };
        let token = jwt.sign(payload, "SecretKey1234567890");
        res.status(200).json({ status: "success", data: data[0], token: token });
      } else {
        res.status(401).json({ status: "unauthorized" });
      }
    }
  } catch (error) {
    res.status(400).json({ status: "fail", data: error.message });
  }
};

// profileUpdate
exports.profileUpdate = async (req, res) => {
  try {
    let email = req.headers["email"];
    let reqBody = req.body;
    let data = await User.updateOne({ email }, reqBody);
    // console.log(updateData)
    if (data) {
      res.status(200).json({ status: "success", data: data });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", data: error });
  }
};

// profile Details
exports.profileDetails = async (req, res) => {
  try {
    let email = req.headers["email"];
    let result = await User.aggregate([
      { $match: { email } },
      {
        $project: {
          _id: 0,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
          password: 1,
        },
      },
    ]);
    // console.log(updateData)
    if (result) {
      res.status(200).json({ status: "success", data: result[0] });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", data: error });
  }
};

// Recover Verify Email

exports.RecoverVerifyEmail = async (req, res) => {
  let email = req.params.email;
  let OTPCODE = Math.floor(100000 + Math.random() * 900000);
  // console.log(OTP)
  try {
    let userCount = await User.aggregate([
      { $match: { email } },
      { $count: "total" },
    ]);
    if (userCount.length > 0) {
      await OTP.create({ email, otp: OTPCODE });
      // Email Send
      let SendEmail = await SendEmailUtility(
        email,
        OTPCODE,
        "Task Manager PIN Verification"
      );
      res.status(200).json({ status: "success", data: SendEmail });
    } else {
      res.status(200).json({ status: "fail", data: "User Not Found" });
    }
  } catch (error) {
    // console.log(error);
    res.status(400).json({ status: "fail=", error: error.message });
  }
};

// Recover Verify OTP
exports.VerifyOTP = async (req, res) => {
  let email = req.params.email;
  let otp = req.params.otp;
  let status = 0;
  let updateStatus = 1;

  try {
    let otpCount = await OTP.aggregate([
      { $match: { email, otp, status } },
      { $count: "total" },
    ]);

    if (otpCount.length > 0) {
      let OTPUpdate = await OTP.updateOne(
        { email, otp, status },
        { status: updateStatus }
      );
      res.status(200).json({ status: "success", data: OTPUpdate });
    } else {
      res.status(400).json({ status: "fail", data: "Invalid OTP" });
    }
  } catch (error) {
    // console.log(error);
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// Reset Password
exports.ResetPassword = async (req, res) => {
  let { email, otp, password } = req.body;
  let status = 1;
  try {
    let otpCount = await OTP.aggregate([
      { $match: { email, otp, status } },
      { $count: "total" },
    ]);

    if (otpCount.length > 0) {
      let updatePass = await User.updateOne({ email }, { password });
      res.status(200).json({ status: "success", data: updatePass });
    } else {
      res.status(200).json({ status: "fail", data: "Invalid Request" });
    }
  } catch (error) {
    // console.log(error);
    res.status(400).json({ status: "fail", error: error.message });
  }
};