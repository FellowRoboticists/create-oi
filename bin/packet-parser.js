module.exports = (() => {
  const __START_BYTE = 0x13;
  const __LEN_IDX = 1;

  // The packet from which commands are read from the
  // serial port. Remember, with the serial port you
  // may get only partial data, so you will have to gradually
  // piece together a full packet from potentially many
  // buffers.
  var __packet = [];

  const __seek = (buffer) => {
    for (var i = 0; i < buffer.length; i++) {
      if (buffer[i] === __START_BYTE) {
        return i;
      }
    }
    return -1;
  }

  const parse = (buffer) => {
    // index to start reading packet 
    // data, default to invalid value
    var start = -1;  

    if (__packet.length === 0) {
      start = __seek(buffer);
    } else {
      start = 0; // we already have the header stored in __packet, read full buff
    }

    if (start === -1) { // couldn't seek to START_BYTE
      return;    
    }

    // Push the buffer bytes into the packet
    for (var i = start; i < buffer.length; i++) {
      __packet.push(buffer[i]);
    }

    if (__packet.length < 2) {
      // Haven't read the length byte yet; move along
      return;
    }

    if (__packet[__LEN_IDX] === 0) {
      // The length of the packet is 0; clear out and
      // move on.
      __packet = [];
      return;
    }

    // +3 due to START byte, COUNT byte & CHKSUM bytes included with all pkts
    if (__packet.length < (__packet[__LEN_IDX] + 3)) {
      return;
    }

    // extract one whole packet from pkt buffer
    var currPkt = __packet.splice(0, __packet[__LEN_IDX] + 3);

    var chksum = 0;
    for (var i = 0; i < currPkt.length; i++) {
      chksum += currPkt[i];
    }

    chksum = chksum & 0xff;

    if (chksum === 0) {
      return currPkt;
    }
  };

  const reset = () => {
    __packet = [];
  };

  var mod = {

    parse: parse,
    reset: reset

  };

  return mod;
}());
