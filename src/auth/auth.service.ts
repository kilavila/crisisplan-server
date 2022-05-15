import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    jwtSecret: string = process.env.JWT_SECRET;

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private prisma: PrismaService
    ) {}

    async validate(phone: string, password: string) {
        const user = await this.userService.getUserByPhone(phone);

        if (!user) {
            return null;
        }

        if (await bcrypt.compare(password, user.password)) {
            return user;
        }

        throw new UnauthorizedException();
    }

    async login(user: any) {
        const payload = {
            phone: user.phone,
            sub: user.id
        };

        const info = {
            id: user.id,
            phone: user.phone,
        };

        return {
            user: info,
            access_token: this.jwtService.sign(payload)
        }
    }

    async verify(token: string) {
        const decoded = this.jwtService.verify(token, {
            secret: this.jwtSecret
        });

        const user = await this.userService.getUserByPhone(decoded.phone);

        if (!user) {
            throw new Error('Unable to get the user from decoded token');
        }

        return user;
    }

    async register(body: any) {
        const passwordHash = await bcrypt.hash(body.password, 10);

        return await this.prisma.user.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phone,
                password: passwordHash,
                expoPushToken: body.expoPushToken,
            }
        });
    }

}