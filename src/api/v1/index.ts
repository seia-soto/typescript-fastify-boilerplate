import type { FastifyPluginCallback } from 'fastify'
import { router as health } from './health'

export const router: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(health, { prefix: '/health' })

  done()
}
