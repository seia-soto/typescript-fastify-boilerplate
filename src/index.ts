import type { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyServerOptions } from 'fastify'
import fastify from 'fastify'
import fastifyNoAdditionalProps from 'fastify-no-additional-properties'
import * as api from './api'

/**
 * Create new server instance
 *
 * @param options The fastify options
 * @returns The fastify instance
 */
export const instance = async (options?: FastifyServerOptions): Promise<FastifyInstance> => {
  const server = fastify(options)

  // NOTE: fastify plug-ins
  server.register(fastifyNoAdditionalProps as FastifyPluginCallback<FastifyPluginOptions>, {
    body: true,
    query: true
  })

  // NOTE: api router
  server.register(api.v1.router, { prefix: '/api/v1' })

  // NOTE: lifecycle hooks
  server.addHook('onClose', async () => {
    console.log('stopping the server')
  })

  return server
}
