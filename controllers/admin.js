const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const blockUser =  asyncErrorWrapper(async (req,res,next)=>{
    const {id}  = req.params;

    const user = await User.findById(id);

    user.blocked = !user.blocked;
    let status = (user.blocked === true)?"blocked":"not blocked"

    await user.save();
    return res.status(200)
    .json({
        success:true,
        message:user.name+" "+"block status: "+ status
    })
});
const deleteUser = asyncErrorWrapper(async (req,res,next)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    await user.remove();

    return res.status(200)
    .json({
        success:true,
        messsage:"Delete operation successful"
    })
}) 

module.exports = {
    blockUser,
    deleteUser
}