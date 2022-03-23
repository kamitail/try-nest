export type FileType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
};

export type FileFilterCallback = (error: Error, acceptFile: boolean) => void;

export type FileStorageCallback = (error: Error, filename: string) => void;
