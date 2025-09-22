import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Usuario") // nombre exacto de tu tabla
export class Usuario {
  @PrimaryGeneratedColumn({ name: "UsuarioID", type: "int" })
  id: number;

  @Column({ name: "Nombre", type: "varchar", length: 100 })
  nombre: string;

  @Column({ name: "Email", type: "varchar", length: 100, unique: true })
  email: string;

  @Column({
    name: "Rol",
    type: "enum",
    enum: ["Administrador", "Docente", "Coordinador"],
  })
  rol: "Administrador" | "Docente" | "Coordinador";
}
