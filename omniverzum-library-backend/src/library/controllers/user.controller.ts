import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../models/user/create-user.dto";
import { UserDto } from "../models/user/user.dto";
import { FilterUserDto } from "../models/user/filter-user.dto";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('create')
    async createUser(@Body() userData: CreateUserDto): Promise<void> {
        console.log('-- user data --\n', userData);
        this.userService.createUser(userData);
    }

    @Get('find-all')
    async findAllUsers() {
        this.userService.findAllUsers();
    }

    @Post('find')
    async findUsers(@Body() filterData: FilterUserDto): Promise<UserDto[]> {
        return this.userService.findUsers(filterData);
    }

}