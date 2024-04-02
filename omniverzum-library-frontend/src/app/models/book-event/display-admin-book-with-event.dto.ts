export interface DisplayAdminBookWithEventDto {

    bookId: string;
    title: string;
    author: string;
    isBorrowed: boolean;
    isReserved: boolean;
    borrowUserId: string;
    borrowUserFullName: string;
    borrowedAt?: Date;
    dueDate?: Date;
    userNotified: boolean;
    reserveUserId: string;
    reserveUserFullName: string;

}