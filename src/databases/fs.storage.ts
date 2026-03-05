import { join } from "path";
import * as fs from "fs-extra";
import IStorage from "./storage.interface";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FsService implements IStorage {
    private readonly storageDirPath: string;

    constructor(private readonly configService: ConfigService) {
        this.storageDirPath = this.configService.get<string>('LOCAL_STORAGE_PATH') || './localStorage';
    }
    getItem = async (entity: string, itemId: string): Promise<object | null> => {
        const filePath = join(this.storageDirPath, entity, `${itemId}.json`);
        if (!(await fs.pathExists(filePath))) throw new Error('item storage not found');
        const items = await fs.readJSON(filePath);
        const targetItem = items.find((item: any) => item.id === itemId);
        return targetItem || null;
    }
    getItems = async (entity: string): Promise<object[]> => {
        const filePath = join(this.storageDirPath, entity, `items.json`);
        if (!(await fs.pathExists(filePath))) throw new Error('item storage not found');
        return await fs.readJSON(filePath);
    }

    insertItem = async (entity: string, item: object): Promise<void> => {
        const filePath = join(this.storageDirPath, entity, `items.json`);
        let items: object[] = [];
        if (await fs.pathExists(filePath)) {
            items = await fs.readJSON(filePath);
        }
        items.push(item);
        await fs.outputJSON(filePath, items);
    }

    deleteItem = async (entity: string, itemId: string): Promise<string> => {
        const filePath = join(this.storageDirPath, entity, `items.json`);
        if (!(await fs.pathExists(filePath))) throw new Error('item storage not found');
        let items: any[] = await fs.readJSON(filePath);
        const itemIndex = items.findIndex((item: any) => item.id === itemId);
        if (itemIndex === -1) throw new Error('item not found');
        items.splice(itemIndex, 1);
        await fs.outputJSON(filePath, items);
        return itemId;
    }

    updateItem = async (entity: string, itemId: string, fieldstoUpdate: Partial<object>): Promise<object> => {
        const filePath = join(this.storageDirPath, entity, `items.json`);
        if (!(await fs.pathExists(filePath))) throw new Error('item storage not found');
        let items: any[] = await fs.readJSON(filePath);
        const itemIndex = items.findIndex((item: any) => item.id === itemId);
        if (itemIndex === -1) throw new Error('item not found');
        for (const key in fieldstoUpdate) {
            if (key === 'id') continue;
            items[itemIndex][key] = fieldstoUpdate[key];
        }
        const updatedItem = items[itemIndex];
        await fs.outputJSON(filePath, items);
        return updatedItem;
    }
}