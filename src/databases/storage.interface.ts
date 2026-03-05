export interface IStorage {
    insertItem(entity:string,item:object): Promise<void>;
    deleteItem(entity: string, itemId: string): Promise<string>;
    updateItem(entity: string, itemId:string ,updatedProps: Partial<object>): Promise<object>;
    getItem(entity: string, itemId: string): Promise<object | null>;
    getItems(entity: string): Promise<object[]>;
    findByFilters(entity: string, filters: Record<string, any>): Promise<any[]>;
    }   
export const STORAGE_TOKEN = 'STORAGE_SERVICE_TOKEN';