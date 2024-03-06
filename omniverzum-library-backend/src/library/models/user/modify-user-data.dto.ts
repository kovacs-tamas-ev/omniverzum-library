import { IsEmail, IsNotEmpty } from "class-validator";

export class ModifyUserDataDto {
    @IsNotEmpty({ message: 'Az _id mező nem lehet üres' })
    _id: string = undefined;
    @IsNotEmpty({ message: 'A felhasználónév nem lehet üres' })
    username?: string = undefined;
    @IsNotEmpty({ message: 'A teljes név nem lehet üres' })
    fullName?: string = undefined;
    @IsNotEmpty({ message: 'Az email cím nem lehet üres' })
    @IsEmail({}, { message: 'Nem megfelelő email formátum' })
    email?: string = undefined;
    @IsNotEmpty({ message: 'A képzés kitöltése kötelező' })
    course?: string = undefined;
    @IsNotEmpty({ message: 'Az admin státusz nem lehet üres' })
    admin?: boolean = undefined;
}