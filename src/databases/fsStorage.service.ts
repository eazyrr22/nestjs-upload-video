import { v4 } from "uuid";
import { join } from "path";
import * as fs from "fs-extra";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IStorage } from "./storage.interface";
import { NotFoundException } from "src/common/custom-errors";

@Injectable()
export class FsService implements IStorage {
    private readonly storageDirPath: string;

    constructor(private readonly configService: ConfigService) {
        this.storageDirPath = this.configService.get<string>('localStorage.localStoragePath') || './localStorage';
    }
    getItem = async <T>(entity: string, itemId: string): Promise<T | null> => {
        const filePath = join(this.storageDirPath, `${entity}.json`);
        if (!(await fs.pathExists(filePath))) throw new NotFoundException(entity);

        const items = await fs.readJSON(filePath);
      
        const targetItem = items.find((item: any) => item.id === itemId);
        return targetItem || null;
    }

    getItems = async <T>(entity: string): Promise<T[]> => {
        const filePath = join(this.storageDirPath, `${entity}.json`);
      
        if (!(await fs.pathExists(filePath))) throw new NotFoundException(entity);

        return await fs.readJSON(filePath);
    }

    insertItem = async <T>(entity: string, item: Partial<T>): Promise<void> => {
        const structuredItem = {
            ...item,
            id: v4(),
        } as T;

        const filePath = join(this.storageDirPath, `${entity}.json`);
        let items: T[] = [];
      
        if (await fs.pathExists(filePath)) {
            items = await fs.readJSON(filePath);
        }

        items.push(structuredItem);

        await fs.outputJSON(filePath, items);
    }

    deleteItem = async <T>(entity: string, itemId: string): Promise<string> => {
        const filePath = join(this.storageDirPath, `${entity}.json`);
        if (!(await fs.pathExists(filePath))) throw new NotFoundException(entity);

        let items: T[] = await fs.readJSON(filePath);
        const itemIndex = items.findIndex((item: any) => item.id === itemId);
       
        if (itemIndex === -1) throw new NotFoundException(entity);
        items.splice(itemIndex, 1);

        await fs.outputJSON(filePath, items);

        return itemId;
    }

    updateItem = async <T>(entity: string, fieldstoUpdate: Partial<T>): Promise<T> => {
        const { id, ...restFields } = fieldstoUpdate as any;
        const filePath = join(this.storageDirPath, `${entity}.json`);
    
        if (!(await fs.pathExists(filePath))) throw new NotFoundException(entity);

        let items: T[] = await fs.readJSON(filePath);
        const itemIndex = items.findIndex((item: any) => item.id === id);
        
        if (itemIndex === -1) throw new NotFoundException(entity);

        for (const key in restFields) {
            items[itemIndex][key] = restFields[key];
        }
        const updatedItem = items[itemIndex];

        await fs.outputJSON(filePath, items);

        return updatedItem;
    }

    findByFilters = async <T>(entity: string, filters: Partial<T>): Promise<T[] | []> => {
        const filePath = join(this.storageDirPath, `${entity}.json`);

        if (!(await fs.pathExists(filePath))) throw new NotFoundException(entity);

        const items: T[] = await fs.readJSON(filePath);

        return items.filter(item =>
            Object.keys(filters).every(key => item[key] === filters[key])
        );
    }
}