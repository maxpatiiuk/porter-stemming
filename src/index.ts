/**
 * TypeScript implementation of the Porter-Stemmer algorithm
 */
export function stem(raw: string): string {
  if (raw.length < minLength) return raw;

  let word = raw;
  const firstCharacter = word[0];
  if (firstCharacter === 'y')
    word = firstCharacter.toUpperCase() + word.slice(1);

  word = steps.reduce((word, step) => step(word), word);

  // Turn initial Y back to y
  if (firstCharacter === 'y')
    word = firstCharacter.toLowerCase() + word.slice(1);

  return word;
}

const minLength = 3;
const vowel = '[aeiouy]';
const consonant = '[^aeiou]';
const consonantSequence = `${consonant}[^aeiouy]*`;
const o = new RegExp(`^${consonantSequence}${vowel}[^aeiouwxy]$`, 'u');

/**
 * Try to match a word against a rule
 */
const replace =
  (
    replacements: Readonly<
      Record<
        string,
        | string
        | readonly [condition: (word: string) => boolean, replacement: string]
      >
    >
  ) =>
  (word: string): string => {
    const entries = Object.entries(replacements).sort(
      ([left], [right]) => right.length - left.length
    );
    for (const [suffix, replacement] of entries) {
      if (!word.endsWith(suffix)) continue;
      if (
        Array.isArray(replacement) &&
        !replacement[0](word.slice(0, -suffix.length))
      )
        break;
      return `${word.slice(0, -suffix.length)}${
        Array.isArray(replacement) ? replacement[1] : replacement
      }`;
    }
    return word;
  };

const calculateMeasure = (word: string): number =>
  sum(
    Array.from(word.split(''), (_, index) =>
      !isConsonant(word, index) &&
      index + 1 < word.length &&
      isConsonant(word, index + 1)
        ? 1
        : 0
    )
  );

const sum = (array: readonly number[]): number =>
  array.reduce((sum, value) => sum + value, 0);

const measure =
  (min: number) =>
  (word: string): boolean =>
    calculateMeasure(word) > min;

function isConsonant(word: string, index: number): boolean {
  const vowels = 'aeiou';
  if (vowels.includes(word[index])) return false;
  if (word[index] === 'y')
    return index === 0 ? true : !isConsonant(word, index - 1);
  else return true;
}

const hasVowel = (word: string): boolean =>
  Array.from(word.split('')).some((_, index) => !isConsonant(word, index));

const steps: readonly ((word: string) => string)[] = [
  // Step 1a
  replace({
    sses: 'ss',
    ies: 'i',
    ss: 'ss',
    s: '',
  }),
  // Step 1b
  (word): string => {
    if (word.endsWith('eed')) return replace({ eed: [measure(0), 'ee'] })(word);
    const updated = replace({ ed: [hasVowel, ''], ing: [hasVowel, ''] })(word);
    if (updated === word) return word;
    const replaced = replace({
      at: 'ate',
      bl: 'ble',
      iz: 'ize',
    })(updated);
    if (replaced !== updated) return replaced;

    if (
      replaced.at(-1) === replaced.at(-'dd'.length) &&
      isConsonant(replaced, replaced.length - 1) &&
      !['l', 's', 'z'].some((letter) => replaced.endsWith(letter))
    )
      return replaced.slice(0, -1);

    if (calculateMeasure(replaced) === 1 && o.test(replaced))
      return `${replaced}e`;
    return replaced;
  },
  // Step 1c
  replace({
    y: [hasVowel, 'i'],
  }),
  // Step 2
  replace({
    ational: [measure(0), 'ate'],
    tional: [measure(0), 'tion'],
    enci: [measure(0), 'ence'],
    anci: [measure(0), 'ance'],
    izer: [measure(0), 'ize'],
    abli: [measure(0), 'able'],
    alli: [measure(0), 'al'],
    entli: [measure(0), 'ent'],
    eli: [measure(0), 'e'],
    ousli: [measure(0), 'ous'],
    ization: [measure(0), 'ize'],
    ation: [measure(0), 'ate'],
    ator: [measure(0), 'ate'],
    alism: [measure(0), 'al'],
    iveness: [measure(0), 'ive'],
    fulness: [measure(0), 'ful'],
    ousness: [measure(0), 'ous'],
    aliti: [measure(0), 'al'],
    iviti: [measure(0), 'ive'],
    biliti: [measure(0), 'ble'],
    logi: [measure(0), 'log'],
    bli: [measure(0), 'ble'],
  }),
  // Step 3
  replace({
    icate: [measure(0), 'ic'],
    ative: [measure(0), ''],
    alize: [measure(0), 'al'],
    iciti: [measure(0), 'ic'],
    ical: [measure(0), 'ic'],
    ful: [measure(0), ''],
    ness: [measure(0), ''],
  }),
  // Step 4
  (word): string => {
    const newWord = replace({
      al: [measure(1), ''],
      ance: [measure(1), ''],
      ence: [measure(1), ''],
      er: [measure(1), ''],
      ic: [measure(1), ''],
      able: [measure(1), ''],
      ible: [measure(1), ''],
      ant: [measure(1), ''],
      ement: [measure(1), ''],
      ment: [measure(1), ''],
      ent: [measure(1), ''],
      ou: [measure(1), ''],
      ism: [measure(1), ''],
      ate: [measure(1), ''],
      iti: [measure(1), ''],
      ous: [measure(1), ''],
      ive: [measure(1), ''],
      ize: [measure(1), ''],
    })(word);
    if (newWord !== word) return newWord;
    return (word.endsWith('tion') || word.endsWith('sion')) &&
      measure(1)(word.slice(0, -'ion'.length))
      ? word.slice(0, -'ion'.length)
      : word;
  },
  // Step 5a
  (word): string => {
    if (!word.endsWith('e')) return word;
    const stem = word.slice(0, -1);
    const measure = calculateMeasure(stem);
    return measure > 1 || (measure === 1 && !o.test(stem)) ? stem : word;
  },
  // Step 5b
  (word): string =>
    word.endsWith('ll') && measure(1)(word.slice(0, -1))
      ? word.slice(0, -1)
      : word,
];
