import { FilterBookDto } from "../book/filter-book.dto";

export class BookWithEventFiltersDto {

    bookFilters?: FilterBookDto;
    myEvents: boolean;

}