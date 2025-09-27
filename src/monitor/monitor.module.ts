import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MonitorController } from "./monitor.controller";
import { MonitorService } from "./monitor.service";
import { Laboratorio } from "./entities/laboratorio.entity";
import { Reserva } from "./entities/reserva.entity";
import { Usuario } from "./entities/usuario.entity";
import { Asignatura } from "./entities/signatura.entity";
import { Carrera } from "./entities/carrera.entity";
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Laboratorio,
      Reserva,
      Usuario,
      Asignatura,
      Carrera,
    ]),
  ],
  controllers: [MonitorController],
  providers: [MonitorService],
})
export class MonitorModule {}
