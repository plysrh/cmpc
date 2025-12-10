import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  async validateUser(
    userId: string,
  ): Promise<{ id: string; email: string } | null> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      return null;
    }

    return { id: user.id, email: user.email };
  }
}
