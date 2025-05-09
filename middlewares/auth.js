import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers?.authorization
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    console.log(" Received Token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized", error: true, success: false });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_key);

    req.userId = decode.id;

    next();
  } catch (error) {
    console.log(" Auth Error:", error.message);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
export default auth;
