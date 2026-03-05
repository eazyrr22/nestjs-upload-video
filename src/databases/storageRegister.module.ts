import { DynamicModule, Module, Global } from '@nestjs/common';
import { MongoService } from './mongoStorage.service';
import { FsService } from './fsStorage.service';
import { STORAGE_TOKEN } from './storage.interface';

@Global()
@Module({})
export class StorageRegister {
    static register(storageType: 'mongo' | 'fs'): DynamicModule {
        const selectedProvider = {
            provide: STORAGE_TOKEN,
            useClass: storageType === 'mongo' ? MongoService : FsService,
        }

        return {
            module: StorageRegister,
            providers: [selectedProvider,MongoService,FsService],
            exports: [selectedProvider],
        };
    }
}