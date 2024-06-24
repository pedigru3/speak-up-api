import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'

export interface CardProps {
  studentId: UniqueEntityID
  front: string
  back: string
  createdAt: Date
  readAt?: Date
  nextReadAt: Date
  step: number
}

export class Card extends Entity<CardProps> {
  get studentId() {
    return this.props.studentId
  }

  get front() {
    return this.props.front
  }

  get back() {
    return this.props.back
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt() {
    return this.props.readAt
  }

  get step() {
    return this.props.step
  }

  get nextReadAt() {
    return this.props.nextReadAt
  }

  /**
   * Marks the card as read and updates the step.
   * Also schedules the next read based on the current step.
   */
  public remember(): void {
    this.props.readAt = new Date()
    if (this.props.step < Card.defaultIntervals.length - 1) {
      this.props.step++
    }
    this.scheduleNextRead()
  }

  /**
   * Marks the card as forgotten and updates the necessary properties.
   */
  public forgot(): void {
    this.props.readAt = new Date()
    if (this.props.step > 0) {
      this.props.step--
    }
    this.props.nextReadAt = dayjs().add(20, 'minutes').toDate()
  }

  /**
   * Represents the default intervals schedules for a card.
   */
  private static defaultIntervals: number[] = [
    1, 2, 5, 10, 30, 60, 90, 180, 365,
  ]

  /**
   * Schedule the next read for the card.
   * This method uses a simple algorithm to calculate the next read date based on the current step.
   */
  private scheduleNextRead(): void {
    const intervals = Card.defaultIntervals
    const interval = intervals[Math.min(this.step - 1, intervals.length - 1)]
    this.props.nextReadAt = new Date(
      new Date().setDate(new Date().getDate() + interval),
    )
  }

  static create(
    props: Optional<CardProps, 'createdAt' | 'readAt' | 'step' | 'nextReadAt'>,
    id?: UniqueEntityID,
  ) {
    const card = new Card(
      {
        createdAt: props.createdAt ?? new Date(),
        step: props.step ?? 0,
        nextReadAt: props.nextReadAt ?? dayjs().add(20, 'minutes').toDate(),
        ...props,
      },
      id,
    )

    return card
  }
}
