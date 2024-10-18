import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Length(11, 11, { message: 'Student number must be 11 digits' })
  studentNumber: string;

  @Length(11, 11, { message: 'Parent number must be 11 digits' })
  @IsNotEmpty()
  parentNumber: string;

  @IsNotEmpty()
  governorate: string;

  @IsNotEmpty()
  yearOfStudy: string;
}
