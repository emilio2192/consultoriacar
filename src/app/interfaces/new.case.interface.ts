import FileItem from './file.item.interface';
export default interface NewCase {
    correlative: string;
    client:string;
    isFinish: boolean;
    files: Array<FileItem>;
}