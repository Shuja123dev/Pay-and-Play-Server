import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/UserModal.js";
import getLastRecord from "../utils/getLastRecord.js";
import sendMail from "../utils/sendMail.js";

const signUp = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  const emailExist = await User.findOne({ email });
  const phNoExist = await User.findOne({ phoneNumber });
  if (emailExist || phNoExist) {
    res.status(201).json({
      success: false,
      message: `${emailExist ? "Email" : "Phone Number"} already Taken`,
    });
    return;
  }

  const lastUser = await getLastRecord(User);
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      id: lastUser ? lastUser.id + 1 : 1,
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      isVerifed: false,
      role: "User",
      otp: null,
    });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.otp = otp;
    await user.save();
    sendMail(email, "OTP", otp, (error) => {
      if (error) {
        res.json({
          success: false,
          message: "Invalid email.",
        });
        return;
      }
    });
    res.status(200).json({
      success: true,
      message: "User added successfully",
    });
  } catch (e) {
    res.status(201).json({
      success: false,
      message: "User not added",
      error: e.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(202).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  // if (!user.isVerifed) {
  //     res.status(201).json({
  //         message: "User not Verfied"
  //     })
  //     return;
  // }
  const passwordIsValid = await bcrypt.compare(password, user.password);
  console.log(passwordIsValid);
  if (passwordIsValid) {
    const token = jsonwebtoken.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Incorrect Password",
    });
  }
};

export { signUp, login };
