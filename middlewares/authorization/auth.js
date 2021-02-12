const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers")
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");



const getAccessToRoute = (req,res,next)=>{
    //Token Kontrolü
    const {JWT_SECRET_KEY} = process.env;
    if(!isTokenIncluded(req)){
        return next(
            new CustomError("You are not authorized",401)
        );

    }
    const accessToken = getAccessTokenFromHeader(req);
    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
            
            return next(new CustomError("You are not authorized",401))

        }
        req.user = {
            id : decoded.id,
            name : decoded.name
        }
        console.log(decoded)
        next();
    })
 
    //Custom Error
}
const getAdminAccess = asyncErrorWrapper(async (req,res,next)=>{
    const {id} = req.user;
    const user = await User.findById(id);

    if(user.role !== "admin"){
        return next(new CustomError("Only admins can access this route",403))
    }    
    next();



});
const getQuestionOwnerAccess = asyncErrorWrapper(async (req,res,next)=>{
    const userId = req.user.id;
    const questionId = req.params.id;
    const question = await Question.findById(questionId);


    if(question.user != userId){
        return next(new CustomError("Only owner can access",403));
    };
    next()
});
const getAnswerOwnerAccess = asyncErrorWrapper(async (req,res,next)=>{
    const userId = req.user.id;
    const answerId = req.params.answer_id;

    const answer = await Answer.findById(answerId);


    if(answer.user != userId){
        return next(new CustomError("Only owner can access",403));
    };
    next()
});
module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}