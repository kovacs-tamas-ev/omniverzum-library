import { UserDto } from "../user/user.dto";

export interface LoginResponseDto {
    token: string;
    userData: UserDto;
}