import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_key, {
    expiresIn: "24h",
  });

  console.log("-----------generate token", token);
  return token;
};

export default generateToken;
