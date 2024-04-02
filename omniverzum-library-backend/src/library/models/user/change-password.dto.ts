import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty({ message: 'A régi jelszó kitöltése kötelező' })
    oldPassword: string = undefined;
    @IsNotEmpty({ message: 'Az új jelszó kitöltése kötelező' })
    password: string = undefined;
    @IsNotEmpty({ message: 'Az új jelszó megismétlésének kitöltése kötelező' })
    rePassword: string = undefined;
}