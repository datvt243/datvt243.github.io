import { BaseModel } from './BaseModel'

export class HeroModel extends BaseModel {
  firstName = ''
  lastName = ''
  positionDesired = 'A frontend developer'
  introduction = ''
  email = ''
  openToWork = false

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim()
  }
}
