/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('struct.extension');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    nextEnergyQueue: function(creep){
        var energyFallback = creep.room.find(FIND_MY_STRUCTURES);
        for(var i in energyFallback){
            if(energyFallback[i].structureType == STRUCTURE_EXTENSION){
                if(energyFallback[i].energy < energyFallback[i].energyCapacity){
                    return energyFallback[i];
                }
            }
        }
        return null;
    },
	count: function(room){
		var util = require('util');
		if(util.defined(room)){
			var count = 0;
			var energyFallback = room.find(FIND_MY_STRUCTURES);
			for(var i in energyFallback){
				if(energyFallback[i].structureType == STRUCTURE_EXTENSION){
					++count;
				}
			}
			return count;
		}else{
			return null;
		}
	},
};
