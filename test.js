const test = require('tape');
const pausableInterval = require('./index');

test('pausableInterval(50) sends 5 times then we pause it', function(t) {
  t.plan(6);

  const expected = [0, 1, 2, 3, 4];

  let talkback;
  function observe(type, data) {
    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      t.equals(data, expected.shift(), 'interval sent data');
      if (expected.length === 0) {
        talkback(1);
      }
      return;
    }
  }

  pausableInterval(50)(0, observe);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 600);
});

test('pausableInterval(50) can be resumed after it was paused', function(t) {
  t.plan(6);

  const expectedPart1 = [0, 1, 2];
  const expectedPart2 = [3, 4];

  let talkback;
  function observe(type, data) {
    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      if (expectedPart1.length) {
        t.equals(data, expectedPart1.shift(), 'interval sent data');
        if (expectedPart1.length === 0) {
          talkback(1); // pause
          setTimeout(() => talkback(1), 400); // resume
        }
      } else if (expectedPart2.length) {
        t.equals(data, expectedPart2.shift(), 'interval sent data');
        if (expectedPart2.length === 0) {
          talkback(2); // dispose
        }
      } else {
        t.fail('should not happen');
      }
    }
  }

  pausableInterval(50)(0, observe);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 900);
});

test('pausableInterval(50) sends 5 times then we dispose it', function(t) {
  t.plan(6);

  const expected = [0, 1, 2, 3, 4];

  let talkback;
  function observe(type, data) {
    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      t.equals(data, expected.shift(), 'interval sent data');
      if (expected.length === 0) {
        talkback(2);
      }
      return;
    }
  }

  pausableInterval(50)(0, observe);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 600);
});

test('pausableInterval(1000) can be disposed before anything is sent', function(t) {
  t.plan(1);

  let talkback;
  function observe(type, data) {
    if (type === 0) {
      talkback = data;
      setTimeout(() => {
        talkback(2);
        t.pass('disposed');
      }, 200);
      return;
    }
    if (type === 1) {
      t.fail('data should not be sent');
      return;
    }
  }

  pausableInterval(1000)(0, observe);
});
