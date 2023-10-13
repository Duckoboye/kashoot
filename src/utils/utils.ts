export const config = {
    port: process.env.PORT || 5000,
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  };
  
export function generateCode (length: number) {
      let result = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      for (let i = 0; i < length; i++) {
        let randomChar = chars[Math.floor(Math.random() * chars.length)];
        result += randomChar;
      }
      return result;
  };
