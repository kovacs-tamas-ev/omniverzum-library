import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { customValidationPipe } from "../exception-filters/custom-exception-factory";
import { CreateUserDto } from "../models/user/create-user.dto";
import { FilterUserDto } from "../models/user/filter-user.dto";
import { UserDto } from "../models/user/user.dto";
import { UserService } from "../services/user.service";
import { AdminJwtGuard } from "src/auth/guards/admin-jwt-guard";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('create')
    @UseGuards(AdminJwtGuard)
    @UsePipes(customValidationPipe)
    async createUser(@Body() userData: CreateUserDto): Promise<void> {
        this.userService.createUser(userData);
    }

    @Post('find')
    @UseGuards(AdminJwtGuard)
    async findUsers(@Body() filterData?: FilterUserDto): Promise<UserDto[]> {
        return this.userService.findUsers(filterData);
    }

}