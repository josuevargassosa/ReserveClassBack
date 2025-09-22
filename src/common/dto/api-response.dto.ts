import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: "Operación exitosa" })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ required: false, nullable: true })
  result?: T | null;

  static ok<T>(
    message: string,
    result?: T,
    statusCode = 200
  ): ApiResponseDto<T> {
    return { success: true, message, statusCode, result: result ?? null };
  }

  static fail(message: string, statusCode = 400): ApiResponseDto<null> {
    return { success: false, message, statusCode, result: null };
  }
}
