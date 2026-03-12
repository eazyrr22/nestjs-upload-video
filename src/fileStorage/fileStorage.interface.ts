export interface IFileStorage {
    saveFile(sourceFilePath: string): Promise<string>;
    deleteFile(fileName: string): Promise<void>;
}
export const FILE_STORAGE_TOKEN = 'FILE_STORAGE_TOKEN'
, S3_CLIENT_TOKEN = 'S3_CLIENT_TOKEN';
