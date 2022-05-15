import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {

  constructor(private prisma: PrismaService) {}

  serverStatus(): string {
    return 'Server online!';
  }

  async createFeedback(data: any) {
    return await this.prisma.feedback.create({ data });
  }

}