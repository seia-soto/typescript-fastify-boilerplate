import { instance } from '../src'
import preferences from '../src/preferences'

const start = async (): Promise<void> => {
  const server = await instance()

  server.listen(preferences.app.port ?? 3000)

  process.on('SIGINT', async () => {
    console.log('gracefully stopping the server')

    await server.close()

    process.exit(0)
  })
}

start()
