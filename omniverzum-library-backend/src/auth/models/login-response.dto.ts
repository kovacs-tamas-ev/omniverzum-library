import { UserDto } from "src/library/models/user/user.dto";

export class LoginResponseDto {
    token: string;
    userData: UserDto;
}