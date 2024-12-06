/**
 * This is for Contain function layer for contractor service.
 * @author Manthan Vaghasiya
 *
 */

const ObjectId = require("mongodb").ObjectID;
const dbService = require("../../utilities/dbService");
const nodemailer = require("nodemailer");
const messages = require("../../utilities/messages");
const universal = require("../../utilities/universal");
const path = require("path");

/*************************** addContractor ***************************/
const productAdd = async (req) => {
  try {
    const parsedBody = {
      ...req.body,
      framecolor: JSON.parse(req.body.framecolor || "[]"),
      framesize: JSON.parse(req.body.framesize || "[]"),
      category: JSON.parse(req.body.category || "[]"),
      productdetail: JSON.parse(req.body.productdetail || "[]"),
      tipsList: JSON.parse(req.body.tipsList || "[]"),
      frameFields: JSON.parse(req.body.frameFields || "[]"),
    };

    const colorImages = {};
    if (req.files) {
      for (const fieldName in req.files) {
        const colorMatch = fieldName.match(/colorImages\[(.+)\]\[\]/);
        if (colorMatch) {
          const color = colorMatch[1];
          colorImages[color] = req.files[fieldName].map((file) => file.filename);
        }
      }
    }

    let sanitizedPrice = req.body.price;
    if (typeof sanitizedPrice === "string") {
      try {
        sanitizedPrice = JSON.parse(sanitizedPrice);
      } catch (e) {
        throw new Error("Invalid price format");
      }
    }

    const priceArray = Object.entries(sanitizedPrice).map(([frame, prices]) => ({
      frame,
      designPrice: prices["Design Price"] || "",
      withFrame: prices.withFrame || "",
    }));

    // console.log("sanitizedPrice", priceArray);

    const productData = {
      ...parsedBody,
      colorImages,
      price: priceArray,
      createdAt: new Date(),
    };

    // console.log("Final Product Data:", productData);

    const newProduct = await dbService.createOneRecord("productModel", productData);
    // console.log("newProduct", newProduct);
    if (newProduct) {
      return {
        message: "product add sucessfuly!"
      };
    }
    else {
      return {
        message: "product not added!"
      }
    }

  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to process product data");
  }
};

/*************************** productList ***************************/
const productList = async (req) => {
  const where = {
    isDeleted: false
  }

  const productData = await dbService.findAllRecords("productModel", where);
  if (productData) {
    return {
      message: "product data fach sucessfuly",
      ProductData: productData
    }
  }
}

