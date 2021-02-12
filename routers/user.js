const express = require("express");
const User = require("../models/User")
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers");
const {getSingleUser,getAllUsers} = require("../controllers/user.js")
const userQueryMiddleware = require("../middlewares/query/userQueryMiddleware")
const router = express.Router();


router.get("/:id",checkUserExist,getSingleUser);
router.get("/",userQueryMiddleware(User),getAllUsers);

module.exports = router;