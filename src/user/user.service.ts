import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
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
            where: { id }
        });

        const contactUser = await this.prisma.user.findUnique({
            where: { phone },
            include: {
                Contact: true
            }
        });

        if (!user || !contactUser.Contact.id) throw new NotFoundException();

        const data = {
            to: contactUser.expoPushToken,
            title: `${user.firstName} ${user.lastName} vil ha deg som kontaktperson.`,
            data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone
            }
        };

        let returnStatus = false;

        // Send expo notification
        axios.post('https://exp.host/--/api/v2/push/send', data)
            .then(res => {
                if (res.status === 200) {
                    returnStatus = true;
                } else {
                    returnStatus = false;
                }
            })
            .catch(err => {
                console.log(err);
                returnStatus = false;
            });

        // Return boolean
        setTimeout(() => {
            return returnStatus;
        }, 3000);
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