import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, UserModule, PlanModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
