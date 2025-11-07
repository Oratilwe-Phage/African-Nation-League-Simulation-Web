import dotenv from "dotenv";
dotenv.config();

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;


  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    return res.json({ success: true, message: "Login successful" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};
