process.env.REDIS_URL = 'redis://localhost:6379';

global.fetch = jest.fn();

global.Request = class {};
global.Response = class {};
global.Headers = class {};

if (typeof URL.createObjectURL === 'undefined') {
  Object.defineProperty(URL, 'createObjectURL', { value: jest.fn() });
}