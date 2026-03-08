export default () => ({
    port: process.env.PORT,
    ffmpegPath: process.env.FFMPEG_PATH,
    storageType: process.env.STORAGE_TYPE,
    database: {
        mongoUri: process.env.MONGO_URI,
        mongoDbName: process.env.MONGO_DB_NAME
    },
    localStorage: {
        localStoragePath: process.env.LOCAL_STORAGE_PATH
    }, 
    videoSettings: {
        codec: process.env.VIDEO_CODEC,
        bitrate: process.env.VIDEO_BITRATE
    }
})