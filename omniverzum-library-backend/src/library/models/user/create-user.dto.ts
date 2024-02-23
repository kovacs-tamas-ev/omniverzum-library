import { OmitType } from "@nestjs/mapped-types";
import { UserDto } from "./user.dto";

export class CreateUserDto {

    username: string = undefined;
    password: string = undefined;
    fullName: string = undefined;
    email: string = undefined;

}