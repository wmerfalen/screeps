/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.parent');
 * mod.thing == 'a thing'; // true
 */

function rm(){
    this.set = function(set,val){
        room.memory[set] = val;
    };
    this.get = function(get){
        if(typeof room.memory[get] == 'undefined'){
            return null;
        }
        return room.memory[get];  
    };
    this.gameTick = Game.time;
};

rm.prototype = {
    
};

module.exports = rm;
