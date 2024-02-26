import { IsNotEmpty } from "class-validator";

export class SetAdminStateDto {
    @IsNotEmpty({ message: 'A felhasználó azonosítója nem lehet üres' })
    userId: string;
    @IsNotEmpty({ message: 'Az új admin állapot nem lehet üres' })
    newAdminState: boolean;
}