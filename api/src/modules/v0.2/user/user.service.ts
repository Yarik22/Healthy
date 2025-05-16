import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseService } from "src/database/database.service";
import { User } from "src/database/entities/user.entity";
import { FindOneOptions, Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { defer, firstValueFrom, from, Observable, switchMap } from "rxjs";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ImageService } from "../image/image.service";
import { ElasticsearchService } from "@nestjs/elasticsearch";

@Injectable()
export class UserService extends DatabaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly imageService: ImageService,
    private readonly elasticsearchService: ElasticsearchService
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

  findByNickname(nickname: string): Observable<User[]> {
    return from(
      this.elasticsearchService
        .search<User>({
          index: "users",
          query: {
            match: {
              nickname: {
                query: nickname,
                fuzziness: "AUTO",
              },
            },
          },
        })
        .then((res) => res.hits.hits.map((hit) => hit._source))
    );
  }
}
