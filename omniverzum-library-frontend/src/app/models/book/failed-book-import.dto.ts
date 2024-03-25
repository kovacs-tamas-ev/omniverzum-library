import { BookDto } from "./book.dto";

export interface FailedBookImportDto extends BookDto {

    errorMessage: string;

}