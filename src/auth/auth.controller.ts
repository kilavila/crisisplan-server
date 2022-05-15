import { Body, Controller, Get, HttpCode, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @Get('verify')
    @HttpCode(200)
    async verify(@Req() req: Request) {
        const token = req.headers.authorization.split(' ')[1];
        return this.authService.verify(token);
    }

    @UseGuards(LocalAuthGuard)
    @Put('login')
    @HttpCode(200)
    async login(@Req() req: Request) {
        return await this.authService.login(req.user);
    }

    @Post('register')
    @HttpCode(201)
    async register(@Body() body: any) {
        return await this.authService.register(body);
    }

}