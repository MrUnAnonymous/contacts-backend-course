const express = require("express");
const { register, login, currentUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/current", currentUser);

module.exports = router;