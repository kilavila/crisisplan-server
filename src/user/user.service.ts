import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    async getUserByPhone(phone: string) {
        const user = await this.prisma.user.findUnique({
            where: { phone },
            include: {
                Contact: true,
                ContactRelation: true
            }
        });

        if (!user) throw new NotFoundException();

        return user;
    }

    async updateUser(id: string, data: any) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) throw new NotFoundException();

        return await this.prisma.user.update({
            where: { id },
            data
        });
    }

    async createContact(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) throw new NotFoundException();

        return await this.prisma.contact.create({
            data: {
                userId: id
            }
        });
    }

    async requestLinking(id: string, phone: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        const contactUser = await this.prisma.user.findUnique({
            where: { phone },
            include: {
                Contact: true
            }
        });

        if (!user || !contactUser.Contact.id) throw new NotFoundException();

        // Send expo notification
        // Return boolean
    }

    async linkUserToContact(id: string, phone: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        const contactUser = await this.prisma.user.findUnique({
            where: { phone },
            include: {
                Contact: true
            }
        });

        if (!user || !contactUser.Contact.id) throw new NotFoundException();

        return await this.prisma.contactRelation.create({
            data: {
                userId: id,
                contactId: contactUser.Contact.id,
            }
        });
    }

    async getLinks() {
        return await this.prisma.contactRelation.findMany({
            include: {
                User: true,
                Contact: true,
            }
        });
    }

}