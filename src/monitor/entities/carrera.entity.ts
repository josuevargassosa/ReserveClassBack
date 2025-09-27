import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Carrera")
export class Carrera {
  @PrimaryGeneratedColumn({ name: "CarreraID" })
  id: number;

  @Column({ name: "Nombre" })
  nombre: string;
}
