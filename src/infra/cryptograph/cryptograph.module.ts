import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/gamefication/aplication/cryptography/encrypter'
import { HashCompare } from '@/domain/gamefication/aplication/cryptography/hash-compare'
import { HashGenerator } from '@/domain/gamefication/aplication/cryptography/hash-generator'

import { BcryptHasher } from './bcrypt-hasher'
import { JWTEncrypter } from './jwt-encrypter'
import { JWTDecrypter } from './jwt-decrypter'
import { Decrypter } from '@/domain/gamefication/aplication/cryptography/decrypter'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JWTEncrypter,
    },
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: Decrypter,
      useClass: JWTDecrypter,
    },
  ],
  exports: [Encrypter, Decrypter, HashCompare, HashGenerator],
})
export class CryptographModule {}
