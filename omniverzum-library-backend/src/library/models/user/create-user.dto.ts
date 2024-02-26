import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({ message: 'A felhasználónév nem lehet üres' })
    username: string = undefined;
    @IsNotEmpty({ message: 'A jelszó nem lehet üres' })
    password: string = undefined;
    @IsNotEmpty({ message: 'A teljes név nem lehet üres' })
    fullName: string = undefined;
    @IsNotEmpty({ message: 'Az email cím nem lehet üres' })
    @IsEmail({}, { message: 'Nem megfelelő email formátum' })
    email: string = undefined;
    admin?: boolean = undefined;

}