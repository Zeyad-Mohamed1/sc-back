import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const cookie = request.cookies['token'];

    if (!cookie) {
      throw new UnauthorizedException('برجاء تسجيل الدخول اولا');
    }

    return this.jwtService.verifyAsync(cookie).then((user) => {
      if (user?.isAdmin) {
        return true;
      } else {
        throw new UnauthorizedException(
          'لا يمكن الوصول لهذه البيانات غير بواسطة الادمن',
        );
      }
    });
  }
}
