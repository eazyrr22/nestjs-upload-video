export interface IFileStorage {
    saveFile(sourceFilePath: string): Promise<string>;
}
export const FILE_STORAGE_TOKEN = 'FILE_STORAGE_TOKEN';