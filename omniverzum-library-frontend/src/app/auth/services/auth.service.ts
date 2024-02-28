import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../../models/user/user.dto';
import { LoginPayloadDto } from '../../models/auth/login-payload.dto';
import { LoginResponseDto } from '../../models/auth/login-response.dto';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userData?: UserDto;
  private token?: string;

  constructor(private http: HttpClient) { }

  async login(loginPayload: LoginPayloadDto): Promise<void> {
    const loginResponse = await firstValueFrom(this.http.post<LoginResponseDto>('/api/auth/login', loginPayload));
    this.userData = loginResponse.userData;
    this.token = loginResponse.token;
  }

  logout(): void {
    this.userData = undefined;
    this.token = undefined;
  }

  hasLoggedInUser(): boolean {
    return this.token !== undefined;
  }

  getToken(): string | undefined {
    return this.token;
  }

}
