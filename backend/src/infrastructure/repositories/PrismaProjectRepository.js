import { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";
import { Project } from "../../domain/entities/Project.js";

export class PrismaProjectRepository extends ProjectRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  toDomain(projectRecord) {
    if (!projectRecord) return null;
    return new Project({
      id: projectRecord.id,
      name: projectRecord.name,
      client_id: projectRecord.client_id,
      created_at: projectRecord.created_at
    });
  }

  async create(data) {
    const created = await this.prisma.project.create({
      data: {
        name: data.name,
        client_id: data.client_id
      }
    });
    return this.toDomain(created);
  }

  async findAll() {
    const projects = await this.prisma.project.findMany();
    return projects.map(p => this.toDomain(p));
  }

  async findById(id) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    return this.toDomain(project);
  }

  async update(id, updates) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) return null;
    const updated = await this.prisma.project.update({
      where: { id },
      data: updates
    });
    return this.toDomain(updated);
  }

  async delete(id) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) return null;
    await this.prisma.project.delete({ where: { id } });
    return true;
  }
}
