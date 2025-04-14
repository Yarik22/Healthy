import { Injectable } from '@angular/core';
import { Img } from '../../../types/UserType';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  bufferToBase64(img: Img): string {
    if (img && img.data) {
      const byteArray = new Uint8Array(img.data);
      return `data:image/jpeg;base64,${this.arrayBufferToBase64(byteArray)}`;
    }
    return '';
  }

  base64ToBuffer(base64String: string): Img | null {
    if (!base64String) {
      return null;
    }

    const base64Data = base64String.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteArray = new Array(byteCharacters.length);

    const buffer = Buffer.from(byteArray);

    return { type: 'Buffer', data: buffer };
  }

  private arrayBufferToBase64(arrayBuffer: Uint8Array): string {
    let binary = '';
    const len = arrayBuffer.length;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(arrayBuffer[i]);
    }
    return window.btoa(binary);
  }
}
