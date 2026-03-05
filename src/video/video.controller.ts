import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Delete, Put,Query, Optional, Patch } from '@nestjs/common';

import { VideoService } from './video.service';
import { CreateVideoDto, UpdateVideoDto,FindVideosDto } from './video.dto';

@Controller('videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadVideo(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateVideoDto,
    ) {
        return this.videoService.encodeAndSave(file, dto);
    }

    @Put('update')
    @UseInterceptors(FileInterceptor('file'))
    async updateVideo(
        @Body() dto: UpdateVideoDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.videoService.updateVideo(dto, file);
    }

    @Get()
    async getAllVideos() {
        return this.videoService.getAllVideos();
    }

    @Delete(':id')
    async deleteVideo(@Body('id') id: string) {
        return this.videoService.deleteVideo(id);
    }

    @Post('find')
    async findVideo(@Query() filters: FindVideosDto) {
        return this.videoService.findVideo(filters);
    }
}