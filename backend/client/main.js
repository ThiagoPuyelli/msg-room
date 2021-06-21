// eslint-disable-next-line no-undef
const socket = io({
  auth: {
    // eslint-disable-next-line no-undef
    token: localStorage.getItem('x-access-token')
  }
}).connect('http://localhost:6200', { forceNew: true })

socket.on('saludo', (data) => {
  console.log(data)
})
