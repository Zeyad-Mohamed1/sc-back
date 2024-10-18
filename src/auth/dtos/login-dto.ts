import { IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @Length(11, 11, { message: 'Student number must be 11 digits' })
  studentNumber: string;

  @IsNotEmpty()
  password: string;
}
