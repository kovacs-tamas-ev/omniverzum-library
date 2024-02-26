import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecretOrKey } from "../constants";
import { UserDto } from "src/library/models/user/user.dto";
import { ServerException } from "src/library/models/general/server-exception";

@Injectable()
export class BasicJwtStrategy extends PassportStrategy(Strategy) {

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
    const userDataKeys = Object.keys(new UserDto()).concat(['exp', 'iat']).sort();
    const givenDataKeys = Object.keys(userData).sort();
    const areTheSameKeys = userDataKeys.join(',') === givenDataKeys.join(',');

    if (!areTheSameKeys) {
        throw new ServerException({ message: 'A kéréshez jelentkezzen be' });
    }

    return userData;
}