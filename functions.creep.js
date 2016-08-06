/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('functions.creep');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    firstCreep: function(){
        for(var i in Game.creeps){
            return Game.creeps[i];
        }
        return null;
    },
    getCreepCount: function(type){
        var count = 0;
        for(var i in Game.creeps){
            if(Game.creeps[i].memory.role == type){ count++; }
        }
        return count;
    }
};