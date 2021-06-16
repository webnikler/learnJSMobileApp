import { BadRequestException, Body, Controller, Get, HttpCode, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: AuthDto) {
        const foundUser = await this.userService.findUser(dto.login);

        if (foundUser) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }

        return this.userService.createUser(dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() { login, password }: AuthDto) {
        const { email } = await this.userService.validateUser(login, password);

        return this.authService.login(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('test')
    async testAuth() {
        return {
            isOk: true,
        };
    }
}
