/*global define*/
'use strict';
define([],
function(){
  
  var Stave = function(name, signature)
  {
    this.name = name || 'Untitled';
    this.signature = signature || '4,4';
    this.bpm = 120;
    this.cleft = Stave.Cleft.G;
    this.notes = [];
  };
  
  //Cleft types
  const Cleft = {
    G: 0,
    C: 1,
    F: 2
  };
  Stave.Cleft = Cleft;
  
  return Stave;
});
