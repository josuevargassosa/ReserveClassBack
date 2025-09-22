import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("RegistroUso") // usa el nombre EXACTO de tu tabla
export class RegistroUso {
  @PrimaryGeneratedColumn({ name: "RegistroID", type: "int" })
  id: number;

  @Column({ name: "ReservaID", type: "int", nullable: true })
  reservaId?: number | null;

  @Column({ name: "LaboratorioID", type: "int" })
  laboratorioId: number;

  @Column({ name: "UsuarioID", type: "int" })
  usuarioId: number;

  @Column({ name: "AsignaturaID", type: "int" })
  asignaturaId: number;

  @Column({ name: "Fecha", type: "date" })
  fecha: string; // YYYY-MM-DD

  @Column({ name: "HoraInicio", type: "time" })
  horaInicio: string; // HH:mm:ss

  @Column({ name: "HoraFin", type: "time", nullable: true })
  horaFin?: string | null; // Debe ser NULL al iniciar

  // Si tu tabla tiene más columnas (flags/obs), puedes agregarlas luego.
}
