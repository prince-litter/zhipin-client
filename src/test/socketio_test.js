//引入客户端io
import io from 'socket.io-client'

//链接服务器，的带代表连接的socket对象
const socket = io('ws://localhost:4000')

//绑定receiveMessage的监听，来接收服务器发送的消息
socket.on('receiveMsg',function(data) {
    console.log('浏览器接收到消息：', data)
})

//向服务器发送消息
socket.emit('sendMsg', {name: 'abc'})
console.log('浏览器端向服务器发送消息',{name: 'abc'})