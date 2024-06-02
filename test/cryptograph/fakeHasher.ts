import { HashCompare } from '@/domain/gamefication/aplication/cryptography/hash-compare'
import { HashGenerator } from '@/domain/gamefication/aplication/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashCompare {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
