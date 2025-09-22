import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Laboratorio") // usa el nombre EXACTO de tu tabla
export class Laboratorio {
  @PrimaryGeneratedColumn({ name: "LaboratorioID", type: "int" })
  id: number;

  @Column({ name: "Nombre", type: "varchar", length: 100 })
  nombre: string;

  @Column({ name: "Ubicacion", type: "varchar", length: 200, nullable: true })
  ubicacion?: string;
}
