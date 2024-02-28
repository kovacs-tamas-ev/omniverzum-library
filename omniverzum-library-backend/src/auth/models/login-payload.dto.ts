import { IsNotEmpty } from "class-validator";

export class LoginPayloadDto {
    @IsNotEmpty({ message: 'A felhasználónév nem lehet üres' })
    username: string = undefined;
    @IsNotEmpty({ message: 'A jelszó nem lehet üres' })
    password: string = undefined;
}