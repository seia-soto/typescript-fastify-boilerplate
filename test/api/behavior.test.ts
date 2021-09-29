import type { ITapTest } from './project'
import { beforeEach, teardown, test } from 'tap'
import { beforeEachFn, teardownFn } from './project'
import * as replies from '../../src/replies'

beforeEach(beforeEachFn)
teardown(teardownFn)

test('health check', async (t: ITapTest) => {
  const { statusCode, ...response } = await t.context.server.inject({
    url: '/api/v1/health',
    method: 'GET'
  })
  const body: replies.health.THealthQuerySchema = response.json()

  t.equal(statusCode, 200, 'return a status code of 200')
  t.ok(t.context.ajv.compile(replies.health.HealthQuerySchema)(body), 'return a valid format of response')
})
