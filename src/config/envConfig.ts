export default ()=>({
port: Number(process.env.PORT)||3000,
database:{
    mongoUri:process.env.MONGO_URI,
    mongoDbName:process.env.MONGO_DB_NAME
},
localStorage:{
    localStoragePath:process.env.LOCAL_STORAGE_PATH,
    videoPath:process.env.VIDEO_PATH,
    playlistPath:process.env.PLAYLIST_PATH,
    genrePath:process.env.GENRE_PATH
}
})