import uuid from 'uuid';
import { Connection } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { InjectConnection } from '@nestjs/mongoose';

import { IStorage } from "./storage.interface";
import { NotFoundException } from 'src/common/custom-errors';

@Injectable()
export class MongoService implements IStorage {
    constructor(@InjectConnection() private readonly mongoConnection: Connection) { }

    getItems = async <T>(entity: string): Promise<T[] | []> => {
        return this.mongoConnection.collection(entity).find().toArray() as Promise<T[] | []>;;
    }

    getItem = async <T>(entity: string, itemId: string): Promise<T | null> => {
        return this.mongoConnection.collection(entity).findOne({ id: itemId }) as T | null;
    }

    insertItem = async <T>(entity: string, item: Partial<T>): Promise<void> => {
        const structuredItem = {
            ...item,
            id: uuid.v4(),
        } as any;
        await this.mongoConnection.collection(entity).insertOne(structuredItem);
    }

    deleteItem = async <T>(entity: string, itemId: string): Promise<string> => {

        await this.mongoConnection.collection(entity).deleteOne({ id: itemId });
        
        return itemId;
    }

    updateItem = async <T>(entity: string, updatedProps: Partial<T>): Promise<T> => {
        const { id, ...propsToUpdate } = updatedProps as any;

        const targetItem = await this.mongoConnection.collection(entity).findOneAndUpdate(
            { id: id },
            { $set: propsToUpdate },
            { returnDocument: 'after' }
        );

        if (!targetItem || !targetItem.value) { throw new NotFoundException(entity); }

        return targetItem.value;
    }

    findByFilters = async <T>(entity: string, filters: Partial<T>): Promise<T[] | []> => {
        return this.mongoConnection.collection(entity).find(filters).toArray() as Promise<T[] | []>;
    }

}   