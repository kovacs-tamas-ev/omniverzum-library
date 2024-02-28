import { Body, Controller, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
import { Request } from 'express';
import { AdminJwtGuard } from "src/auth/guards/admin-jwt-guard";
import { BasicJwtGuard } from "src/auth/guards/basic-jwt.guard";
import { mapToClass } from "src/utils/mappers";
import { hasEmptyStringField } from "src/utils/object-utils";
import { customValidationPipe } from "../exception-filters/custom-exception-factory";
import { ServerException } from "../models/general/server-exception";
import { CreateUserDto } from "../models/user/create-user.dto";
import { FilterUserDto } from "../models/user/filter-user.dto";
import { ModifyOwnDataDto } from "../models/user/modify-own-data.dto";
import { SetAdminStateDto } from "../models/user/set-admin-state.dto";
import { UserDto } from "../models/user/user.dto";
import { UserService } from "../services/user.service";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('create')
    @UseGuards(AdminJwtGuard)
    @UsePipes(customValidationPipe)
    async createUser(@Body() userData: CreateUserDto): Promise<void> {
        return this.userService.createUser(userData);
    }

    @Post('find')
    @UseGuards(AdminJwtGuard)
    async findUsers(@Body() filterData?: FilterUserDto): Promise<UserDto[]> {
        return this.userService.findUsers(filterData);
    }

    @Post('set-admin-state')
    @UseGuards(AdminJwtGuard)
    @UsePipes(customValidationPipe)
    async setAdminState(@Body() adminStateDto: SetAdminStateDto): Promise<void> {
        return this.userService.setAdminState(adminStateDto.userId, adminStateDto.newAdminState);
    }

    @Post('modify-own-data')
    @UseGuards(BasicJwtGuard)
    async modifyOwnData(@Req() request: Request, @Body() modifyOwnDataDto: ModifyOwnDataDto): Promise<void> {
        const tokenData = mapToClass(ModifyOwnDataDto, modifyOwnDataDto);
        if (hasEmptyStringField(tokenData)) {
            throw new ServerException({ message: 'Hibásan megadott adatok, az üres string nem elfogadott' });
        }

        const ownUserData = request.user as UserDto;
        return this.userService.modifyUserData(ownUserData._id, tokenData);
    }

}