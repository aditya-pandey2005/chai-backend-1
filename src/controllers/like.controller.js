import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const user = req.user;
    if(!user || !user._id){
        throw new ApiError(401, "User not authorized");
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError("Invalid video ID");
    }

    const existingLike = await Like.findOne({
        user: user._id,
        video: videoId
    });

    if(existingLike){
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new ApiResponse(200, {}, "Video like removed"));
    }
    else{
        const newLike = await Like.create({
            user: user._id,
            video: videoId
        });
        return res.status(201).json(new ApiResponse(201, newLike, "Video liked"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    const user = req.user;
    if (!user || !user._id) {
        throw new ApiError(401, "User not authorized");
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await mongoose.model("Comment").findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({
        user: user._id,
        comment: commentId
    });

    if(exisitngLike){
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new ApiResponse(200, {}, "Comment like removed"));
    }
    else{
        const newLike = await Like.create({
            user: user._id,
            comment: commentId
        });
        return res.status(201).json(new ApiResponse(201, newLike, "Comment liked"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    const user = req.user;
    if (!user || !user._id) {
        throw new ApiError(401, "User not authorized");
    }

    if(!isValidateObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await mongoose.model("Tweet").findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }

    const existingLike = await Like.findOne({
        user: user._id,
        tweet: tweetId
    });

    if(existingLike){
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new ApiResponse(200, {}, "Tweet like removed"));
    }
    else{
        const newLike = await Like.create({
            user: user._id,
            tweet: tweetId
        });
        return res.status(201).json(new ApiResponse(201, newLike, "Tweet liked"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const user = req.user;
    if (!user || !user._id) {
        throw new ApiError(401, "User not authorized");
    }

    const likedVideos = await Like.find({
        user: user._id, 
        video: {$exists: true}
    }).populate("video");

    const videos = likedVideos.map(like => like.video);
    return res.status(200).json(new ApiResponse(200, videos, "Videos liked by user"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
