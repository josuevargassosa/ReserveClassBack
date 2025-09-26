import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw, Repository } from "typeorm";
import { Laboratorio } from "./entities/laboratorio.entity";
import { Reserva } from "./entities/reserva.entity";
import { Usuario } from "./entities/usuario.entity";
import { CrearReservaDto } from "./dto/reservas.dto";
import { Asignatura } from "./entities/signatura.entity";

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(Laboratorio)
    private readonly labRepo: Repository<Laboratorio>,
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    @InjectRepository(Asignatura)
    private readonly asigRepo: Repository<Asignatura>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>
  ) {}

  async getLabs() {
    const rows = await this.labRepo.find();
    return rows.map((r) => ({
      ...r,
    }));
  }

  async getAsignaturas() {
    // get all asignaturas
    const rows = await this.asigRepo.find();
    return rows.map((r) => ({
      ...r,
    }));
  }

  async getReservas() {
    const reservas = await this.reservaRepo.find({
      order: { fecha: "ASC", horaInicio: "ASC" },
    });
    return reservas.map((r) => ({
      ...r,
      inicioISO: `${r.fecha}T${r.horaInicio}`,
      finISO: `${r.fecha}T${r.horaFin}`,
    }));
  }

  async loginByEmail(email: string) {
    const user = await this.usuarioRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException("Usuario no encontrado");
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    };
  }

  async crearReserva(dto: CrearReservaDto) {
    const inicio = new Date(dto.inicioISO);
    const fin = new Date(dto.finISO);
    if (!(inicio < fin))
      throw new BadRequestException("Rango de fechas inválido");

    const fecha = dto.inicioISO.substring(0, 10); // YYYY-MM-DD
    const horaInicio = dto.inicioISO.substring(11, 19); // HH:mm:ss
    const horaFin = dto.finISO.substring(11, 19);

    const reserva = this.reservaRepo.create({
      laboratorioId: dto.laboratorioId,
      usuarioId: dto.usuarioId,
      asignaturaId: dto.asignaturaId,
      fecha,
      horaInicio,
      horaFin,
      estado: "Pendiente",
    });
    const saved = await this.reservaRepo.save(reserva);
    return saved;
  }

  async aprobarReserva(id: number) {
    const r = await this.reservaRepo.findOne({ where: { id } });
    if (!r) throw new NotFoundException("Reserva no encontrada");

    // buscamos solape con aprobadas del mismo laboratorio y misma fecha
    const conflict = await this.reservaRepo.findOne({
      where: {
        laboratorioId: r.laboratorioId,
        fecha: r.fecha,
        estado: "Aprobada" as any,
        // intersección de [inicio, fin)
        horaInicio: Raw(() => "? < HoraFin", [r.horaInicio]),
        horaFin: Raw(() => "HoraInicio < ?", [r.horaFin]),
      },
    });

    if (conflict)
      throw new BadRequestException(`Solapa con reserva #${conflict.id}`);

    await this.reservaRepo.update(id, { estado: "Aprobada" as any });
    return { id, estado: "Aprobada" };
  }

  async rechazarReserva(id: number, motivo?: string) {
    const r = await this.reservaRepo.findOne({ where: { id } });
    if (!r) throw new NotFoundException("Reserva no encontrada");
    await this.reservaRepo.update(id, {
      estado:
        "Rechazada" as any /* puedes guardar motivo si lo tienes en tabla */,
    });
    return { id, estado: "Rechazada", motivo: motivo ?? null };
  }
}
