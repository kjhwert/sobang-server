import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../../module/type/common';
import { Code } from '../../module/entities/code.entity';

@Injectable()
export class JwtOrganizationStrategy extends PassportStrategy(
  Strategy,
  'jwt-organization',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  validate(payload: IJwtPayload) {
    if (payload.type.id !== Code.ORGANIZATION) {
      throw new UnauthorizedException('', '기관 회원이 아닙니다.');
    }

    return payload;
  }
}
