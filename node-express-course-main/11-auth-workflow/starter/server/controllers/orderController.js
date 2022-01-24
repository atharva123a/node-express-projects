const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Order = require("../models/Orders");
const Product = require("../models/Product");

const { checkPermission } = require("../utils");

// return client secret:
const fakeStripeAPI = async ({ amount, currency }) => {
  // we pass in a real one if we use our actual stripe api!
  const client_secret = "SomeRandomValue";
  return { amount, client_secret };
};

const createOrder = async (req, res) => {
  const { items: shippingItems, tax, shippingFee } = req.body;

  if (!shippingItems || shippingItems.length < 1) {
    throw new CustomError.BadRequestError("No items in the cart");
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fees"
    );
  }

  let subtotal = 0;
  let orderItems = [];

  // for every item inside our shippingItems:
  for (const item of shippingItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product found with id : ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;
    const amount = item.amount;

    const singleOrderItem = {
      amount,
      name,
      price,
      image,
      product: _id,
    };
    // add items to order array:
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal:
    subtotal += amount * price;
  }
  // calculate total:
  const total = tax + shippingFee + subtotal;

  // get client secret:
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    user: req.user.userId,
    clientSecret: paymentIntent.client_secret,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, client_secret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findOne({ _id: orderId });
  console.log("HIHI");
  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id : ${orderId}`);
  }
  checkPermission(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const userId = req.user.userId;

  const orders = await Order.find({ user: userId });

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  let {
    params: { id: orderId },
    body: { paymentIntentId },
  } = req;

  let order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id : #{orderId}`);
  }

  checkPermission(req.user, order.user);

  order.status = "paid";
  order.paymentIntentId = paymentIntentId;

  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