/*************************** sendOtp ***************************/
const sendOtp = async (req) => {
  const { email } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000);

  const existingOtp = await dbService.findOneRecord("otpModel", { email });

  if (existingOtp) {
    const timeDifference = Date.now() - existingOtp.createdAt.getTime();
    if (timeDifference < 2 * 60 * 1000) {
      return {
        status: "fail",
        message: "OTP already sent. Please wait before requesting a new OTP.",
      };
    }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vaghasiyamanthan5@gmail.com",
      pass: "kbxedryninlmaxpl",
    },
  });

  const mailOptions = {
    from: "vaghasiyamanthan5@gmail.com",
    to: email,
    subject: "Your OTP for Email Verification",
    text: `Your OTP is ${otp}. Please use this OTP to verify your email.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP sent: ", info.response);

    const otpData = {
      email: email,
      otp: otp.toString(),
      createdAt: new Date(),
    };

    const otpdataAdd = await dbService.createOneRecord("otpModel", otpData);

    if (otpdataAdd) {
      return {
        message: 'OTP sent successfully',
        statusCode: 200
      };
    }
    else {
      return {
        message: 'Failed to send OTP',
        statusCode: 500
      }

    }

  } catch (error) {
    console.error("Error sending OTP: ", error);
    return {
      status: "fail",
      message: "Failed to send OTP. Please try again later.",
    };
  }
};

/*************************** deleteotp ***************************/
const deleteotp = async (req) => {
  const currentTime = new Date();
  const timeLimit = currentTime.getTime() - 2 * 60 * 1000; // Subtract 2 minutes from the current time

  // Deleting OTP records that are older than 2 minutes
  const deleterecord = await dbService.deleteManyRecords('otpModel', {
    createdAt: { $lt: new Date(timeLimit) },
  });

  // Optional: Log or return the result to indicate how many records were deleted
  if (deleterecord.deletedCount > 0) {
    console.log(`${deleterecord.deletedCount} OTP records deleted.`);
  } else {
    console.log('No OTP records found to delete.');
  }
};

/*************************** otpVerify ***************************/
const otpVerify = async (req) => {
  const { email, otp } = req.body;

  try {
    const where = { email: email, otp: otp };

    const getData = await dbService.findOneRecord("otpModel", where);

    if (getData) {
      return {
        message: "Success",
        statusCode: 200
      };
    } else {
      return {
        message: "Incorrect OTP",
        statusCode: 400
      };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      message: "Internal Server Error",
      statusCode: 500
    };
  }
}

/*************************** otpVerify And CreateUser ***************************/
const addToCardOverify = async (req, uploadedImages) => {
  try {
    const { email, price, productId, selectedColor, selectedSize, frameDetails, includeFrame } = req.body;
    // console.log("addToCardOverify Request Body:", req.body);

    const imageFileNames = [];
    if (req.files) {
      for (const color in req.files) {
        const files = req.files[color];
        files.forEach((file) => {
          imageFileNames.push(file.filename);
        });
      }
    }
    // console.log("req.files",req.files)

    // console.log("Uploaded Image Filenames:", imageFileNames);

    if (email) {
      const FindUserData = await dbService.findOneRecord("userModel", { email });
      console.log("User Data:", FindUserData);

      if (FindUserData) {
        // Agar user pehle se hai toh cart mein data add karo
        const AddtocardData = {
          price,
          productId,
          selectedColor,
          selectedSize,
          frameDetails,
          includeFrame,
          photos: imageFileNames,
          email,
          userid: FindUserData._id
        };

        // console.log("AddToCart Data:", AddtocardData);
        const result = await dbService.createOneRecord("cartModel", AddtocardData);

        if (result) {
          const FindUserData = await dbService.findOneRecord("userModel", { email });
          const token = FindUserData.loginToken[0].token;
          return {
            messages: "user create",
            token: token,
            email: email
          }
        }

      } else {
        const addUser = await dbService.createOneRecord("userModel", { email });

        if (addUser) {
          const firstThreeEmailChars = email.split('@')[0].slice(0, 3);
          const tokenString = `${firstThreeEmailChars}2024`;

          const token = await universal.generateJwtTokenFn({ userId: addUser._id, token: addUser._id });

          const encryptedPassword = await universal.encryptpassword(tokenString);

          const updatedUser = await dbService.updateManyRecords("userModel", { _id: addUser._id }, {
            $push: { loginToken: { token } },
            password: encryptedPassword
          });


          const AddtocardData = {
            price,
            productId,
            selectedColor,
            selectedSize,
            frameDetails,
            includeFrame,
            photos: imageFileNames,
            email,
            userid: addUser._id
          };

          // console.log("AddtocardData",AddtocardData);

          const result = await dbService.createOneRecord("cartModel", AddtocardData);
          // console.log("AddtocardData result",result);


          if (result) {
            const FindUserData = await dbService.findOneRecord("userModel", { email });
            const token = FindUserData.loginToken[0].token;
            console.log("FindUserData", FindUserData);
            return {
              messages: "user create",
              token: token,
              email: email
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in addToCardOverify function:", error);
    throw new Error('Error in Add to Cart Overify function');
  }
};

/*************************** cartList ***************************/
const cartList = async (req) => {
  const { token } = req.body;

  try {
    const decodedToken = await universal.decodeDirectJwtTokenFn(token);

    if (!decodedToken || !decodedToken.userId) {
      throw new Error("Invalid token or missing userId");
    }

    const where = {
      userid: decodedToken.userId,
    };

    // Fetch product and cart data
    const productData = await dbService.findAllRecords("productModel", {});
    const cartData = await dbService.findAllRecords("cartModel", where);

    // Map and merge cartData with productData
    const mergedCartData = cartData.map((cartItem) => {
      const product = productData.find(
        (prod) => prod._id.toString() === cartItem.productId
      );

      if (!product) {
        return cartItem; // Return cart item as is if product not found
      }

      // Extract required price details based on selected size
      const selectedPrice = product.price.find(
        (priceObj) => priceObj.frame === cartItem.selectedSize
      );

      // Return merged data
      return {
        cartid: cartItem._id,
        email: cartItem.email,
        userid: cartItem.userid,
        productId: cartItem.productId,
        selectedColor: cartItem.selectedColor,
        selectedSize: cartItem.selectedSize,
        frameDetails: cartItem.frameDetails,
        photos: cartItem.photos,
        createdAt: cartItem.createdAt,
        updatedAt: cartItem.updatedAt,
        productTitle: product.productTitle,
        shortTitle: product.shortTitle,
        selectedColorImage: product.colorImages.get(cartItem.selectedColor),
        priceDetails: selectedPrice || {},
      };

    });

    // console.log("mergedCartData", mergedCartData);

    if (mergedCartData.length > 0) {
      return {
        message: "Cart data fetched successfully",
        cartData: mergedCartData,
      };
    } else {
      return {
        message: "No cart data found",
        cartData: [],
      };
    }
  } catch (error) {
    console.error("Error in cartList:", error.message);
    return {
      message: error.message,
      type: "ERROR",
    };
  }
};

/*************************** removeCartIteam ***************************/
const removeCartIteam = async (req) => {
  try {
    const { productId, color, size, cartid } = req.body;

    const where = {
      productId: productId,
      selectedColor: color,
      selectedSize: size,
      _id: cartid
    };

    // Deleting the item(s) from the database
    const deletedData = await dbService.deleteManyRecords("cartModel", where);

    // Check if any documents were deleted
    if (deletedData && deletedData.deletedCount > 0) {
      return {
        message: "Item deleted successfully!",
      };
    } else {
      return {
        message: "No item found to delete.",
      };
    }

  } catch (error) {
    console.error("Error in removeCartItem:", error.message);
    return {
      message: error.message,
      type: "ERROR",
    };
  }
};

/*************************** chnageImgCartItem ***************************/
const chnageImgCartItem = async (req) => {
  const { color, productId, size, selectedImageIndex, cartid } = req.body;
  const imageFileNames = [];

  // Get the uploaded image filenames from req.files
  if (req.files) {
    for (const colorKey in req.files) {
      const files = req.files[colorKey];
      files.forEach((file) => {
        imageFileNames.push(file.filename);
      });
    }
  }


  try {
    // Define the search criteria for finding the cart item
    const where = {
      selectedColor: color,
      productId: productId,
      selectedSize: size,
      _id: cartid,
    };

    // Find the existing cart item
    const updaterecorddataget = await dbService.findOneRecord("cartModel", where);
    // console.log("updaterecorddataget", updaterecorddataget);

    if (!updaterecorddataget) {
      return {
        message: "Cart item not found",
        type: "ERROR",
      };
    }

    // Get the current photos array
    let updatedPhotos = updaterecorddataget.photos;

    // Convert selectedImageIndex to integer and validate it
    const imageIndex = parseInt(selectedImageIndex, 10);
    if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= updatedPhotos.length) {
      return {
        message: "Invalid selectedImageIndex",
        type: "ERROR",
      };
    }

    // Update the image at the selected index with the new filename
    updatedPhotos[imageIndex] = imageFileNames[0]; // Assuming only one file uploaded

    // Update the record in the database
    const updateData = {
      photos: updatedPhotos,
    };

    // Use your updateMany or updateOne function to update the database record
    const updatedRecord = await dbService.updateManyRecords("cartModel",
      { _id: cartid },  // Find the correct cart item
      { $set: updateData },  // Update the photos array
    );

    // console.log("updatedRecord",updatedRecord);

    if (updatedRecord.modifiedCount > 0) {
      console.log("Cart item updated successfully.");
      return {
        message: "Cart item updated successfully",
        type: "SUCCESS",
      };
    } else {
      return {
        message: "Failed to update cart item",
        type: "ERROR",
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      message: error.message,
      type: "ERROR",
    };
  }
};

/*************************** chnageImgCartItem ***************************/
const order = async (req, res) => {
  const {
    token,
    country,
    state,
    firstName,
    lastName,
    addressLine1,
    addressLine2,
    city,
    postcode,
  } = req.body;

  // console.log("Order request body:", req.body);

  try {
    // Decode the token
    const decodedToken = await universal.decodeDirectJwtTokenFn(token);
    // console.log("decodedToken", decodedToken);
    if (!decodedToken || !decodedToken.userId) {
      throw new Error("Invalid token or missing userId");
    }

    const userId = decodedToken.userId;

    // Fetch cart and product data
    const cartData = await dbService.findAllRecords("cartModel", { userid: userId });
    const productData = await dbService.findAllRecords("productModel", {});

    if (!cartData || cartData.length === 0) {
      throw new Error("No cart data found for the user");
    }

    // Extract required cart data
    const {
      photos: userPhoto,
      frameDetails,
      selectedColor,
      productId,
      includeFrame,
      selectedSize,
    } = cartData[0];

    // Find the matching product
    const product = productData.find(
      (prod) => prod._id.toString() === productId.toString()
    );

    if (!product) {
      // console.error("No matching product found. ProductId:", productId);
      // console.error("Available Products:", productData.map((prod) => prod._id.toString()));
      throw new Error("No matching product found for the provided productId");
    }

    // Find the matching price based on selectedSize and includeFrame
    const matchingPrice = product.price.find(
      (priceObj) =>
        priceObj.frame === selectedSize &&
        (includeFrame ? priceObj.withFrame : priceObj.designPrice)
    );

    if (!matchingPrice) {
      throw new Error("No matching price found for the selected size and frame option");
    }

    // Prepare orderData
    const orderData = {
      userPhoto,
      userId,
      frameDetails,
      selectedColor,
      selectedSize,
      productId,
      includeFrame,
      price: includeFrame ? matchingPrice.withFrame : matchingPrice.designPrice,
      country,
      state,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      postcode,
      posterSend: 0,
      OrderSucess: 0,
      posterImage: "",
      trackingid: "",
    };


    const savedOrder = await dbService.createOneRecord("orderModel", orderData);

    if (savedOrder) {
      const decodedToken = await universal.decodeDirectJwtTokenFn(token);
      const userId = decodedToken.userId;
      const cartDatadelete = await dbService.deleteManyRecords("cartModel", { userid: userId });
      if (cartDatadelete) {
        return {
          message: "Order placed successfully",
        };
      }
      else {
        console.error("Error in order service:", error.message);
        throw new Error(error.message);
      }
    }
  } catch (error) {
    console.error("Error in order service:", error.message);
    throw new Error(error.message);
  }
};

/*************************** getAllOrderList ***************************/
const getAllOrderList = async (req) => {
  try {
    const orderdata = await dbService.findAllRecords("orderModel", {});
    const productData = await dbService.findAllRecords("productModel", {});

    // Transform orderdata
    const enrichedOrderData = orderdata.map(order => {
      const product = productData.find(
        prod => prod._id.toString() === order.productId.toString()
      );

      if (product) {
        const colorImageArray = product.colorImages.get(order.selectedColor);
        return {
          ...order._doc, // Only include the raw document of the order
          selectedColor: order.selectedColor,
          colorImage: colorImageArray ? colorImageArray[0] : null, // Get the first image or null
        };
      }

      // If no matching product is found
      return { ...order._doc, selectedColor: order.selectedColor, colorImage: null };
    });

    // Return the transformed order data
    return {
      message: "Order data fetched successfully",
      orderdata: enrichedOrderData,
    };
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw new Error("Failed to fetch order data");
  }
};

/*************************** sendPosterWithEmail ***************************/
const sendPosterWithEmail = async (req, res) => {
  try {
    const id = req.body.id;
    const posterImage = req.file.filename;

    const getOrderRecord = await dbService.findOneRecord("orderModel", { _id: id });

    if (!getOrderRecord) {
      return { message: "Order not found" };
    }

    const updatedRecord = await dbService.updateManyRecords(
      "orderModel",
      { _id: id },
      {
        $set: {
          posterSend: "1",
          posterImage: posterImage,
        },
      }
    );

    return {
      message: "Poster sent successfully",
      updatedRecord,
    };
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw new Error("Failed to fetch order data");
  }
};

/*************************** adminOrderCreate ***************************/
const adminOrderCreate = async (req) => { 
  try {
    const id = req.body.productid;
    const getOrderRecord = await dbService.findOneRecord("orderModel", { _id: id });
    console.log("getOrderRecord", getOrderRecord);
    const getUserData = await dbService.findOneRecord("userModel", { _id: getOrderRecord.userId });
    console.log("getOrderRecord", getUserData);

    if (!getOrderRecord) {
      return { message: "Order not found" };
    }

    const uploadPath = path.join(__dirname, "../../images");
    const posterImagePath = path.join(uploadPath, getOrderRecord.posterImage);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vaghasiyamanthan5@gmail.com",
        pass: "kbxedryninlmaxpl",
      },
    });

    const mailOptions = {
      from: "vaghasiyamanthan5@gmail.com",
      to: getUserData.email,
      subject: "Your Order Tracking Details",
      text: `Dear ${getUserData.email},\n\nYour order has been updated with the following details:\n\nTracking ID: ${req.body.trackingid}\n\nPlease find the attached poster image.`,
      attachments: [
        {
          filename: req.file.filename,
          path: posterImagePath,
        },
      ],
    };

    // Send the email
    const emailsend = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", getUserData.email);

    if (emailsend) {
      const updatedRecord = await dbService.updateManyRecords(
        "orderModel",
        { _id: id },
        {
          $set: {
            trackingid: req.body.trackingid,
          },
        }
      );

      if (updatedRecord) {
        return {
          message: "Create Order successfully",
        };
      }
      else {
        console.error("Error Create Order:", error);
        throw new Error("Failed to Create Order");
      }
    }
    else{
      console.error("email send :", error);
    }

  } catch (error) {
    console.error("Error Create Order:", error);
    throw new Error("Failed to Create Order");
  }
}

/*************************** adminOrderComplete ***************************/
const adminOrderComplete = async (req) => {
  try {
    const id = req.body.productid;
    const getOrderRecord = await dbService.findOneRecord("orderModel", { _id: id });

    if (!getOrderRecord) {
      return { message: "Order not found" };
    }

    const updatedRecord = await dbService.updateManyRecords(
      "orderModel",
      { _id: id },
      {
        $set: {
          OrderSucess: 1,
        },
      }
    );

    if (updatedRecord) {
      return {
        message: "complete Order successfully",
        updatedRecord,
      };
    }
    else {
      console.error("Error complete Order:", error);
      throw new Error("Failed to complete Order");
    }
  } catch (error) {
    console.error("Error complete Order:", error);
    throw new Error("Failed to complete Order");
  }
}

/*************************** adminOrderComplete ***************************/
const addCategory = async (req) => {
  try {
    const { category } = req.body;
    const image = req.file ? req.file.filename : null;  

    if (!category || !image) {
      throw new Error("Category name and image are required.");
    }

    const data = {
      category: category,
      image: image
    };

    const addCategoryResult = await dbService.createOneRecord("categoryModel", data);

    if (addCategoryResult) {
      return {
        message: "Category added successfully!"
      };
    } else {
      throw new Error("Failed to add category.");
    }
  } catch (error) {
    console.error("Error in addCategory:", error);
    return {
      message: error.message || "An error occurred while adding the category."
    };
  }
};

/*************************** getCategory ***************************/
const getCategory = async (req) => {
  let where = {
    isDeleted: false,
  };

  try {
    let data = await dbService.findAllRecords("categoryModel", {});

    if (data && data.length > 0) {
      return {
        success: true,
        data: data,
        message: "Category data fetched successfully!",
      };
    } else {
      return {
        success: false,
        message: "No categories found or all categories are deleted.",
      };
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message: "Error fetching categories",
      error: error.message,
    };
  }
};

/*************************** categoryDelete ***************************/
const categoryDelete = async (req, res) => {
  try {
    console.log("categoryDelete", req.body);

    let { categoryId } = req.body;

    // Ensure that categoryId is provided
    if (!categoryId) {
      return {
        messages: "Category ID is required",
      };
    }

    let deleteData = await dbService.deleteManyRecords("categoryModel", {
      _id: categoryId,
    });

    if (deleteData.deletedCount === 0) {
      return {
        messages: "Category not found",
      };
    }

    return {
      messages: "Category deleted successfully",
    };
  } catch (error) {
    return {
      messages: "An error occurred while deleting the category",
    };
  }
};

/*************************** updateCategory ***************************/
const updateCategory = async (req) => {
  console.log(req.body);
  const { categoryName, categoryId } = req.body;

  if (!categoryId) {
    return { message: "Category ID is required" };
  }

  try {
    // Find the category by ID
    const category = await dbService.findOneRecord("categoryModel", { _id: categoryId });
    if (!category) {
      return { message: "Category not found" };
    }

    // Handle the image (if provided)
    const image = req.file ? req.file.filename : null;

    // Update data with categoryName and image (if new image is uploaded)
    const updateData = {
      categoryName,
      image
    };

    // Perform the update operation
    const updatedCategory = await dbService.findOneAndUpdateRecord(
      "categoryModel",
      { _id: categoryId },
      updateData,
      { new: true }
    );

    console.log("Updated category:", updatedCategory);

    if (updatedCategory) {
      return { message: "Category updated successfully" };
    } else {
      return { message: "Category update failed" };
    }
  } catch (error) {
    console.error("Error updating category:", error);
    return { message: "An error occurred while updating the category" };
  }
};



module.exports = {
  updateCategory,
  categoryDelete,
  getCategory,
  addCategory,
  adminOrderCreate,
  sendPosterWithEmail,
  order,
  removeCartIteam,
  chnageImgCartItem,
  productAdd,
  productList,
  sendOtp,
  deleteotp,
  otpVerify,
  addToCardOverify,
  cartList,
  getAllOrderList,
  adminOrderComplete
};
