/*global define*/
'use strict';
define(['Instrument', 'Note'],
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
    var type = midi[0];
    var key = midi[1];
    var mag = midi[2];
    console.log(type,key,mag);
    switch(type)
    {
      case 0x90://down
        if(mag != 0)
        {
          var note = new Note(key, mag);
          this.noteOn(note);
        }
        else
        {
          this.noteOff(key);
        }
          break;
      case 0x80://up
        this.noteOff(key);
        break;
      case 0xb0:
        switch(key)
        {
          case 0://Bank Select
            this.bank = mag;
            break;
          case 1://Modulation Depth
            this.modulation = mag/127;
            break;
          case 7://Volume
            this.volume = mag/127;
            break;
          case 64://Sustain
            this.sustain = mag/127;
            break;
        }
        this.sustain = mag;
        //this.noteOff();
        break;
      case 0xe0://pitch bend
        this.bend = mag;
        break;
    };
  };
  
  return GMInstrument;
});
