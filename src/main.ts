import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:4200",
      "https://monitorlaboratorios.netlify.app",
    ],
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // quita campos extra
      transform: true, // convierte tipos (string->number, etc.)
    })
  );

  // Swagger solo en no-prod (opcional)
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Monitor de Laboratorios API")
      .setDescription(
        "Endpoints del MVP (usuarios, labs, horarios, reservas, registros)."
      )
      .setVersion("1.0.0")
      .addBearerAuth() // para JWT
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(
    process.env.PORT ? parseInt(process.env.PORT) : 3000,
    "0.0.0.0"
  );
}
bootstrap();
