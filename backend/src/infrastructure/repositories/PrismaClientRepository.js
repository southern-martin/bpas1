import { ClientRepository } from "../../domain/repositories/ClientRepository.js";
import { Client } from "../../domain/entities/Client.js";
import { Project } from "../../domain/entities/Project.js";

export class PrismaClientRepository extends ClientRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  toDomain(clientRecord) {
    if (!clientRecord) return null;
    const hasProjects = Array.isArray(clientRecord.projects);
    const projects = hasProjects
      ? clientRecord.projects.map(project => new Project({
          id: project.id,
          name: project.name,
          client_id: project.client_id,
          created_at: project.created_at
        }))
      : undefined;

    return new Client({
      id: clientRecord.id,
      name: clientRecord.name,
      phone: clientRecord.phone,
      email: clientRecord.email,
      address: clientRecord.address,
      notes: clientRecord.notes,
      created_at: clientRecord.created_at,
      projects
    });
  }

  async create(clientData) {
    const created = await this.prisma.client.create({
      data: {
        name: clientData.name,
        phone: clientData.phone ?? null,
        email: clientData.email ?? null,
        address: clientData.address ?? null,
        notes: clientData.notes ?? null
      }
    });
    return this.toDomain(created);
  }

  async findAll() {
    const clients = await this.prisma.client.findMany({
      orderBy: { created_at: "desc" }
    });
    return clients.map(client => this.toDomain(client));
  }

  async findById(id) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { projects: true }
    });
    return this.toDomain(client);
  }

  async update(id, updates) {
    const existing = await this.prisma.client.findUnique({ where: { id } });
    if (!existing) return null;

    const updated = await this.prisma.client.update({
      where: { id },
      data: {
        name: updates.name ?? existing.name,
        phone: updates.phone ?? existing.phone,
        email: updates.email ?? existing.email,
        address: updates.address ?? existing.address,
        notes: updates.notes ?? existing.notes
      }
    });
    return this.toDomain(updated);
  }

  async delete(id) {
    const existing = await this.prisma.client.findUnique({ where: { id } });
    if (!existing) return null;
    await this.prisma.client.delete({ where: { id } });
    return true;
  }
}
