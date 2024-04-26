import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/aplication/cryptography/encrypter'
import { HashCompare } from '@/domain/aplication/cryptography/hash-compare'
import { HashGenerator } from '@/domain/aplication/cryptography/hash-generator'

import { BcryptHasher } from './bcrypt-hasher'
import { JWTEncrypter } from './jwt-encrypter'

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
  ],
  exports: [Encrypter, HashCompare, HashGenerator],
})
export class CryptographModule {}
