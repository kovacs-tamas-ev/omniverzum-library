import { BookDto } from "../book/book.dto";

export interface DisplayBookWithEventDto extends BookDto {

    state: DisplayBookStateDto;

}

export interface DisplayBookStateDto {
    myBorrowed: boolean;
    myReserved: boolean;
    othersBorrowed: boolean;
    othersReserved: boolean;
}
