/*global define*/
'use strict';
//General Midi instrument
define(['./Instrument', './Note'],
function(Instrument ,  Note){
  var GMInstrument = function(context)
  {
    Instrument.call(this, context);
    this.sustain = 0.0;
    this.voices = 32;
    this.modulation = 0.0;
    this.bank = 0;
    this.volume = 1.0;
  };
  
  GMInstrument.prototype = Object.create(Instrument.prototype);
  GMInstrument.prototype.constructor = GMInstrument;
  
  GMInstrument.prototype.update = function(midi)
  {
    Instrument.prototype.update.call(this);
    var m = {
      type: midi[0],
      key: midi[1],
      mag: midi[2]
    };
    //console.log(m.type,m.key,m.mag);
    switch(m.type)
    {
      case 0x90://down
        if(m.mag !== 0)
        {
          this.noteOn(m.key, m.mag);
        }
        else
        {
          this.noteOff(m.key, m.mag);
        }
        break;
      case 0x80://up
        this.noteOff(m.key, m.mag);
        break;
      case 0xb0:
        switch(m.key)
        {
          case 0://Bank Select
            this.bank = m.mag;
            break;
          case 1://Modulation Depth
            this.modulation = m.mag/127;
            break;
          case 7://Volume
            this.volume = m.mag/127;
            break;
          case 64://Sustain
            this.sustain = m.mag/127;
            break;
        }
        this.sustain = m.mag;
        //this.noteOff();
        break;
      case 0xe0://pitch bend (current key?)
        this.bend = m.mag;
        break;
    }
  };
  
  return GMInstrument;
});
