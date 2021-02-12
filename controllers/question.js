const Question = require("../models/Question")
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");


const askNewQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const information = req.body;

    const question = await Question.create({
        ...information,
        user: req.user.id
    });
    res.status(200)
    .json({
        success:true,
        data:question
    })
})
const getAllQuestions = asyncErrorWrapper(async (req,res,next)=>{
    res.status(200)
    .json(res.queryResults);
})
const getSingleQuestion = asyncErrorWrapper(async (req,res,next)=>{
    res.status(200)
    .json(res.queryResults)
})
const editQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const {id} = req.params;
    const {title,content} = req.body;
    let question = await Question.findById(id)

    question.title = title;
    question.content = content;

    question = await question.save()

    return res.status(200)
    .json({
        success:true,
        data:question
    })
})
const deleteQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const {id} = req.params;
    await Question.findByIdAndDelete(id)

    return res.status(200)
    .json({
        success:true,
        message:"Question deleted"
    })
})
const likeQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const {id} = req.params;
    const question = await Question.findById(id)

    if(question.likes.includes(req.user.id)){
        return next(new CustomError("Already liked",400))
    }

    question.likes.push(req.user.id);
    question.likeCount = question.likes.length;
    await question.save();

    return res.status(200)
    .json({
        success:true,
        data: question
    })
})
const undolikeQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const {id} = req.params;
    const question = await Question.findById(id)

    if(!question.likes.includes(req.user.id)){
        return next(new CustomError("YOu can't unlike, didn't liked before",400))
    }

    const index = question.likes.indexOf(req.user.id);
    question.likes.splice(index,1)
    question.likeCount = question.likes.length;

    await question.save();

    return res.status(200)
    .json({
        success:true,
        data: question
    })
})



module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undolikeQuestion
};