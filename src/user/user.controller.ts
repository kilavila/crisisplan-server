import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('find/:phone')
    async getUserByPhone(@Param('phone') phone: string) {
        return await this.userService.getUserByPhone(phone);
    }

    @Put('update/:id')
    async updateUser(@Param('id') id: string, @Body() body: any) {
        return await this.userService.updateUser(id, body);
    }

    @Post('create/contact/:id')
    async createContact(@Param('id') id: string) {
        return await this.userService.createContact(id);
    }

    @Post('link/:id')
    async linkUserToContact(@Param('id') id: string, @Body() body: any) {
        return await this.userService.linkUserToContact(id, body.phone);
    }

    @Get('links/all')
    async getLinks() {
        return await this.userService.getLinks();
    }

}
