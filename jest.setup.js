if (typeof global.AbortSignal === 'undefined') {
  global.AbortSignal = require('abort-controller').AbortSignal;
}
