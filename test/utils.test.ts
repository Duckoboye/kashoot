import { expect } from 'chai';
import { generateCode } from '../src/utils/utils';

describe('Utils Tests', () => {
  it('should generate a code of the specified length', () => {
    const code = generateCode(6); // Change the length as needed
    expect(code).to.have.lengthOf(6);
  });

  it('should generate a code consisting of uppercase letters and numbers', () => {
    const code = generateCode(6); // Change the length as needed
    expect(code).to.match(/^[A-Z0-9]+$/);
  });
});
