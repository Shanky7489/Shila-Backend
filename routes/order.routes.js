import express from "express";
import isAuthenticated from "../middlewares/auth.js";
import { AddToCart, CreateOrder, ShipOrder, DeliveredOrder, CancelOrder, getAllOrders, getOrders } from "../controllers/order.controllers.js";
import isAdmin from "../middlewares/isAdmin.js"



const router = express.Router();


// order routes

router.route("/add-to-cart").post(isAuthenticated, AddToCart) // to add ordre to cart
router.route("/create-order").put(isAuthenticated, CreateOrder) // to make an order
router.route("/ship-order").put(isAuthenticated, ShipOrder) // to ship an order
router.route("/deliverd-order").put(isAuthenticated, DeliveredOrder)// to deliver an order
router.route("/cancel-order").put(isAuthenticated, CancelOrder) // to cancel an order
router.route("/getmyorders").get(isAuthenticated, getOrders) // to get all orders of user
// admin routes

router.route("/getallorders").get(isAuthenticated, isAdmin, getAllOrders)




export default router;