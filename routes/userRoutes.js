const express = require("express");
const { register, login, currentUser } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/current",currentUser, validateToken );

module.exports = router;