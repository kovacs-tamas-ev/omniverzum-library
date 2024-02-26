import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { AuthPayloadDto } from "../models/auth-payload.dto";
import { customValidationPipe } from "src/library/exception-filters/custom-exception-factory";
import { ServerException } from "src/library/models/general/server-exception";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/login')
    @UsePipes(customValidationPipe)
    async login(@Body() authPayloadDto: AuthPayloadDto) {
        const loginResponseDto = await this.authService.validateUser(authPayloadDto);
        
        if (!loginResponseDto) {
            throw new ServerException({ message: 'Hibás felhasználónév vagy jelszó' });
        }

        return loginResponseDto;
    }

}