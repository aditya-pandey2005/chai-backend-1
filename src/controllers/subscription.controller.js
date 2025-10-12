import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId = req.user?._id;

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Valid channel ID is required");
    }
    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Valid user ID is required");
    }

    // Check if subscription exists
    const subscription = await Subscription.findOne({channel: channelId, user: userId});

    if(subscription){
        await subscription.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Unsubscribed from channel successfully"));
    }
    else{
        const newSubscription = await Subscription.create({channel: channelId, user: userId});
        return res
            .status(201)
            .json(new ApiResponse(201, newSubscription, "Subscribed to channel successfully"));
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId || isValidObjectId(channelId)){
        throw new ApiError(400, "Valid channel ID is required");
    }

    // Find all subscriptions for the channel
    const subscribers = await Subscription.find({channel: channelId}).populate("user");

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Channel subscribers fetched successfully"));  
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!subscriberId || !isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Valid subscriber ID is required");
    }

    // Find all subscriptions for the subscriber
    const subscriptions = await Subscription.find({user: subscriberId}).populate("channel");

    return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
    
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
