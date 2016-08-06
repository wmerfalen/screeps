/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    builderSource: 1,
    harvesterSource: 0,
    upgraderSource: 1,
    room: function(){
        for(var i in Game.rooms){
            return Game.rooms[i];
        }
    },
    tickWarning: function(){
        return 100;
    },
    extensionBuildLimit: function(){
        return 5;
    },
    room: function(){
        for(var i in Game.rooms){
            return Game.rooms[i];
        }
        
    },
    neutralZoneX: function(){
        return 12;
    },
    neutralZoneY: function(){
        return 28;
    },
    towerFeedersDuringInvasion: function(){
        return 2;
    },
    minimumHarvesters: function(){
        return 2;
    },
    spawn: function(){
        return Game.spawns.Spawn1;
    }
};