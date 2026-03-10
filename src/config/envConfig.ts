export default () => ({
    port: process.env.PORT,
    ffmpegPath: process.env.FFMPEG_PATH,
    storageType: process.env.STORAGE_TYPE,
    fileStorageType: process.env.FILE_STORAGE_TYPE,
    s3: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
        bucketName: process.env.S3_BUCKET_NAME
    },
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