import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from "src/library/models/user/user.dto";
import { jwtSecretOrKey } from "../constants";

@Injectable()
export class BasicJwtStrategy extends PassportStrategy(Strategy, 'basic-jwt') {

    constructor() {
        super(basicJwtStrategyConfig);
    }

    validate(userData: UserDto): UserDto {
        return basicJwtValidate(userData);
    }

}

export const basicJwtStrategyConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: jwtSecretOrKey
};

export function basicJwtValidate(userData: UserDto): UserDto {
    return userData;
}