import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const user = req.user;

    // 1. Check authenticity of user
    if (!user || !user._id) {
        throw new ApiError(401, "User not authorized");
    }

    // Use the user's own ID as channel ID
    const channelId = user._id;

    // Get total videos by this user
    const Video = mongoose.model("Video");
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Get all videos by this user to calculate views and likes
    const videos = await Video.find({ owner: channelId }, "_id views");

    // Sum views across all videos
    const totalVideoViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);

    // Total likes on all videos
    const Like = mongoose.model("Like");
    const totalLikes = await Like.countDocuments({ video: { $in: videos.map(v => v._id) } });

    // Get total subscribers (users who have subscribed to this user/channel)
    const Subscription = mongoose.model("Subscription");
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Whether this user is subscribed to their own channel (usually false, but included for completeness)
    const isSubscribed = await Subscription.exists({ channel: channelId, user: user._id });

    // How many channels this user is subscribing to
    const totalSubscriptions = await Subscription.countDocuments({ user: user._id });

    // Respond with stats
    const stats = {
        totalVideos,
        totalVideoViews,
        totalLikes,
        totalSubscribers,
        isSubscribed: !!isSubscribed,
    };

    return res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const user = req.user;
    if(!user || !user._id){
        throw new ApiError(401, "User not authorized");
    }

    // Use the user's own ID as channel ID
    const channelId = user._id;

    // Get all videos uploaded by this channel/user
    const Video = mongoose.model("Video");
    const videos = await Video.find({owner: channelId});

    return res.status(200).json(new ApiResponse(200, videos, "Videos uploaded by the channel"));
})

export {
    getChannelStats, 
    getChannelVideos
    }
