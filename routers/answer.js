const express = require("express");
const {getAccessToRoute,getAnswerOwnerAccess} = require("../middlewares/authorization/auth")
const {addNewAnswerToQuestion,getAllAnswersByQuestion,getSingleAnswer,editAnswer,deleteAnswer,likeAnswer,undolikeAnswer} = require("../controllers/answer");
const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers")
const router = express.Router({mergeParams:true});


router.post("/",getAccessToRoute,addNewAnswerToQuestion)
router.get("/",getAllAnswersByQuestion)
router.get("/:answer_id",checkQuestionAndAnswerExist,getSingleAnswer)
router.put("/:answer_id",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],editAnswer)
router.delete("/:answer_id",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],deleteAnswer)
router.get("/:answer_id/like",[checkQuestionAndAnswerExist,getAccessToRoute],likeAnswer)
router.get("/:answer_id/undo_like",[checkQuestionAndAnswerExist,getAccessToRoute],undolikeAnswer)

module.exports = router;