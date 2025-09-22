import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, Min } from "class-validator";

export class CrearReservaDto {
  @ApiProperty() @IsInt() @Min(1) laboratorioId: number;
  @ApiProperty() @IsInt() @Min(1) usuarioId: number;
  @ApiProperty() @IsInt() @Min(1) asignaturaId: number;

  // como tu modelo guarda por separado, enviamos ISO y dividimos en fecha/hora
  @ApiProperty({ example: "2025-09-19T10:00:00" })
  @IsDateString()
  inicioISO: string;

  @ApiProperty({ example: "2025-09-19T12:00:00" })
  @IsDateString()
  finISO: string;
}

export class RechazarDto {
  @ApiProperty({ required: false }) motivo?: string;
}
