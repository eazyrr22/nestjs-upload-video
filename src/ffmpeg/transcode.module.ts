import { Module } from "@nestjs/common";
import { TranscoderService } from "./transcode.service";

@Module({
    providers: [TranscoderService],
    exports: [TranscoderService],
})
export class TranscodeModule { }