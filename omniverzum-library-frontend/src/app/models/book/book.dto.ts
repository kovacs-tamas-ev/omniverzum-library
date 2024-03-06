export interface BookDto {
    _id: string;

    inventoryNumber: number;
    title: string;
    author: string;

    isbn?: string;
    publisher?: string;
    genre?: string;
    subjectArea?: string;
}