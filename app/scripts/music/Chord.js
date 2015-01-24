/*global define*/
'use strict';
define([],
function(){
  var Chord = function(chord)
  {
  };
  
  Chord.notationToNotes = function(name)
  {
    var notes = [];
    if(/[a-gijmnorstuv]/i.test(name))//Unknown
    {
      if(/T|S|V|I/.test(name))//Universal chord
      else if(//.test(name))//Pop chord
      {
        var root = name.match(/^[a-gA-G]/g);
        var quality = name.match(/(?i)maj|min(?-i)|M|m/g);
        var number = name.match(/[ad]|aug|dim|dom|9|11|13/ig);
        var alt = name.match(/#/g);
        var add = name.match(/add ?\d+/g);
      }
      return notes;
      
    }
    else
    {
      return;
    }
  };
  return Chord;
});
