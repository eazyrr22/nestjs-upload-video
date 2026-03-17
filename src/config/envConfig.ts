import { registerAs } from "@nestjs/config"

export const baseConfig = registerAs('baseConfig', () => ({
    port: process.env.PORT,
    databaseType: process.env.DATABASE_TYPE,
    fileStorageType: process.env.FILE_STORAGE_TYPE,
    tempUploadsDir: process.env.TEMP_UPLOADS_DIR
})),
fileUploadConfig = registerAs('fileUploadSettings',()=>({
    maxFileSize: Number(process.env.MAX_FILE_SIZE)
})),
s3Config = registerAs('s3', () => ({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    bucketName: process.env.S3_BUCKET_NAME
})),
databaseConfig = registerAs('database', () => ({
    mongoUri: process.env.MONGO_URI,
    mongoDbName: process.env.MONGO_DB_NAME
})),
localStorageConfig = registerAs('localStorage', () => ({
    metaDataStoragePath: process.env.LOCAL_STORAGE_PATH,
    videoFilesDirPath: process.env.VIDEO_FILE_DIR_PATH
})),
transcodeConfig = registerAs('videoSettings', () => ({
    codec: process.env.VIDEO_CODEC,
    bitrate: process.env.VIDEO_BITRATE,
    ffmpegPath: process.env.FFMPEG_PATH
    }))