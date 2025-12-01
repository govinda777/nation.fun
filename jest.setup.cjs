require('@testing-library/jest-dom');

const { TextEncoder, TextDecoder } = require('util');

// Polyfill Node.js util for Jest environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
