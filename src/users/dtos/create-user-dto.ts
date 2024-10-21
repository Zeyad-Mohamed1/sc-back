import { IsNotEmpty, Length, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'برجاء ادخال الاسم الاول بصيغة صحيحة' })
  @IsNotEmpty({ message: 'الاسم الاول مطلوب' })
  firstName: string;

  @IsNotEmpty({ message: 'الاسم الاخير مطلوب' })
  @IsString({ message: 'برجاء ادخال الاسم الاخير بصيغة صحيحة' })
  lastName: string;

  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @IsString({ message: 'برجاء ادخال كلمة المرور بصيغة صحيحة' })
  password: string;

  @IsNotEmpty({ message: 'رقم الطالب مطلوب' })
  @IsString({ message: 'برجاء ادخال رقم الطالب بصيغة صحيحة' })
  @Length(11, 11, { message: 'يجب ان يكون رقم الطالب 11 رقم' })
  studentNumber: string;

  @Length(11, 11, { message: 'يجب ان يكون رقم ولي الامر 11 رقم' })
  @IsNotEmpty({ message: 'رقم ولي الامر مطلوب' })
  @IsString({ message: 'برجاء ادخال رقم ولي الامر بصيغة صحيحة' })
  parentNumber: string;

  @IsNotEmpty({ message: 'المحافظة مطلوبة' })
  @IsString({ message: 'برجاء ادخال المحافظة بصيغة صحيحة' })
  governorate: string;

  @IsNotEmpty({ message: 'السنة الدراسية مطلوبة' })
  @IsString({ message: 'برجاء ادخال السنة الدراسية بصيغة صحيحة' })
  yearOfStudy: string;
}
