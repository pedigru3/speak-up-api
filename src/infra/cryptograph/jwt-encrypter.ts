import { Encrypter } from '@/domain/gamefication/aplication/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JWTEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }
}
