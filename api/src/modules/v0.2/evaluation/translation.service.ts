import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TranslationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async translateToUkrainian(text: string): Promise<string> {
    const translatorHost = this.configService.get<string>('TRANSLATOR_HOST', 'localhost');
    const translatorPort = this.configService.get<string>('TRANSLATOR_PORT', '8000');

    const translatorUrl = `http://${translatorHost}:${translatorPort}/translate`;

    const response = await firstValueFrom(
      this.httpService.post(translatorUrl, {
        text,
        to: "uk",
      })
    );

    return response.data.translatedText;
  }
}
