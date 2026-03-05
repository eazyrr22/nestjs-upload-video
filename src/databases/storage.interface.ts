export interface IStorage {
    insertItem<T>(entity:string,item:Partial<T>): Promise<void>;
    deleteItem<T>(entity: string, itemId: string): Promise<string>;
    updateItem<T>(entity: string,updatedProps: Partial<T>): Promise<T>;
    getItem<T>(entity: string, itemId: string): Promise<T | null>;
    getItems<T>(entity: string): Promise<T[]>;
    findByFilters?<T>(entity: string, filters: Partial<T>): Promise<T[]>;
    }   
export const STORAGE_TOKEN = 'STORAGE_SERVICE_TOKEN';