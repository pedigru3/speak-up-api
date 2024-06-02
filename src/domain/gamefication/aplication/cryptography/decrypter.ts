export abstract class Decrypter {
  abstract decrypt(token: string): Promise<Record<string, unknown>>
}
