// eslint-disable-next-line no-undef
const socket = io({
  auth: {
    // eslint-disable-next-line no-undef
    token: localStorage.getItem('x-access-token')
  }
}).connect('http://localhost:6200', { forceNew: true })

// eslint-disable-next-line no-unused-vars
const submitJoin = () => {
  window.event.preventDefault()
  const idChat = document.querySelector('#chat').value

  socket.emit('join-friend', idChat)
  socket.on('message', (mess) => console.log(mess))
}

// eslint-disable-next-line no-unused-vars
const submitMessage = () => {
  window.event.preventDefault()

  const message = document.querySelector('#message').value
  const idChat = document.querySelector('#chat').value

  socket.emit('send-message', message, idChat).on('receive-messages', (messages) => console.log(messages))
}
