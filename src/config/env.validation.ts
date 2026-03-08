import Joi from "joi";

export const envValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    STORAGE_TYPE: Joi.string().valid('fs', 'mongo').default('fs'),
    MONGO_URI: Joi.string().required(),
    FFMPEG_PATH: Joi.string().required(),
    MONGO_DB_NAME: Joi.string().required(),
    LOCAL_STORAGE_PATH: Joi.string().required(),
    VIDEO_CODEC: Joi.string().default('libx264'),
    VIDEO_BITRATE: Joi.string().default('1000k'),   
})  