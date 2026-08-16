import { BaseModel } from './BaseModel'

export class SocialMediaModel extends BaseModel {
  github = ''
  linkedin = ''
  website = ''

  /** Non-empty entries as `{ name, url }` pairs, ready to iterate/render. */
  get links(): { name: string; url: string }[] {
    return Object.entries(this)
      .filter(([, url]) => typeof url === 'string' && url)
      .map(([name, url]) => ({ name, url: url as string }))
  }
}
