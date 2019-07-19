
test('unnested test. this test is ok', () => {
  expect('blue').toBe('blue');
});

test('unnested test. this test will fail', () => {
  expect('blue').toBe('green');
});

describe('describe 1', () => {
  it('first nested test. this test is ok', () => {
    expect('green').toBe('green');
  });
  it('second nested test. this test will fail', () => {
    expect('pink').toBe('green');
  });

  describe('describe 2 - contains only broken tests.', () => {
    it('first nested test. this test will fail', () => {
      expect('green').toBe('black');
    });
    it('second nested test. this test will fail', () => {
      expect('pink').toBe('green');
    });
  });
});
