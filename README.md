# Porter Stemmer

This is a TypeScript implementation
of [The Porter Stemming Algorithm](https://tartarus.org/martin/PorterStemmer/),
a popular and efficient algorithm used for word stemming in information
retrieval and natural language processing.

Word stemming is the process of reducing a word to its base or root form, making
it easier to identify related words and analyze texts more effectively.

## Installation

To install the package, run the following command:

```bash
npm install porterstem
```

## Usage

To use the Porter Stemming Algorithm in your TypeScript or JavaScript project,
simply import the stem function from the package and apply it to a word or an
array of words:

```typescript
import { stem } from 'porterstem';

// Single word
const word = 'running';
const stemmedWord = stem(word);
console.log(stemmedWord); // Output: 'run'

// Array of words
const words = ['jumps', 'jumped', 'jumping'];
const stemmedWords = words.map(word => stem(word));
console.log(stemmedWords); // Output: ['jump', 'jump', 'jump']
```

# About the Porter Stemming Algorithm

The Porter Stemming Algorithm, developed by Martin Porter in 1980, is an
algorithm used for stemming words in the English language. It works by removing
the common morphological and inflectional endings from words, such as plurals,
past tenses, and gerunds.

The algorithm consists of five phases of word reductions applied sequentially.
Each phase contains a set of rules that define how to remove or replace a suffix
based on the word's structure and length. The result is a stemmed word that
represents the base or root form of the input word.

## Meta

Inspired by https://www.npmjs.com/package/stemmer

The algorithm does not use mutation and is type-safe.

No external dependencies.

Correctness is validated using the
[vocabulary](https://tartarus.org/martin/PorterStemmer/voc.txt)
and [output pairs](https://tartarus.org/martin/PorterStemmer/output.txt)
provided by Martin Porter
