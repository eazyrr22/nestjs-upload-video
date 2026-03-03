import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import envConfig from './config/envConfig';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
    validationSchema: envValidationSchema,
}) ],
})
export class AppModule {}