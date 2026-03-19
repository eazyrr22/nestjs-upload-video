import 'winston-daily-rotate-file';
import * as winston from "winston";
import { ConfigType } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { ConfigModule } from "@nestjs/config";
import { Global, Module } from "@nestjs/common";
import { ElasticsearchTransport } from "winston-elasticsearch";

import { loggingConfig } from "src/config/envConfig";

@Global()
@Module({
    imports: [
        ConfigModule.forFeature(loggingConfig),
        WinstonModule.forRootAsync({
            imports: [ConfigModule.forFeature(loggingConfig)],
            inject: [loggingConfig.KEY],
            useFactory: (openSearchConfig: ConfigType<typeof loggingConfig>) => {
                const { logLevel, host, port, password, username } = openSearchConfig;

                const openSearchTransport = new ElasticsearchTransport({
                    level: logLevel,
                    index: 'logs-video-upload-app',
                    clientOpts: {
                        node: `https://${host}:${port}`,
                        auth: {
                            username: username!,
                            password: password!
                        }
                    },
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    )
                });
                openSearchTransport.on('error', (err) => {
                    console.error('OpenSearch transport error:', err);
                });
                const consoleTransport = new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message, context }) => {
                            return `[${timestamp}] ${level}: [${context || 'App'}] ${message}`;
                        }),
                    )
                });

                return {
                    transports: [consoleTransport
                        , openSearchTransport
                    ]
                }
            }
        })
    ],
    exports: [WinstonModule]
})
export class LoggerModule { }