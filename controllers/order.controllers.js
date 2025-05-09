import Order from '../Models/Orders.model.js';
import asyncHandler from '../utils/asyncHandler.utils.js';




export const AddToCart = asyncHandler(async (req, res, next) => {
    const { productName, price, quantity } = req.body;
    const user = req.user._id;

    // Create the order with "Cart" status
    await Order.create({
        user,
        productName,
        price,
        Status: "Cart",
        quantity
    });

    res.status(201).json({
        success: true,
        message: "Order added to cart"
    });
});

// Optimized CreateOrder Function
export const CreateOrder = asyncHandler(async (req, res, next) => {
    const user = req.user._id;

    // Find all cart orders
    const orders = await Order.find({ user, Status: "Cart" });

    if (!orders.length) {
        return res.status(400).json({
            success: false,
            message: "No items in the cart to place an order"
        });
    }

    // Use bulk operations to efficiently update statuses
    await Order.updateMany(
        { user, Status: "Cart" },
        { $set: { Status: "Pending" } }
    );

    res.status(201).json({
        success: true,
        message: "Order placed successfully"
    });
});


export const ShipOrder = asyncHandler(async (req, res, next) => {
    const user = req.user._id;

    // Find all cart orders
    const orders = await Order.find({ user, Status: "Pending" });

    if (!orders.length) {
        return res.status(400).json({
            success: false,
            message: "No items in the cart to place an order"
        });
    }

    // Use bulk operations to efficiently update statuses
    await Order.updateMany(
        { user, Status: "Pending" },
        { $set: { Status: "Shipped" } }
    );

    res.status(201).json({
        success: true,
        message: "Order placed successfully"
    });
});
export const DeliveredOrder = asyncHandler(async (req, res, next) => {
    const user = req.user._id;
    
    // Find all cart orders
    const orders = await Order.find({ user, Status: "Shipped" });

    if (!orders.length) {
        return res.status(400).json({
            success: false,
            message: "No items in the cart to place an order"
        });
    }

    // Use bulk operations to efficiently update statuses
    await Order.updateMany(
        { user, Status: "Shipped" },
        { $set: { Status: "Delivered" } }
    );

    res.status(201).json({
        success: true,
        message: "Order placed successfully"
    });
});

export const CancelOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.body; // Use descriptive variable name

    if (!orderId) {
        return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { Status: "Cancelled" },
        { new: true }
    );

    if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        order: updatedOrder
    });
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user._id;
        const orders = await Order.find({user});

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        next(error); // Pass error to global error handler middleware
    }
});

export const getOrders = asyncHandler(async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        next(error); // Properly passes error to the global error-handling middleware
    }
});