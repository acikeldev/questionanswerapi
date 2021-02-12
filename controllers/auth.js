const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const {sendJwtToClient}  = require("../helpers/authorization/tokenHelpers")
const {validateUserInput,comparePassword} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail"); 

const register = asyncErrorWrapper(async (req,res,next)=>{
    const {name,email,password,role} = req.body;
    
    const user = await User.create({
         name,
         email,
         password,
         role
     });
     sendJwtToClient(user,res);
});

const login = asyncErrorWrapper(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!validateUserInput(email,password)){
        return next(new CustomError("Please check your inputs",400))
    }
    //getting user data from schema with given email
    // select +password mean we'll can see the password with hash style
    const user = await User.findOne({email}).select("+password");
    //password check process
    if(!comparePassword(password,user.password)){
        return next(new CustomError("Please check your credentials",400));
    }

    //create token and add to the cookie and return some data
    sendJwtToClient(user,res);
});
const logout = asyncErrorWrapper(async (req,res,next)=>{
    const {NODE_ENV} = process.env;

    res.status(200)
    .cookie({
        httpOnly:true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development"?false:true
    })
    .json({      
        success:true,
        message:"Logout successful"
    });

});
const getUser =(req,res,next)=>{
    res.json({
        success:true,
        data : req.user
    })
}
const imageUpload = asyncErrorWrapper(async (req,res,next)=>{
    
    const user = await User.findByIdAndUpdate(req.user.id,{
        "profile_image":req.savedProfileImage
    },{
        new:true,
        runValidators:true
    })
    res.status(200)
    .json({
        success:true,
        message:"Image upload successful",
        data:user
    })
})

const forgotPassword = asyncErrorWrapper(async (req,res,next)=>{
    const resetEmail =  req.body.email;
    const user = await User.findOne({email:resetEmail});
    
    if(!user){
        return next(new CustomError("There is no user with that email"),400)
    }
    
    user.getResetPasswordTokenFromUser();
    const resetPasswordToken = user.resetPasswordToken
    console.log(resetPasswordToken)
    await user.save();
    

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This <a href = '${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour</p>
    `;

    try{
        
        await sendEmail({
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : "Reset Your Passwod",
            html : emailTemplate
        });
        return res.status(200)
        .json({
            success:true,
            message:"Token sent to your email"
        })
    }
    catch(err){
        user.resetPasswordToken =  undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(CustomError("Email could not be sent"),500)
    }



});
const resetPassword =  asyncErrorWrapper(async (req,res,next)=>{
    const{resetPasswordToken} = req.query;
    const {password} = req.body;
    
    if(!resetPasswordToken){
        return new CustomError("Token error",400)
    }
    if(!password){
        return new CustomError("There is no password",400)
    }

    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    });

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    
    return res.status(200)
    .json({
        success:true,
        message: "Reset password process success."
    })
})
module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword
};