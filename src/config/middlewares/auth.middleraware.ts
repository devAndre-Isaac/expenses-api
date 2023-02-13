import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Secret, verify } from 'jsonwebtoken';
import authConfig from '../auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

@Injectable()
class AuthMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: (error?: any) => void) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException('JWT Token is missing in Header param');
    }

    const [, token] = authHeader.split(' ');

    try {
      const decodeToken = verify(token, authConfig.jwt.secret as Secret);

      const { sub } = decodeToken as ITokenPayload;

      request.user = {
        id: sub,
      };

      return next();
    } catch {
      throw new BadRequestException('Invalid JWT Token');
    }
  }
}
export default AuthMiddleware;
