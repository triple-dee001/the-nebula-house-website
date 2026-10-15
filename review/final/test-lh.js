const http = require('http');
const fs = require('fs');
const path = require('path');
const lighthouse = require('../../../backend/node_modules/lighthouse').default;
const chromeLauncher = require('../../../backend/node_modules/lighthouse').chromeLauncher || require('chrome-launcher');

console.log('Testing Lighthouse module loading...');
console.log('Lighthouse loaded successfully:', typeof lighthouse === 'function');
