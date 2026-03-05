import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Delete, Put } from '@nestjs/common';

import { VideoService } from './video.service';
import { CreateVideoDto, UpdateVideoDto } from './video.dto';

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

    @Put('update/:id')
    @UseInterceptors(FileInterceptor('file'))
    async updateVideo(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UpdateVideoDto,
    ) {
        return this.videoService.encodeAndSave(file, dto);
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
    async findVideo(@Body() filters: UpdateVideoDto) {
        return this.videoService.findVideo(filters);
    }
}