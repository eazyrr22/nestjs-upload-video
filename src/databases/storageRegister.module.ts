import { MongooseModule } from '@nestjs/mongoose';
import { DynamicModule, Module, Global } from '@nestjs/common';

import { FsService } from './fsStorage.service';
import { STORAGE_TOKEN } from './storage.interface';
import { MongoService } from './mongoStorage.service';

@Global()
@Module({})
export class StorageRegister {
    static register(storageType: 'mongo' | 'fs'): DynamicModule {
        const dependencyModules: any[] = [];

        if (storageType === 'mongo') {
            dependencyModules.push(MongooseModule);
        }

        const selectedProvider = (storageType === 'mongo') ? MongoService : FsService;

        return {
            module: StorageRegister,
            imports: dependencyModules,
            providers: [selectedProvider, {
                provide: STORAGE_TOKEN,
                useExisting: selectedProvider
            }],
            exports: [STORAGE_TOKEN],
        };
    }
}