import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  // إنشاء طلب دفع
  async createPayment(
    amount: string,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    name: string,
    course_id: string,
  ) {
    try {
      const parsedAmount = parseFloat(amount) * 100;

      const response = await axios.post(
        `${process.env.PAYMOB_BASE_URL}/v1/intention/`,
        {
          amount: parsedAmount,
          currency: 'EGP',
          payment_methods: [4880904, 4880905],
          items: [
            {
              name,
              amount: parsedAmount,
            },
          ],
          billing_data: {
            first_name,
            last_name,
            phone_number,
          },
          extras: {
            courseId: course_id,
            studentNumber: phone_number,
          },
          expiration: 3600,
        },
        {
          headers: {
            Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
          },
        },
      );

      return {
        url: `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${response.data.client_secret}`,
      };
    } catch (error) {
      console.log(error?.response?.data);
      throw new HttpException('Failed to create payment link with Paymob', 500);
    }
  }
  catch(error) {
    console.log(error);
    throw new HttpException('Failed to create payment link with', 500);
  }

  async proccessPayment(payload: any): Promise<any> {
    try {
      console.log('Received callback:', payload);

      // استخراج البيانات الأساسية من الكول باك
      const transaction = payload.obj;
      const success = transaction.success;
      const studentNumber = transaction.payment_key_claims.extra.studentNumber;
      const courseId = transaction.payment_key_claims.extra.courseId;

      // إذا كانت المعاملة ناجحة، قم بتنفيذ الإجراء المطلوب
      if (success) {
        const user = await this.prisma.user.findUnique({
          where: {
            studentNumber,
          },
        });

        const course = await this.prisma.course.findUnique({
          where: {
            id: courseId,
          },
        });

        if (user && course) {
          await this.prisma.coursesOfUsers.create({
            data: {
              courseId: course.id,
              userId: user.id,
            },
          });
        }
        console.log('Payment successful and course purchased.');
      } else {
        console.log('Payment failed or pending.');
        // التعامل مع حالة الفشل (اختياري)
      }
    } catch (error) {
      console.error('Error handling Paymob callback:', error.message);
      throw new HttpException(
        'Callback handling failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
