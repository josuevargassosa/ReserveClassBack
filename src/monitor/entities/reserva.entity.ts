import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Reserva")
export class Reserva {
  @PrimaryGeneratedColumn({ name: "ReservaID", type: "int" })
  id: number;

  @Column({ name: "LaboratorioID", type: "int" })
  laboratorioId: number;

  @Column({ name: "UsuarioID", type: "int" })
  usuarioId: number;

  @Column({ name: "AsignaturaID", type: "int" })
  asignaturaId: number;

  @Column({ name: "Fecha", type: "date" })
  fecha: string; // 'YYYY-MM-DD'

  @Column({ name: "HoraInicio", type: "time" })
  horaInicio: string; // 'HH:mm:ss'

  @Column({ name: "HoraFin", type: "time" })
  horaFin: string; // 'HH:mm:ss'

  @Column({
    name: "Estado",
    type: "enum",
    enum: ["Pendiente", "Aprobada", "Rechazada"],
    default: "Pendiente",
  })
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}
