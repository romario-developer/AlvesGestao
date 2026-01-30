import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ServicesModule } from './services/services.module';
import { ServicePackagesModule } from './service-packages/service-packages.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CompanyModule,
    UsersModule,
    ClientsModule,
    VehiclesModule,
    ServicesModule,
    ServicePackagesModule,
    AppointmentsModule,
    WorkOrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
