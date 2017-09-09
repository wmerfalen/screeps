/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.parent');
 * mod.thing == 'a thing'; // true
 */

function rm(){ 
	var config = require('config');
	this.room = config.room();
};

rm.prototype = {
    set : function(set,val){
        this.room.memory[set] = val;
    },
    get : function(get){
        if(typeof this.room.memory[get] == 'undefined'){
            return null;
        }
        return this.room.memory[get];  
    },
    increment : function(item){
        if(typeof this.room.memory[item] == 'undefined'){
            this.room.memory[item] = 1;
        }else{
            this.room.memory[item] = this.room.memory.item + 1;
        }
    },
    decrement : function(item){
        if(typeof this.room.memory[item] == 'undefined'){
            this.room.memory[item] = -1;
        }else{
            this.room.memory[item] = this.room.memory.item - 1;
        }
	},
};

rm.prototype.constructor = rm;

module.exports = rm;
