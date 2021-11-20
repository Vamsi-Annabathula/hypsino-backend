const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const {
  signup,
  test,
  updateUser,
  signin,
  signout,
} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");


router.param("userId", getUserById);


router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name should be atleast 3 characters"),
    check("email").isEmail().withMessage("Enter a valid E-Mail"),
  ],
  signup
);
router.get("/", test);

router.put("/editUser/:userId", updateUser);

// router.post(
//   "/signin",
//   [
//     check("email").isEmail().withMessage("Enter a valid E-Mail"),
//     check("password")
//       .isLength({ min: 1 })
//       .withMessage("Password cannot be empty"),
//   ],
//   signin
// );

// router.get("/signout", signout);

module.exports = router;
