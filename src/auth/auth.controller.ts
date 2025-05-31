import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiResponse } from 'src/common/responses/api.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private sendResponse<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T | null = null,
    errors: string[] | null = null,
  ) {
    const response = new ApiResponse(statusCode, message, data, errors);
    return res.status(statusCode).json(response);
  }

  @Post('register')
  async create(@Body() createAuthDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(createAuthDto);
      return this.sendResponse(
        res,
        HttpStatus.CREATED,
        'successfully registered user',
        user,
      );
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'unknown error';
      return this.sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        'error when registering user',
        null,
        [errorMessage],
      );
    }
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginAuthDto);
      return this.sendResponse(res, HttpStatus.OK, 'successful login', result);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'unknown error';
      return this.sendResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        'invalid credentials',
        null,
        [errorMessage],
      );
    }
  }
}
