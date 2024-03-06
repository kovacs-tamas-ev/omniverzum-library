import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({ message: 'A teljes név nem lehet üres' })
    fullName: string = undefined;
    @IsNotEmpty({ message: 'Az email cím nem lehet üres' })
    @IsEmail({}, { message: 'Nem megfelelő email formátum' })
    email: string = undefined;
    @IsNotEmpty({ message: 'A képzés kitöltése kötelező' })
    course: string = undefined;
    @IsNotEmpty({ message: 'Az admin státusz megadása kötelező' })
    admin?: boolean = undefined;

}