const express = require("express");

const router = express.Router();

const {
  getUserById,
  getUser,
  getAllDealers,
  getAllUsers,
  updateUser,
  recharge
} = require("../controllers/user");

router.param("userId", getUserById);

router.get("/user/:userId", getUser);
router.put("/editUser/:userId", updateUser);

router.put("/user/recharge/:userId", recharge);

router.get("/dealers", getAllDealers);
router.get("/users", getAllUsers);

module.exports = router;
