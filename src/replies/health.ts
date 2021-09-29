import { Static, Type } from '@sinclair/typebox'
import { createReplyCallback, createSchema } from './utils'

export const HealthQuerySchema = createSchema(Type.Object({
  time: Type.Integer()
}))
export type THealthQuerySchema = Static<typeof HealthQuerySchema>

export const queried = createReplyCallback<THealthQuerySchema>(
  'APP_HEALTH_QUERIED',
  true
)
