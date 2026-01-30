import { Module } from '@nestjs/common';
import { ServicePackagesService } from './service-packages.service';
import { ServicePackagesController } from './service-packages.controller';

@Module({
  providers: [ServicePackagesService],
  controllers: [ServicePackagesController],
})
export class ServicePackagesModule {}
