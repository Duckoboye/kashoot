enum LogLevel {
    LOG,
    WARN,
    ERROR,
  }
  
  export default class Logger {
    private service: string;
  
    constructor(service: string) {
      this.service = service;
    }
    private getColorForService() {
      const colors = [
        '\x1b[31m',
        '\x1b[33m',
        '\x1b[34m',
        '\x1b[35m',
        '\x1b[36m',
        '\x1b[91m',
        '\x1b[92m',
        '\x1b[93m',
        '\x1b[94m',
        '\x1b[95m',
        '\x1b[96m',
      ];
      let sum = 0;
      for (let i = 0; i < this.service.length; i++) {
        sum += this.service.charCodeAt(i);
      }
    
      // Use the sum to determine the color index
      const colorIndex = Math.abs(sum-this.service.charCodeAt(1)) % colors.length;
    
      return colors[colorIndex];
    }

    private _log(level: LogLevel, text: string) {
      const serviceLabel = `[${this.service.toUpperCase()}]`;
      let logColor = '';
  
      switch (level) {
        case LogLevel.LOG:
          logColor = '\x1b[92m';
          break;
        case LogLevel.WARN:
          logColor = '\x1b[93m';
          break;
        case LogLevel.ERROR:
          logColor = '\x1b[91m';
          break;
      }
  
      console.log(`${this.getColorForService()} ${serviceLabel} ${logColor}${LogLevel[level]}\x1b[0m | ${text}`);
    }
  
    public log(text: string) {
      this._log(LogLevel.LOG, text);
    }
  
    public warn(text: string) {
      this._log(LogLevel.WARN, text);
    }
  
    public error(text: string) {
      this._log(LogLevel.ERROR, text);
    }
  }
    