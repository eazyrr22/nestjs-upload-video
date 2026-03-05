export default () => ({
    port: Number(process.env.PORT) || 3000,
    ffmpegPath: process.env.FFMPEG_PATH,
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