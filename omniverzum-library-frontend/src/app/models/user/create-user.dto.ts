export interface CreateUserDto {
    username: string;
    fullName: string;
    password: string;
    email: string;
    admin: boolean;
}