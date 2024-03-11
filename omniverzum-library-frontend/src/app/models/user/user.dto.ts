export interface UserDto {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    course: string;
    membershipStart: Date;
    admin: boolean;
}