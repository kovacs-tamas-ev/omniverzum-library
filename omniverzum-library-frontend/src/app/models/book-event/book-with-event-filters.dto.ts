import { BookDto } from "../book/book.dto";

export interface BookWithEventFiltersDto {

    bookFilters?: BookDto;
    myEvents?: boolean;

}