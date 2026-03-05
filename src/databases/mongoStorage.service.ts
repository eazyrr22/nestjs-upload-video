import uuid from 'uuid';
import { Connection } from 'mongoose';
import {IStorage} from "./storage.interface";
import { Injectable } from "@nestjs/common";
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class MongoService implements IStorage {
    constructor(@InjectConnection() private readonly mongoConnection: Connection) { }

    getItems = async (entity: string): Promise<object[]> => {
        return this.mongoConnection.collection(entity).find().toArray();
    }

    getItem = async (entity: string, itemId: string): Promise<object | null> => {
        return this.mongoConnection.collection(entity).findOne({ id: itemId });
    }

    insertItem = async (entity: string, item: object): Promise<void> => {
        const structuredItem = {
            ...item,
            id: uuid.v4(),
        };
        await this.mongoConnection.collection(entity).insertOne(structuredItem);
    }

    deleteItem = async (entity: string, itemId: string): Promise<string> => {
        await this.mongoConnection.collection(entity).deleteOne({ id: itemId });
        return itemId;
    }

    updateItem = async (entity: string, itemId: string, updatedProps: Partial<object>): Promise<object> => {
        const targetItem = await this.mongoConnection.collection(entity).findOneAndUpdate({ id: itemId }, { $set: updatedProps });
        if (!targetItem || !targetItem.value) {
            throw new Error(`Item not found`);
        }
        return targetItem.value;
    }

    findByFilters = async (entity: string, filters: Record<string, any>): Promise<any[]> => {
        return this.mongoConnection.collection(entity).find(filters).toArray();
    }

}   