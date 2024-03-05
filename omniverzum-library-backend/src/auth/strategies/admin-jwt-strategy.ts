import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import { ServerException } from "src/library/models/general/server-exception";
import { UserDto } from "src/library/models/user/user.dto";
import { basicJwtStrategyConfig, basicJwtValidate } from "./basic-jwt.strategy";

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {

    constructor() {
        super(basicJwtStrategyConfig);
    }

    validate(userData: UserDto) {
        const basicValidedData = basicJwtValidate(userData);
        if (!basicValidedData.admin) {
            throw new ServerException({ message: 'A kéréshez nincs megfelelő jogosultsága' });
        }

        return basicValidedData;
    }

}