const express = require("express");
const {getAccessToRoute,getAdminAccess} = require("../middlewares/authorization/auth");
const {blockUser,deleteUser}  = require("../controllers/admin")
const router = express.Router();

router.use([getAccessToRoute,getAdminAccess])

//block user
router.get("/block/:id",blockUser)
router.delete("/user/:id",deleteUser)

module.exports = router;