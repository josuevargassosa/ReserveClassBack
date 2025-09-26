import { Column } from "typeorm/decorator/columns/Column";
import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity("Asignatura")
export class Asignatura {
  @PrimaryGeneratedColumn({ type: "int", name: "AsignaturaID" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("int", { name: "CarreraID" })
  carreraId: number;
}
