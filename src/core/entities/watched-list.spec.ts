import { WatchedList } from './watched-list'

export class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('watched list', () => {
  it('shold be able to create a watched list with initial values', () => {
    const list = new NumberWatchedList([1, 2, 3])

    expect(list.currentItems).toHaveLength(3)
  })

  it('shold be able to add new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)

    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('shold be able to remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)

    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('shold be able to remove an item even if it was added before', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)
    list.remove(4)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('shold be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update([1, 3, 5])

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5])
  })

  it('shold be able to update watched list items', () => {
    const list = new NumberWatchedList([3, 3, 3])

    list.update([3, 3, 3])

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })
})
