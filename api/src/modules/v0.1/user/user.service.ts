import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseService } from "src/database/database.service";
import { User } from "src/database/entities/user.entity";
import { Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { firstValueFrom, from, Observable, switchMap } from "rxjs";
import { UpdateUserDto } from "./dto/update-user.dto";

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

  updateUserProfile(
    id: string,
    userData: UpdateUserDto
  ): Observable<UpdateResult> {
    const user = this.findById(id);
    return user.pipe(
      switchMap((userDataFromDb) => {
        if (!userDataFromDb) {
          throw new Error("User not found");
        }
        const updatedUserData = {
          ...userDataFromDb,
          bio: userData.bio ?? userDataFromDb.bio,
          img: userData.img ?? userDataFromDb.img,
          sex: userData.sex ?? userDataFromDb.sex,
          birthdate: userData.birthdate ?? userDataFromDb.birthdate,
        };
        return from(this.repository.update(id, updatedUserData));
      })
    );
  }
}
