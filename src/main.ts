import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["https://TU-SITIO.netlify.app"],
    credentials: true,
  });
  await app.listen(
    process.env.PORT ? parseInt(process.env.PORT) : 3000,
    "0.0.0.0"
  );
}
bootstrap();
