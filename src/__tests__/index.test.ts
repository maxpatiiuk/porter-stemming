import { stem } from '../index';
import stemmerTest from './fixtures.json';

/**
 * Test cases are coming from https://tartarus.org/martin/PorterStemmer/voc.txt
 * and https://tartarus.org/martin/PorterStemmer/output.txt
 */
stemmerTest.forEach(([input, output]) =>
  test(`${input} -> ${output}`, () => expect(stem(input)).toBe(output))
);
