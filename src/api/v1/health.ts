import type { FastifyPluginCallback } from 'fastify'
import * as replies from '../../replies'

export const router: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.route<{ Reply: replies.utils.TReplySchema | replies.health.THealthQuerySchema }>({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: replies.health.HealthQuerySchema
      }
    },
    handler: async () => {
      return replies.health.queried({
        time: Date.now()
      })
    }
  })

  done()
}
