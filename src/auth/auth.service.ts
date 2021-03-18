import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { responseNotAcceptable, responseOk } from '../module/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return responseNotAcceptable('존재하지 않는 계정입니다.');
    }

    const isCorrect = await user.comparePassword(pass);
    if (!isCorrect) {
      return responseNotAcceptable('비밀번호가 일치하지 않습니다.');
    }

    const {
      status,
      createdAt,
      createdId,
      updatedAt,
      updatedId,
      password,
      type,
      ...rest
    } = user;

    return responseOk({
      ...rest,
      accessToken: this.jwtService.sign({
        id: rest.id,
        email: rest.email,
        type,
      }),
    });
  }
}
