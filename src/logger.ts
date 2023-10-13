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
  
      console.log(`${serviceLabel} ${logColor}${LogLevel[level]}\x1b[0m | ${text}`);
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
    