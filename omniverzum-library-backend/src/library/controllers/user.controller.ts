import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { customValidationPipe } from "../exception-filters/custom-exception-factory";
import { CreateUserDto } from "../models/user/create-user.dto";
import { FilterUserDto } from "../models/user/filter-user.dto";
import { UserDto } from "../models/user/user.dto";
import { UserService } from "../services/user.service";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('create')
    @UsePipes(customValidationPipe)
    async createUser(@Body() userData: CreateUserDto): Promise<void> {
        this.userService.createUser(userData);
    }

    @Post('find')
    async findUsers(@Body() filterData?: FilterUserDto): Promise<UserDto[]> {
        return this.userService.findUsers(filterData);
    }

}