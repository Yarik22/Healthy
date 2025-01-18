import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseService } from "src/database/database.service";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class UserService extends DatabaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>
  ) {
    super(repository);
  }
  async validateUser(user: CreateUserDto) {
    const candidates = await firstValueFrom(
      this.findByProperty("email", user.email)
    );
    const candidate = candidates?.[0];
    if (candidate) return candidate;
    return firstValueFrom(this.create(user));
  }
}
