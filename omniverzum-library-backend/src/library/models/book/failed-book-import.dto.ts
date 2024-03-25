import { CreateBookDto } from "./create-book.dto";

export class FailedBookImportDto extends CreateBookDto {

    errorMessage: string;

}