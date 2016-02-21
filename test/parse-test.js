const test = require('blue-tape');
const parser = require('../bin/packet-parser');

test('parse test whole valid packet', (assert) => {
  var buffer = [ 
    0x13, 
    0x0b, 
    0x07, 0x00, 
    0x13, 0x23, 0x18, 
    0x14, 0x00, 0x00, 
    0x21, 0x01, 0x1f, 
    -200 
  ];

  parser.reset();

  assert.ok(parser.parse(buffer), 
            'Should return the packet');
  assert.end();
});

test('parse incremental', (assert) => {
  var buffer1 = [ 
    0x13, 
    0x0b
  ];
  var buffer2 = [ 
    0x07, 0x00, 
    0x13, 0x23, 0x18, 
    0x14, 0x00, 0x00, 
    0x21, 0x01, 0x1f, 
    -200,
    0x13
  ];

  parser.reset();
  assert.notOk(parser.parse(buffer1),
                             'The packet should not be complete');
  assert.ok(parser.parse(buffer2), 
            'Should return the packet');
  assert.end();
});

test('parse byte at a time', (assert) => {
  parser.reset();
  assert.notOk(parser.parse([ 0x00 ]),
               'Ignore first byte');
  assert.notOk(parser.parse([ 0x13 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x0b ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x07 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x00 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x13 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x23 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x18 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x14 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x00 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x00 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x21 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x01 ]),
               'Keep going');
  assert.notOk(parser.parse([ 0x1f ]),
               'Keep going');
  assert.ok(parser.parse([ -200 ]),
            'Received valid packet');
  assert.end();
});
