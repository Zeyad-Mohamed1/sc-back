import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateLessonDto {
  @IsNotEmpty({ message: 'يجب ادخال الاسم' })
  @IsString({ message: 'يجب ادخال الاسم بصيغة صحيحة' })
  name: string;

  @IsNotEmpty({ message: 'يجب ادخال الوصف' })
  @IsString({ message: 'يجب ادخال الوصف بصيغة صحيحة' })
  description: string;

  @IsOptional()
  video?: { name: string; url: string; description: string }[];

  @IsNotEmpty({ message: 'يجب ادخال الصورة' })
  @IsString({ message: 'يجب ادخال الصورة بصيغة صحيحة' })
  image: string;
}
