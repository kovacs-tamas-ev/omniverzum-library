import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
import { Request } from 'express';
import { customValidationPipe } from "src/library/exception-filters/custom-exception-factory";
import { ServerException } from "src/library/models/general/server-exception";
import { UserDto } from "src/library/models/user/user.dto";
import { BasicJwtGuard } from "../guards/basic-jwt.guard";
import { LoginPayloadDto } from "../models/login-payload.dto";
import { LoginResponseDto } from "../models/login-response.dto";
import { AuthService } from "../services/auth.service";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    @UsePipes(customValidationPipe)
    async login(@Body() authPayloadDto: LoginPayloadDto): Promise<LoginResponseDto> {
        const loginResponseDto = await this.authService.validateUser(authPayloadDto);
        
        if (!loginResponseDto) {
            throw new ServerException({ message: 'Hibás felhasználónév vagy jelszó' });
        }

        return loginResponseDto;
    }

    @Get('own-data')
    @UseGuards(BasicJwtGuard)
    async getOwnData(@Req() request: Request): Promise<UserDto> {
        const tokenData = request.user as UserDto;
        return await this.authService.findUserOwnData(tokenData._id);
    }

}