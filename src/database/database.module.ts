// src/database/database.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    // Carga .env y lo deja disponible en toda la app
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión MySQL/TiDB
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "mysql",
        // Usa variables separadas (recomendado)
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 4000),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,

        // TiDB Serverless requiere TLS
        ssl: { rejectUnauthorized: true },

        // Autocarga de entidades decoradas con @Entity()
        autoLoadEntities: true,

        // En producción, mantener en false (usa migraciones)
        synchronize: false,

        // Opcional: guardar/leer en UTC
        // timezone: 'Z',

        // Opcional: logs
        // logging: ['error', 'warn'],
      }),
    }),
  ],
})
export class DatabaseModule {}
