/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.parent');
 * mod.thing == 'a thing'; // true
 */

function rm(){ };

rm.prototype = {
    set : function(set,val){
        room.memory[set] = val;
    },
    get : function(get){
        if(typeof room.memory[get] == 'undefined'){
            return null;
        }
        return room.memory[get];  
    },
    increment : function(item){
        if(typeof room.memory[item] == 'undefined'){
            room.memory[item] = 1;
        }else{
            room.memory[item] = room.memory.item + 1;
        }
    },
    decrement : function(item){
        if(typeof room.memory[item] == 'undefined'){
            room.memory[item] = -1;
        }else{
            room.memory[item] = room.memory.item - 1;
        }
	},
};

rm.prototype.constructor = rm;

module.exports = rm;
