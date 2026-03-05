import { Module } from '@nestjs/common';
import envConfig from './config/envConfig';
import {MongooseModule} from '@nestjs/mongoose';
import { ConfigModule ,ConfigService} from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
    validationSchema: envValidationSchema,
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI'),
    }),
  })],
})
export class AppModule { }