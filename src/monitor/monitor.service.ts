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
import { Carrera } from "./entities/carrera.entity";

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
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Carrera)
    private readonly carreraRepo: Repository<Carrera>
  ) {}

  async getLabs() {
    const rows = await this.labRepo.find();
    return rows.map((r) => ({
      ...r,
    }));
  }

  async getCarreras() {
    return this.carreraRepo.find({ order: { nombre: "ASC" } });
  }

  async getAsignaturas() {
    // get all asignaturas
    const rows = await this.asigRepo.find();
    return rows.map((r) => ({
      ...r,
    }));
  }

  // async getReservas() {
  //   const reservas = await this.reservaRepo.find({
  //     order: { fecha: "ASC", horaInicio: "ASC" },
  //   });
  //   return reservas.map((r) => ({
  //     ...r,
  //     inicioISO: `${r.fecha}T${r.horaInicio}`,
  //     finISO: `${r.fecha}T${r.horaFin}`,
  //   }));
  // }

  async getReservas() {
    const rows = await this.reservaRepo
      .createQueryBuilder("r")
      .leftJoin("laboratorio", "l", "l.LaboratorioID = r.laboratorioId")
      .leftJoin("usuario", "u", "u.UsuarioID = r.usuarioId")
      .leftJoin("asignatura", "a", "a.AsignaturaID = r.asignaturaId")
      .select([
        "r.id        AS id",
        "r.fecha     AS fecha",
        "r.horaInicio AS horaInicio",
        "r.horaFin    AS horaFin",
        "r.estado     AS estado",
        "r.laboratorioId AS laboratorioId",
        "r.usuarioId     AS usuarioId",
        "r.asignaturaId  AS asignaturaId",
      ])
      .addSelect("l.Nombre", "laboratorioNombre")
      .addSelect("u.Nombre", "usuarioNombre")
      .addSelect("a.Nombre", "asignaturaNombre")
      .addSelect(`DATE_FORMAT(r.fecha, '%Y/%m/%d')`, "fechaDisplay")
      .orderBy("r.fecha", "ASC")
      .addOrderBy("r.horaInicio", "ASC")
      .getRawMany();

    return rows.map((r: any) => ({
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

    const conflict = await this.reservaRepo
      .createQueryBuilder("res")
      .where("res.laboratorioId = :lab", { lab: r.laboratorioId })
      .andWhere("res.fecha = :fecha", { fecha: r.fecha })
      .andWhere("res.estado = :estado", { estado: "Aprobada" })
      // solape: nuevoInicio < existenteFin  AND  existenteInicio < nuevoFin
      .andWhere(":nuevoInicio < res.horaFin", { nuevoInicio: r.horaInicio })
      .andWhere("res.horaInicio < :nuevoFin", { nuevoFin: r.horaFin })
      .getOne();

    if (conflict) {
      throw new BadRequestException(`Solapa con reserva #${conflict.id}`);
    }

    await this.reservaRepo.update(id, { estado: "Aprobada" as any });
    return { id, estado: "Aprobada" };
  }

  async rechazarReserva(id: number, motivo?: string) {
    const r = await this.reservaRepo.findOne({ where: { id } });
    if (!r) throw new NotFoundException("Reserva no encontrada");
    await this.reservaRepo.update(id, {
      estado: "Rechazada" as any,
    });
    return { id, estado: "Rechazada", motivo: motivo ?? null };
  }
}
