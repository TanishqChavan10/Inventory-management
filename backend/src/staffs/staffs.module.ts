import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { Employee } from './employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports:[TypeOrmModule.forFeature([Employee])],
  providers: [StaffsService]
})
export class StaffsModule {}
