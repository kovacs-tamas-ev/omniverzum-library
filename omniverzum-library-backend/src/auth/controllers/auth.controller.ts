import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { customValidationPipe } from "src/library/exception-filters/custom-exception-factory";
import { ServerException } from "src/library/models/general/server-exception";
import { LoginPayloadDto } from "../models/login-payload.dto";
import { AuthService } from "../services/auth.service";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    @UsePipes(customValidationPipe)
    async login(@Body() authPayloadDto: LoginPayloadDto) {
        const loginResponseDto = await this.authService.validateUser(authPayloadDto);
        
        if (!loginResponseDto) {
            throw new ServerException({ message: 'Hibás felhasználónév vagy jelszó' });
        }

        return loginResponseDto;
    }

}