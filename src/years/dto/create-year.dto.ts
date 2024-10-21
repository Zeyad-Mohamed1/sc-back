import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
export class CreateYearDto {
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  @IsString({ message: 'برجاء ادخال الاسم بصيغة صحيحة' })
  name: string;

  @IsOptional()
  @IsBoolean({ message: 'برجاء ادخال الحالة بصيغة صحيحة' })
  isActive: boolean;

  @IsNotEmpty({ message: 'الصورة مطلوبة' })
  image: string;
}
