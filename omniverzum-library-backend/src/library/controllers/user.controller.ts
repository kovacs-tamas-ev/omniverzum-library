import { Body, Controller, Delete, Param, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
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
import { UserDto } from "../models/user/user.dto";
import { UserService } from "../services/user.service";
import { ModifyUserDataDto } from "../models/user/modify-user-data.dto";

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

    @Post('modify-user-data')
    @UseGuards(AdminJwtGuard)
    @UsePipes(customValidationPipe)
    async modifyUserData(@Body() modifyUserDataDto: ModifyUserDataDto): Promise<void> {
        const userData = mapToClass(ModifyUserDataDto, modifyUserDataDto);
        await this.userService.modifyUserData(userData);
    }

    @Post('reset/:id')
    @UseGuards(AdminJwtGuard)
    async restUserData(@Param('id') id: string): Promise<void> {
        await this.userService.resetUserData(id);
    }

    @Delete(':id')
    @UseGuards(AdminJwtGuard)
    async deleteUser(@Param('id') id: string): Promise<void> {
        await this.userService.deleteUser(id);
    }

    @Post('modify-own-data')
    @UseGuards(BasicJwtGuard)
    async modifyOwnData(@Req() request: Request, @Body() modifyOwnDataDto: ModifyOwnDataDto): Promise<void> {
        const tokenData = mapToClass(ModifyOwnDataDto, modifyOwnDataDto);
        if (hasEmptyStringField(tokenData)) {
            throw new ServerException({ message: 'Hibásan megadott adatok, az üres string nem elfogadott' });
        }

        const ownUserData = request.user as UserDto;
        return this.userService.modifyOwnData(ownUserData._id, tokenData);
    }

}