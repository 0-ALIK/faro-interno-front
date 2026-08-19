import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { apiConfig } from '../config/api.config';

export interface SignedFile {
  key: string;
  url: string;
  expires: number;
}

interface BatchSignResponse {
  files: SignedFile[];
}

@Injectable({ providedIn: 'root' })
export class FileApi {
  private readonly http = inject(HttpClient);

  batchSign(keys: string[]): Observable<SignedFile[]> {
    if (keys.length === 0) {
      return new Observable((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    return this.http
      .post<BatchSignResponse>(`${apiConfig.baseUrl}/file/batch`, { keys })
      .pipe(map((res) => res.files));
  }

  signSingle(key: string): Observable<string> {
    return this.batchSign([key]).pipe(map((files) => files[0]?.url ?? ''));
  }
}
