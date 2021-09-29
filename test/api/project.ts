import type { FastifyInstance } from 'fastify'
import type { Test } from 'tap'
import Ajv from 'ajv/dist/2019'
import addFormats from 'ajv-formats'
import { instance } from '../../src'

type TTapTest = typeof Test.prototype

export interface ITapContext {
  server: FastifyInstance
  ajv: Ajv
}
export interface ITapTest extends TTapTest {
  context: ITapContext
}

export const context: Partial<ITapContext> = {}

export const beforeEachFn = async (t: ITapTest) => {
  context.server ??= await instance({
    logger: {
      level: 'info',
      prettyPrint: true
    }
  })
  context.ajv ??= addFormats(new Ajv({}), [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
  ]).addKeyword('kind')
    .addKeyword('modifier')

  t.context = context as ITapContext
}

export const teardownFn = async () => {
  await context.server.close()
}
