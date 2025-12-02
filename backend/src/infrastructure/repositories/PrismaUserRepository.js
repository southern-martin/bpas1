import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { User } from "../../domain/entities/User.js";

export class PrismaUserRepository extends UserRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  toDomain(userRecord) {
    if (!userRecord) return null;
    return new User({
      id: userRecord.id,
      name: userRecord.name,
      role: userRecord.role,
      email: userRecord.email,
      password: userRecord.password
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(u => this.toDomain(u));
  }

  async create(data) {
    const created = await this.prisma.user.create({
      data: {
        name: data.name,
        role: data.role,
        email: data.email ?? null,
        password: data.password ?? null
      }
    });
    return this.toDomain(created);
  }

  async findById(id) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return this.toDomain(user);
  }

  async findByEmail(email) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return this.toDomain(user);
  }
}
