// hashPassword.js
import bcrypt from "bcryptjs";

const generateHash = async () => {
  const password = "Admin123"; // the password you want to use
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);
};

generateHash();
