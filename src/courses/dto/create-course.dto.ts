import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'يجب ادخال الاسم' })
  @IsString({ message: 'يجب ادخال الاسم بصيغة صحيحة' })
  name: string;

  @IsNotEmpty({ message: 'يجب ادخال الوصف' })
  @IsString({ message: 'يجب ادخال الوصف بصيغة صحيحة' })
  description: string;

  @IsNotEmpty({ message: 'يجب ادخال السعر' })
  @IsNumber()
  price: number;

  @IsNotEmpty({ message: 'يجب ادخال الصورة' })
  @IsString({ message: 'يجب ادخال الصورة بصيغة صحيحة' })
  image: string;
}
