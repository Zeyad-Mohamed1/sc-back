import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  async paymentProcess(
    @Query('amount') amount: string,
    @Query('name') name: string,
    @Body('email') email: string,
    @Query('phone_number') phone_number: string,
    @Query('first_name') first_name: string,
    @Query('last_name') last_name: string,
    @Query('course_id') course_id: string,
  ) {
    return await this.paymentsService.createPayment(
      amount,
      first_name,
      last_name,
      email,
      phone_number,
      name,
      course_id,
    );
  }

  @Post('callback')
  async handleCallback(@Body() payload: any): Promise<void> {
    return this.paymentsService.proccessPayment(payload);
  }
}
