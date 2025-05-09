import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide firstName"],
    },

    email: {
      type: String,
      required: [true, "Provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Provide email"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    referralCode: {
      type: String,
      unique: true,
    },
    orders: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    address: {
      type: String,
      required: [true, "Please enter Address!"],
    },
    pincode: {
      type: Number,
      min: 100000,
      max: 999999,
      required: [true, "Please enter Pin Code!"],
    },
    city: {
      type: String,
      required: [true, "Please enter City!"],
    },
    state: {
      type: String,
      required: [true, "Please enter State!"],
    },
    points: {
      type: Number,
      default: 0,
    },

    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Cartproduct",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
