/*global define*/
'use strict';
define(['./Button', './Axis'],
function(Button, Axis){
  const ButtonMap = [
    'b',
    'a',
    'y',
    'x',
    'l1',
    'r1',
    'l2',
    'r2',
    'select',
    'start',
    'l3',
    'r3',
    'up',
    'down',
    'left',
    'right',
    'host'
  ];
  const AxisMap = [
    'ls',
    'rs'
  ];
  var Pad = function(gamepad)
  {
    this.gamepad = gamepad;
    for(let b in gamepad.buttons)
    {
      this[ButtonMap[b]] = new Button(gamepad.buttons[b]);
    }
    for(var a in gamepad.axes)
    {
      this[AxisMap[a]] = new Axis(gamepad.axes, a);
    }
  };
  
  Pad.prototype.update = function()
  {
    for(let p in this)
    {
      if(this[p] instanceof Button)
      {
        this[p].update();
      }
    }
    
  };
  Pad.prototype.poll = function()
  {
    for(let p in this)
    {
      if(this[p] instanceof Button)
      {
        this[p].poll();
      }
      else if(this[p] instanceof Axis)
      {
        this[p].poll();
      }
    }
  };
  
  return Pad;
});
