import { Injectable, signal } from '@angular/core';

export interface AppUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  initials: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly user = signal<AppUser>({
    id: 'usr-001',
    name: 'Ana',
    lastName: 'López',
    email: 'ana.lopez@municipiopma.gob.pa',
    role: 'Administradora',
    initials: 'AL'
  });

  readonly currentUser = this.user.asReadonly();
}