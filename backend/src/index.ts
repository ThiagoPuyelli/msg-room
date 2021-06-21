import { App } from './app'
import { setSockets } from './sockets'

const server = setSockets(new App().app)

server.listen(process.env.PORT || 6200, () => console.log('Server on Port 6200'))
