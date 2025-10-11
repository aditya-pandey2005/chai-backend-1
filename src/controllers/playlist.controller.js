import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name){
        throw new ApiError(400, "Playlist name is required");
    }

    // Optionally get the userId from req.user or req.body, depending on your auth setup
    const userId = req.user?._id || req.body.userId;
    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400, "Valid user ID is required to create a playlist");
    }

    //create playlist
    const playlist = await Playlist.create({
        name,
        description,
        user: userId,
        videos: [] // start with an empty array of videos
    });

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));
    
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
     if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Valid user ID is required");
    }

    //find playlist for the user
    const playlists = await Playlist.find({user: userId}).populate("videos");

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Valid playlist ID is required");
    }

    //find playlist by ID
    const playlist = await Playlist.findById(playlistId).populate("videos");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Valid playlist ID is required");
    }
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid video ID is required");
    }

    //find the playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if video already exists in the playlist
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video already exists in the playlist");
    }

    //add video to playlist
    playlist.videos.push(videoId);
    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
    
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Valid playlist ID is required");
    }
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid video ID is required");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if the video exists in the playlis
    const videoIndex = playlist.videos.indexOf(videoId);
    if(videoIndex === -1){
        throw new ApiError(400, "Video not found in the playlist");
    }

    // Remove the video from the playlis
    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist 

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Valid playlist ID is required");
    }

    // Delete the playlist
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"));
    
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Valid playlist ID is required");
    }

    // Find and update the playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {name, description},
        {new: true, runValidators: true}
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"));
    
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
