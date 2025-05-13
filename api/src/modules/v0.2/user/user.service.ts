import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseService } from "src/database/database.service";
import { User } from "src/database/entities/user.entity";
import { Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { firstValueFrom, from, Observable, switchMap } from "rxjs";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ImageService } from "../image/image.service";

@Injectable()
export class UserService extends DatabaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly imageService: ImageService
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
          nickname: userData.nickname,
          bio: userData.bio,
          sex: userData.sex,
          birthdate: userData.birthdate,
        };
        if (userData.img) {
          return from(this.imageService.compressImage(userData.img)).pipe(
            switchMap((compressedImage) => {
              updatedUserData.img = compressedImage;
              return from(this.repository.update(id, updatedUserData));
            })
          );
        } else {
          updatedUserData.img = userDataFromDb.img;
          return from(this.repository.update(id, updatedUserData));
        }
      })
    );
  }
}
