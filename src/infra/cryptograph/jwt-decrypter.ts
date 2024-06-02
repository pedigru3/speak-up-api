import { Decrypter } from '@/domain/gamefication/aplication/cryptography/decrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JWTDecrypter implements Decrypter {
  constructor(private readonly jwtService: JwtService) {}

  async decrypt(token: string): Promise<Record<string, unknown>> {
    return this.jwtService.verifyAsync(token)
  }
}
