/*
 * @file: index.js
 * @description: It's combine all contractor routers.
 * @author: Manthan Vaghasiya
 */

const productAdd = require("./productAdd");
const productList = require("./productList");
const sendOtp = require("./sendOtp");
const otpVerify = require("./otpVerify");
const addToCardOverify = require("./addToCardOverify");
const cartList = require("./cartList");
const removeCartIteam = require("./removeCartIteam");
const chnageImgCartItem = require("./chnageImgCartItem");
const order = require("./order");
const getAllOrderList = require("./getAllOrderList");
const sendPosterWithEmail = require("./sendPosterWithEmail");
const adminOrderCreate = require("./adminOrderCreate");
const adminOrderComplete = require("./adminOrderComplete");

module.exports = [
    productAdd,
    sendOtp,
    productList,
    otpVerify,
    addToCardOverify,
    cartList,
    removeCartIteam,
    chnageImgCartItem,
    order,
    getAllOrderList,
    sendPosterWithEmail,
    adminOrderCreate,
    adminOrderComplete
];
