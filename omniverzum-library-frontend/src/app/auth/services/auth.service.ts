import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../../models/user/user.dto';
import { LoginPayloadDto } from '../../models/auth/login-payload.dto';
import { LoginResponseDto } from '../../models/auth/login-response.dto';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userData?: UserDto;
  private token?: string;
  private sessionStorageKey = 'omniverzum-token';

  constructor(private http: HttpClient, private router: Router) {}

  async login(loginPayload: LoginPayloadDto): Promise<void> {
    const loginResponse = await firstValueFrom(this.http.post<LoginResponseDto>('/api/auth/login', loginPayload));
    this.userData = loginResponse.userData;
    this.token = loginResponse.token;
    sessionStorage.setItem(this.sessionStorageKey, this.token);
  }

  async loadUserFromStoredTokenIfPresent(): Promise<boolean> {
    const storedToken = sessionStorage.getItem(this.sessionStorageKey);
    if (!storedToken) {
      this.router.navigate(['/login']);
      return false;
    }

    this.token = storedToken;
    const ownData = await firstValueFrom(this.http.get<UserDto>('/api/auth/own-data'));
    if (ownData) {
      this.userData = ownData;
      return true;
    }

    this.token = undefined;
    this.router.navigate(['/login']);
    return false;
  }

  logout(): void {
    this.userData = undefined;
    this.token = undefined;
    sessionStorage.removeItem(this.sessionStorageKey);
  }

  hasToken(): boolean {
    return this.token !== undefined;
  }

  getToken(): string | undefined {
    return this.token;
  }

  getUserData(): UserDto | undefined {
    return this.userData;
  }

}
