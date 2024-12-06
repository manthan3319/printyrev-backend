const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const { successAction, failAction } = require("./response");
const Message = require("./messages");
const bcrypt = require("bcryptjs");

const jwtAlgo = process.env.JWT_ALGO;
const jwtKey = process.env.JWT_KEY;

// password encryption.
const encryptpassword = async (password) => {
  // return md5(password);
  const salt = await bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hashSync(password, salt);
  return hashPassword;
};

const decryptPassword = async (password, oldPassword) => {
  const matchPassword = await bcrypt.compare(password, oldPassword);
  return matchPassword;
};

// Generate random strings.
const generateRandom = (length = 32, alphanumeric = true) => {
  let data = "",
    keys = "";

  if (alphanumeric) {
    keys = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  } else {
    keys = "0123456789";
  }

  for (let i = 0; i < length; i++) {
    data += keys.charAt(Math.floor(Math.random() * keys.length));
  }

  return data;
};

/*********** WEB Generate JWT token *************/
const generateJwtTokenFn = async (userIdObj) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      userIdObj,
      jwtKey,
      { algorithm: jwtAlgo, expiresIn: "90d" },
      function (err, encode) {
        if (err) {
          res.status(401).json(failAction(err, 401));
        } else {
          resolve(encode);
        }
      }
    );
  });
};
/*********** Test Decode JWT token *************/
const decodeJwtTokenFn = (req, res, next) => {
  const Authorization =
    req["headers"]["Authorization"] || req["headers"]["authorization"];

  jwt.verify(Authorization, jwtKey, function (err, decoded) {
    if (err) {
      return res.status(401).json(failAction("Authorization not found!", 401));
    } else {
      req.user = {
        userId: decoded.userId,
        _id: decoded.userId,
      };

      next();
    }
  });
};


/*********** Direact token PASS*************/

const decodeDirectJwtTokenFn = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        reject(new Error("Authorization not found!"));
      } else {
        resolve({
          userId: decoded.userId,
          _id: decoded.userId,
        });
      }
    });
  });
};

module.exports = {
  encryptpassword,
  decryptPassword,
  generateRandom,
  generateJwtTokenFn,
  decodeJwtTokenFn,
  decodeDirectJwtTokenFn
};
