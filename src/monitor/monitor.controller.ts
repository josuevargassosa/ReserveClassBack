import { Controller, Get, Post, Patch, Param, Body } from "@nestjs/common";
import { MonitorService } from "./monitor.service";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBody,
} from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiResponseDto } from "src/common/dto/api-response.dto";
import { CrearReservaDto } from "./dto/reservas.dto";

class LoginDto {
  @ApiProperty({ example: "atorres@uni.edu.ec" })
  @IsEmail()
  email: string;
}

@ApiTags("Monitor")
@Controller("monitor")
export class MonitorController {
  constructor(private readonly monitor: MonitorService) {}

  @Post("auth/login")
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: "Usuario encontrado" })
  @ApiNotFoundResponse({ description: "Usuario no encontrado" })
  async login(@Body() dto: LoginDto) {
    const user = await this.monitor.loginByEmail(dto.email);
    return ApiResponseDto.ok("Usuario encontrado", user, 200);
  }

  @Get("laboratorios")
  @ApiOkResponse({ description: "Listado de laboratorios" })
  async getLabs() {
    const data = await this.monitor.getLabs();
    console.log(data);
    return ApiResponseDto.ok("Listado de laboratorios", data);
  }

  @Get("asignaturas")
  @ApiOkResponse({ description: "Listado de Asignaturas" })
  async getAsignaturas() {
    const data = await this.monitor.getAsignaturas();
    return ApiResponseDto.ok("Listado de Asignaturas", data);
  }

  @Get("reservas")
  @ApiOkResponse({ description: "Listado de reservas" })
  async getReservas() {
    const data = await this.monitor.getReservas();
    return ApiResponseDto.ok("Listado de reservas", data);
  }

  @Post("reservas")
  @ApiOperation({ summary: "Crear reserva" })
  @ApiBody({ type: CrearReservaDto })
  crearReserva(@Body() dto: CrearReservaDto) {
    return this.monitor.crearReserva(dto);
  }

  @Get("carreras")
  @ApiOkResponse({ description: "Listado de carreras" })
  async getCarreras() {
    const data = await this.monitor.getCarreras();
    return ApiResponseDto.ok("Listado de carreras", data);
  }

  @Patch("reservas/:id/aprobar")
  @ApiOperation({ summary: "Aprobar reserva (stub)" })
  aprobar(@Param("id") id: string) {
    return this.monitor.aprobarReserva(+id);
  }

  @Patch("reservas/:id/rechazar")
  @ApiOperation({ summary: "Rechazar reserva (stub)" })
  rechazar(@Param("id") id: string) {
    return this.monitor.rechazarReserva(+id);
  }

  // @Post("registros-uso/start")
  // @ApiOperation({ summary: "Iniciar registro de uso (stub)" })
  // startUso(@Body() body: { laboratorioId: number; usuarioId: number }) {
  //   return this.monitor.startUso(body);
  // }

  // @Patch("registros-uso/:id/stop")
  // @ApiOperation({ summary: "Finalizar registro de uso (stub)" })
  // stopUso(@Param("id") id: string) {
  //   return this.monitor.stopUso(+id);
  // }
}
