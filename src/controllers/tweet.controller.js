import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    const userId = req.user?._id;

    if (!content || typeof content !== "string" || !content.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }
    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Valid user ID is required to create a tweet");
    }

    const tweet = await Tweet.create({
        content,
        user: userId,
        createdAt: new Date()
    });

    return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"));
    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Valid user ID is required");
    }

    const tweet = await Tweet.find({user: userId});

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const{tweetId} = req.params;
    const{content} = req.body;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "Valid tweet ID is required");
    }
    if (!content || typeof content !== "string" || !content.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate({
        tweetId,
        {content},
        {new: true, runValidators: true}
    });

    if(!updatedTweet){
        throw new ApiError(404, "Tweet not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
    
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;
    const userId = req.user._id;

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Valid user ID is required");
    }

    //Find whether tweet exists for that user or not
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(400, "Tweet not found");
    }

    // check if the tweet belongs to the logged-in user
    if(tweet.owner.toString() !== userId.toString()){
        return new ApiResponse(200, "You can delete only your own tweets");
    }

    //Delete it
    await tweet.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Tweet deleted successfully."
    });
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
