/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config');
 * mod.thing == 'a thing'; // true
 */
require('constants');
module.exports = {
    roleOverride: false,
    builderSource: function(creep){
        //TODO: finish this impl
        return 1;
        return creep.memory.source;
    },
    harvesterSource: function(creep){
		return 0;
        if(creep.memory.hasOwnProperty('source') || creep.memory.source === null){
            var sources = creep.room.find(FIND_SOURCES);
            var ctr = 0;
            for(var i in sources){
                if(sources[i].id == creep.room.memory.harvester_source){
                    creep.memory.source = ctr;
                    return ctr;
                }
                ctr++;
            }
        }
        return creep.memory.source;
    },
    upgraderSource: function(creep){
        //TODO: finishi this impl
        return 1;
        return creep.memory.source;
    },
    room: function(){
        return Game.rooms.pop();
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
    },
    init: function(room){
        //This function should be run once to initialize configuration on a per room basis
        for(var i in Game.creeps){
            Game.creeps[i].memory.source = null;
        }
        //1: find the source that is closest to the spawn
        var spawn = this.spawn();
        var closest = spawn.pos.findClosestByRange(FIND_SOURCES);
        room.memory.harvester_source = closest.id;
        
        var sources = room.find(FIND_SOURCES);
        var sourceRating = [];
        var ctr = 0;
        for(var i in sources){
            //Look at the spaces in the grid around each source
            var x = sources[i].pos.x;
            var y = sources[i].pos.y;
            var around = [ [x -1,y -1], [x,y-1], [x+1,y-1],
                [x-1,y],[x+1,y],
                [x-1,y+1],[x,y+1],[x+1,y+1]
            ];
            
            for(var index in around){
                var lookAt = room.lookAt(around[index][0],around[index][1]);
                for(var l in lookAt){
                    if(lookAt[l]['type'] == 'terrain'){
                        if(lookAt[l]['terrain'] != 'wall'){
                            sourceRating[ctr]++;
                        }
                    }
                }
            }
            ctr++;
        }
        //TODO: implement favored source in all roles
        if(sourceRating[0] > sourceRating[1]){
            room.memory.favor_source = 0;
        }else if(sourceRating[1] > sourceRating[0]){
            room.memory.favor_source = 1;
        }else{
            room.memory.favor_source = 'both';
        }
        
    }
};
