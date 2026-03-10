import Joi from "joi";

export const envValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    STORAGE_TYPE: Joi.string().valid('fs', 'mongo').default('fs'),
    FILE_STORAGE_TYPE: Joi.string().valid('fs', 's3').default('fs'),
    AWS_S3_BUCKET_NAME: Joi.string().when('FILE_STORAGE_TYPE', {
        is: 's3',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    AWS_REGION: Joi.string().when('FILE_STORAGE_TYPE', {
        is: 's3',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    AWS_ACCESS_KEY_ID: Joi.string().when('FILE_STORAGE_TYPE', {
        is: 's3',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    AWS_SECRET_ACCESS_KEY: Joi.string().when('FILE_STORAGE_TYPE', {
        is: 's3',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    MONGO_URI: Joi.string().when('STORAGE_TYPE', {
        is: 'mongo',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    MONGO_DB_NAME: Joi.string().when('STORAGE_TYPE', {  
        is: 'mongo',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    FFMPEG_PATH: Joi.string().required(),
    LOCAL_STORAGE_PATH: Joi.string().required(),
    VIDEO_CODEC: Joi.string().default('libx264'),
    VIDEO_BITRATE: Joi.string().default('1000k'),   
})  