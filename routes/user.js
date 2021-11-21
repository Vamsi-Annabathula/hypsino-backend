const express = require("express");

const router = express.Router();

const {
  getUserById,
  getUser,
  getAllDealers,
  getAllUsers,
  recharge
} = require("../controllers/user");

router.param("userId", getUserById);



router.get("/user/:userId", getUser);

router.put("/user/recharge/:userId", recharge);

router.get("/dealers", getAllDealers);
router.get("/users", getAllUsers);

module.exports = router;
