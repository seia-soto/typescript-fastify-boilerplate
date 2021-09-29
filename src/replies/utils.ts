import { Type, Static, TSchema, TObject, TString, TBoolean } from '@sinclair/typebox'

export const ReplySchema = Type.Object({
  code: Type.String(),
  success: Type.Boolean(),
  payload: Type.Optional(Type.Unknown())
})
export type TReplySchema = Static<typeof ReplySchema>

/**
 * Build schema dynamically setting reply payload
 *
 * @param innerSchema The schema of the reply payload
 * @returns Dynamically built schema added payload type
 */
export const createSchema = <T extends TSchema>(innerSchema: T): TObject<{
  code: TString,
  success: TBoolean,
  payload: T
}> => {
  return Type.Object({
    code: Type.String(),
    success: Type.Boolean(),
    payload: innerSchema
  })
}

/**
 * Create reply object in system format
 *
 * @param code The response code
 * @param success If response is success or positive
 * @param payload Additional metadata or payload to describe result
 * @returns Reply object in format
 */
export const createReply = <T extends TReplySchema>(code: string, success: boolean, payload?: T['payload']): T => {
  const reply: TReplySchema = {
    code,
    success
  }

  if (typeof payload !== 'undefined') {
    reply.payload = payload
  }

  return reply as T
}

/**
 * Create reply object in system format with callback for additional payload
 *
 * @param code The response code
 * @param success If response is success or positive
 * @returns Callback to create reply with attach additional metadata or payload
 */
export const createReplyCallback = <T extends TReplySchema>(code: string, success: boolean): (payload?: T['payload']) => T => {
  return (payload: T['payload']) => createReply<T>(code, success, payload)
}
