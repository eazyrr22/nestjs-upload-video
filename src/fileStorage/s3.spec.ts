import 'aws-sdk-client-mock-jest';
import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { mockClient } from 'aws-sdk-client-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { S3FileService } from './s3.service';

const mockS3Client = mockClient(S3Client);

describe('S3FileService', () => {
    let s3Service: S3FileService;

    beforeEach(async () => {
        mockS3Client.reset();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                S3FileService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: (key: string) => {
                            if (key === 's3.bucketName') return 'test-bucket';
                            return null;
                        }
                    }
                }, {
                    provide: 'S3Client',
                    useValue: mockS3Client
                }
            ]
        }).compile();

        s3Service = module.get<S3FileService>(S3FileService);
    });
    it('s3Service should be defined', () => {
        expect(s3Service).toBeDefined();
    });

    describe('saveFile', () => {
        const mockFilePath = 'videos/test.mp4';
        it('should upload file to S3 and return the file name on success', async () => {

            mockS3Client.on(PutObjectCommand).resolves({ $metadata: { httpStatusCode: 200 } });
            const result = await s3Service.saveFile(mockFilePath);
            expect(result).toBe('test.mp4');

        });
        it('should throw an error if upload fails - s3 error', async () => {
            mockS3Client.on(PutObjectCommand).resolves({ $metadata: { httpStatusCode: 500 } });
            await expect(s3Service.saveFile(mockFilePath)).rejects.toThrow('Failed to upload file to S3');

        })
        it('should throw an error if upload fails - connection error', async () => {
            mockS3Client.on(PutObjectCommand).rejects(new Error('Connection error'));
            await expect(s3Service.saveFile(mockFilePath)).rejects.toThrow('Failed to upload file to S3');
        });
        afterEach(() => {
            expect(mockS3Client).toHaveReceivedCommandWith(PutObjectCommand, {
                Bucket: 'test-bucket',
                Key: 'test.mp4',
                Body: expect.any(fs.ReadStream),
                ContentType: 'video/mp4'
            })
            expect(mockS3Client.calls()).toHaveLength(1);
        });
    });
});

