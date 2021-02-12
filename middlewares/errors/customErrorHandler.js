const CustomError = require("../../helpers/error/CustomError")
//Error Middleware

const customErrorHandler = (err,req,res,next)=>{
    console.log(err)
    let customError = err;

    
    if(err.name === "Syntax Error"){
        customError = new CustomError("Unexpected Syntax",400);
    }
    if(err.name === "ValidationError"){
        customError = new CustomError(err.message,400);
    }
    if(err.code === 11000){
        //Duplicate Key Error
        customError = new CustomError("Duplicate key found!",400)
    }
    if(err.name === "CastError"){
        customError = new CustomError("Please provide a n valid id",400)
    }
    res
    .status(customError.status || 500)
    .json({
        success:false,
        message:customError.message
    })
}


module.exports = customErrorHandler