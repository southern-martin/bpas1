export class CreateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(payload) {
    return this.userRepository.create({
      name: payload.name,
      role: payload.role,
      email: payload.email ?? null,
      password: payload.password ?? null
    });
  }
}
