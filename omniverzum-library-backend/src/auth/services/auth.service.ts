import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { FilterQuery, Model } from "mongoose";
import { UserDto } from "src/library/models/user/user.dto";
import { User } from "src/library/schemas/user.schema";
import { mapToClass } from "src/utils/mappers";
import { LoginPayloadDto } from "../models/login-payload.dto";
import { LoginResponseDto } from "../models/login-response.dto";

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {

    }

    async validateUser(authPayloadDto: LoginPayloadDto): Promise<LoginResponseDto | null> {
        const filterQuery = {} as FilterQuery<User>;
        filterQuery.username = authPayloadDto.username;

        const resultDocs = await this.userModel.find(filterQuery).exec();
        if (resultDocs.length !== 1) {
            return null;
        }

        const foundUser = resultDocs[0].toObject();
        const isPasswordValid = await bcrypt.compare(authPayloadDto.password, foundUser.password);
        if (!isPasswordValid) {
            return null;
        }

        const userDataToSign = mapToClass(UserDto, foundUser);
        const token = this.jwtService.sign({ ...userDataToSign });
        return { token, userData: userDataToSign };
    }

}