import { expect } from 'chai';
import Logger from '../utils/logger';

describe('Logger Tests', () => {
  it('should create a logger instance', () => {
    const logger = new Logger('test');
    expect(logger).to.be.an.instanceOf(Logger);
  });
});
