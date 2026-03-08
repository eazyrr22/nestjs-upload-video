import { DynamicModule, Module, Global } from '@nestjs/common';
import { MongoService } from './mongoStorage.service';
import { FsService } from './fsStorage.service';
import { STORAGE_TOKEN } from './storage.interface';

@Global()
@Module({})
export class StorageRegister {
    static register(storageType: 'mongo' | 'fs'): DynamicModule {
        const selectedProvider = (storageType === 'mongo') ? MongoService : FsService;

        return {
            module: StorageRegister,
            providers: [selectedProvider, {
                provide: STORAGE_TOKEN,
                useExisting: selectedProvider
            }],
            exports: [STORAGE_TOKEN],
        };
    }
}