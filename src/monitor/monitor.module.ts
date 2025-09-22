import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MonitorController } from "./monitor.controller";
import { MonitorService } from "./monitor.service";
import { Laboratorio } from "./entities/laboratorio.entity";
import { Reserva } from "./entities/reserva.entity";
import { Usuario } from "./entities/usuario.entity";
@Module({
  imports: [TypeOrmModule.forFeature([Laboratorio, Reserva, Usuario])],
  controllers: [MonitorController],
  providers: [MonitorService],
})
export class MonitorModule {}
