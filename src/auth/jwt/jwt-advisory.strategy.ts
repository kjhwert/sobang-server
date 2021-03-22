import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../../module/type/common';
import { Code } from '../../module/entities/code.entity';

@Injectable()
export class JwtAdvisoryStrategy extends PassportStrategy(
  Strategy,
  'jwt-advisory',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  validate(payload: IJwtPayload) {
    if (payload.type.id !== Code.ADVISORY) {
      throw new UnauthorizedException('', '자문단 회원이 아닙니다.');
    }

    return payload;
  }
}
