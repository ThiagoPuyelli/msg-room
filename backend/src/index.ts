import { App } from './app'

const app = new App().app

app.listen(process.env.PORT || 6200, () => console.log('Server on Port 6200'))
