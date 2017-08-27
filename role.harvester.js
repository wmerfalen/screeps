/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var config = require('config');
var scale = require('scale');
var ext = require('struct.extension');
var parent = require('role.parent');
var creepFunc = require('functions.creep');
var events = require('events');
var roleHarvester = function(){
    parent.call(this);
}

roleHarvester.prototype = Object.create(parent.prototype);

roleHarvester.prototype.constructor = roleHarvester;
roleHarvester.prototype.run = function(creep) {
    
        var spawn = config.spawn();
        if(spawn.energy < spawn.energyCapacity){
                creep.memory.energy_fallback = false;
        }
        if(typeof spawn == "undefined"){
            console.log("SPAWN undefined");
        }
        
        if(creep.carry.energy == 0){
            creep.memory.energy_full = false;
        }
        if(creep.carry.energy < creep.carryCapacity && !creep.memory.energy_full){
            var sources = creep.room.find(FIND_SOURCES);
            var ret = 0;
                switch( ret = creep.harvest(sources[config.harvesterSource(creep)]) ){
                    case ERR_INVALID_TARGET:
                        console.log("Invalid source passed to creep[harvester]... searching..");
                        return;
                    case 0:
                        return;
                    case ERR_NOT_IN_RANGE:
                    case -12:
                        creep.moveTo(sources[config.harvesterSource(creep)]);
						break;
                    default:
                        console.log("Harvest unhandled return: " + ret);
                }
            return;
        }

        switch(transferReturn = creep.transfer(spawn,RESOURCE_ENERGY)){
            case ERR_FULL:
                console.log("harvester - Spawn full");
                creep.memory.energy_fallback = true;
                creep.memory.energy_full = true;
                return {'trigger_type':'spawn_full','trigger_unless': 1,'trigger_unless_cb': function(events_object){
                        if(events_object.has_seen('spawn_not_full')){
                            return false;
                        }else{
                            return true;
                        }
                    }
                };
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(spawn);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                console.log("Not enough resources");
                /* Purpose-ful fall-through behaviour */
            default:
                console.log("Unhandled creep.transfer:" + transferReturn);
                break;
        }
	};
roleHarvester.prototype.maxCreep = function(){	
    //TODO: dynamically calculate the number of required harvesters
    return 4;
};
roleHarvester.prototype.getSpawnWeight = function(){
    var spawnWeight = 0;
    
    if(creepFunc.getCreepCount('harvester') < 2){
        spawnWeight += 6;
    }

    return spawnWeight;
}	

module.exports = roleHarvester;
