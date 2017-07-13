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
    this.increment = function(item){
        if(typeof room.memory[item] == 'undefined'){
            room.memory[item] = 1;
        }else{
            room.memory[item] = room.memory.item + 1;
        }
    };
    this.decrement = function(item){
        if(typeof room.memory[item] == 'undefined'){
            room.memory[item] = -1;
        }else{
            room.memory[item] = room.memory.item - 1;
        }
    };
};

rm.prototype = {
    
};

module.exports = rm;
