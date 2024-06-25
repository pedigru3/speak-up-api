import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterStudentUseCase } from '@/domain/gamefication/aplication/use-cases/students/register-student'
import { StudentAlreadyExistsError } from '@/domain/gamefication/aplication/use-cases/students/errors/student-already-exists-error'
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'
import { randomBytes } from 'crypto'
import { EmailService } from '@/infra/email/email.service'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

class createAccountDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string
}

@ApiTags('auth')
@Controller('/register-student')
export class CreateStudentController {
  constructor(
    private registerStudent: RegisterStudentUseCase,
    private emailService: EmailService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a student account' })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handler(@Body() body: createAccountDto) {
    const { name, email } = createAccountBodySchema.parse(body)

    const password = randomBytes(4).toString('hex')

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isright()) {
      await this.emailService.sendEmail(
        [email],
        'Account created',
        `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:100%;margin:0 auto;padding:20px 0 48px;width:580px">
        <tbody>
            <tr style="width:100%">
                <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                        <tbody>
                            <tr>
                                <td><img alt="Journey Talks" height="80" src="https://static.wixstatic.com/media/175228_a2bf066c86f44efa885cd2ed66d54649~mv2.png/v1/fill/w_282,h_159,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Design%20sem%20nome.png" style="display:block;outline:none;border:none;text-decoration:none"  /></td>
                            </tr>
                        </tbody>
                    </table>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                        <tbody>
                            <tr>
                                <td>
                                    <p style="font-size:32px;line-height:1.3;margin:16px 0;font-weight:700;color:#484848">Welcome Journey Talks</p>
                                    <p style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848">${name}, your journey starts now. Your password is:</p>
                                    <p style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848;padding:24px;background-color:#f2f3f3;border-radius:4px;text-align:center">${password}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                        <tbody>
                            <tr>
                                <td>
                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                                        <tbody style="width:100%">
                                            <tr style="width:100%">
                                                <p style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848;font-weight:700">Precisa de ajuda?</p>
                                                <p style="font-size:14px;line-height:24px;margin:16px 0"><a href="https://journeytalks.com/help" style="color:#ff5a5f;text-decoration:none;font-size:18px;line-height:1.4;display:block" target="_blank">Visite nossa Central de Ajuda</a></p>
                                                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
                                                <p style="font-size:14px;line-height:24px;margin:16px 0;color:#9ca299;margin-bottom:10px">Journey Talks, Inc., 1234 Rua Exemplo, São Paulo, SP 56789-000</p><a href="https://journeytalks.com" style="color:#9ca299;text-decoration:underline;font-size:14px" target="_blank">Relatar um problema</a>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>

        `,
      )
    }

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
