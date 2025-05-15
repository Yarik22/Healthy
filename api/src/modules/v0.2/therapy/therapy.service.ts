import { Injectable, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Therapy } from "src/database/entities/therapy.entity";
import { DatabaseService } from "src/database/database.service";
import { Observable, defer } from "rxjs";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class TherapyService extends DatabaseService<Therapy> {
  constructor(
    @InjectRepository(Therapy)
    protected readonly repository: Repository<Therapy>,
    @Inject(CACHE_MANAGER)
    protected cacheManager: Cache
  ) {
    super(repository);
  }

  findByIdCached(uuid: string): Observable<Therapy> {
    const cacheKey = `therapy:uuid:${uuid}`;
    return defer(async () => {
      const cached = await this.cacheManager.get<Therapy>(cacheKey);
      if (cached) return cached;

      const therapy = await this.repository.findOne({ where: { uuid } });
      if (!therapy) throw new Error("NotFound");

      await this.cacheManager.set(cacheKey, therapy);
      return therapy;
    });
  }

  findByTitleCached(title: string): Observable<Therapy> {
    const normalizedTitle = title.toLowerCase();
    const cacheKey = `therapy:title:${normalizedTitle}`;
    return defer(async () => {
      const cached = await this.cacheManager.get<Therapy>(cacheKey);
      if (cached) return cached;

      const therapy = await this.repository.findOne({
        where: { title: normalizedTitle },
      });
      if (!therapy) throw new Error("NotFound");
      await this.cacheManager.set(cacheKey, therapy);
      return therapy;
    });
  }
}
