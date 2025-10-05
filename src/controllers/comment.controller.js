import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    if(!req.user){
         throw new ApiError(401, "Log in first")
    }
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comments = await.Comment.find({video: videoId})
    res.json({comments})
})

const addComment = asyncHandler(async (req, res) => {
    if(!req.user){
         throw new ApiError(401, "Log in first")
    }
    const {videoId, text} = req.body;

    const newComment = await Comment.create({
        video: videoId,
        text: text,
        user: req.user._id
    });
    res.json({ comment: newComment });
})

const updateComment = asyncHandler(async (req, res) => {
    if(!req.user){
         throw new ApiError(401, "Log in first")
    }
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findOne({
        _id: commentId,
        user: req.user._id
    });
    if(!comment){
        throw new ApiError(400, "Comment not found");
    }

    comment.text = text;
    await comment.save();

    res.json({comment});
})

const deleteComment = asyncHandler(async (req, res) => {
    if(!req.user){
         throw new ApiError(401, "Log in first")
    }
    const { commentId } = req.params;

    const comment = await Comment.findOne({
        _id: commentId,
        user: req.user._id
    });
    if(!comment){
        throw new ApiError(400, "Comment not found");
    }

    await Comment.deleteOne({ _id: commentId });

    res.json({ message: "Comment deleted successfully." });
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
