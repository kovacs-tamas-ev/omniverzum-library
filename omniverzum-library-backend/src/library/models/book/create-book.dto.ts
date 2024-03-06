import { IsNotEmpty } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty({ message: 'A leltári szám megadása kötelező' })
    inventoryNumber: number = undefined;

    
    @IsNotEmpty({ message: 'A cím megadása kötelező' })
    title: string = undefined;
    
    @IsNotEmpty({ message: 'A szerző megadása kötelező' })
    author: string = undefined;
    
    isbn: string = undefined;
    publisher: string = undefined;
    genre: string = undefined;
    subjectArea: string = undefined;
}