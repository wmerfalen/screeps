/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('struct.walls');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    getNextHeal: function(room){
        var walls = room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_WALL}});

        if(walls.length){
            for(var i in walls){
                var wall = walls[i];

                if(wall.hits < wall.hitsMax && wall.hits < 10000){
                    return wall;                
                    
                }
            }
        }
        return null;
    }
};