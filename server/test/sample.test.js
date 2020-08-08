const { expectCt } = require('helmet');

describe('sample', () => {
  test('it should execute a jest test', () => {
    expect(2 + 2).toBe(4);
  });
});
