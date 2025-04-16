import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  getImageSrc(base64OrPrefixed: string | null | undefined): string | null {
    if (!base64OrPrefixed) return null;

    return base64OrPrefixed.startsWith('data:image')
      ? base64OrPrefixed
      : `data:image/jpeg;base64,${base64OrPrefixed}`;
  }
}
