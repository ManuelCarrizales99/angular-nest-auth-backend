import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../../auth.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private authService:AuthService) {}
  async canActivate( context: ExecutionContext,): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,{secret: process.env.JWT_SEED}
      );
      const user = await this.authService.findUserById(payload.id);
      if( !user ) throw new UnauthorizedException('User does not exist');
      if( !user.isActive ) throw new UnauthorizedException('User does not active');
      request['user'] = user;
    } catch {
      throw new UnauthorizedException('Unverified token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }


}

