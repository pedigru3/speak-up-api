import { Either, left, rigth } from './either'

function doSomething(x: boolean): Either<string, string> {
  if (x) {
    return rigth('success')
  } else {
    return left('error')
  }
}

test('success result', () => {
  const successResult = doSomething(true)

  expect(successResult.isRigth()).toEqual(true)
})

test('error result', () => {
  const errorResult = doSomething(false)

  expect(errorResult.isLeft()).toEqual(true)
})
