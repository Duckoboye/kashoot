//Handles logging. Please refactor me!
generic = {
    express: (text) => {
        console.log(`\x1b[33m[EXPRESS]\x1b[0m ${text}`)
    },
    socketio: (text) => {
        console.log(`\x1b[37m[SocketIO]\x1b[0m ${text}`)
    }
}
log = {
    express: (text) => {
        generic.express(`\x1b[92mLOG |\x1b[0m ${text}`)
    },
    socketio: (text) => {
        generic.socketio(`\x1b[92mLOG |\x1b[0m ${text}`)
    }
}
warn = {
    express: (text) => {
        generic.express(`\x1b[93mWARN |\x1b[0m ${text}`)
    },
    socketio: (text) => {
        generic.socketio(`\x1b[93mWARN |\x1b[0m ${text}`)
    }
}
error = {
    express: (text) => {
        generic.express(`\x1b[91mERROR |\x1b[0m ${text}`)
    },
    socketio: (text) => {
        generic.socketio(`\x1b[91mERROR |\x1b[0m ${text}`)
    }
}
config = {
    port: process.env.PORT || 5000,
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
} 

api = {
    generateCode: (length) => {
        let result = ''
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        for (let i=0; i<length; i++) {
          let randomChar = chars[Math.floor(Math.random()*chars.length)]
          result += randomChar
        }
        return result
      }
}

module.exports = { log, warn, error, config, api }