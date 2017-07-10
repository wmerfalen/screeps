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
var roleTowerFeeder = function(){
    parent.call(this);
}

roleTowerFeeder.prototype = Object.create(parent.prototype);

roleTowerFeeder.prototype.constructor = roleTowerFeeder;
roleTowerFeeder.prototype.run = function(creep) {
    
        //TODO: finish this code to make it work for tower feeders
        return;
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
            var ret = creep.harvest(sources[config.harvesterSource(creep)]);
            if( ret == ERR_NOT_IN_RANGE) {
                console.log("harvester - moving to source");
                creep.moveTo(sources[config.harvesterSource(creep)]);
            }else{
                switch(ret){
                    case ERR_INVALID_TARGET:
                        console.log("Invalid source passed to creep[harvester]... searching..");
                        
                }
                console.log("Harvest unhandled return: " + ret);
            }
            return;
        }
	    if(creep.carry.energy < creep.carryCapacity && creep.carry.energy) {
	        console.log("harvester carry energy < carry capacity");
	        //If we were in the middle of a transfer, attempt to offload to another extension
	        if(creep.memory.energy_full){
	            //Move to the next extension
	            var nextExt = ext.nextEnergyQueue(creep);
	            if(nextExt !== null){
	                creep.memory.transfering = true;
	                var r= creep.transfer(nextExt,RESOURCE_ENERGY);
	                if(r == ERR_NOT_IN_RANGE){
	                    creep.moveTo(nextExt);
	                    return;
	                }
	                if(r == ERR_FULL){
	                    console.log("harvester recursion");
	                    this.run(creep);
	                    return;
	                }
	            }
	        }
        }else {
            if(creep.memory.energy_fallback !== false){
                var energyFallback = ext.nextEnergyQueue(creep);
                var r = creep.transfer(energyFallback,RESOURCE_ENERGY);
                if(r == ERR_NOT_IN_RANGE){
                    console.log("harvester moving to energy fallback");
                    creep.moveTo(energyFallback);
                    return;
                }
                
            }
            var transferReturn = 0;
            console.log("harvester transfering to spawn");
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
                    console.log("harvester - moving to spawn");
                    creep.moveTo(spawn);
                    break;
                default:
                    console.log("Unhandled creep.transfer:" + transferReturn);
                    break;
            }
        }
	};
roleTowerFeeder.prototype.maxCreep = function(){	
    //TODO: dynamically calculate the number of required harvesters
    return 4;
};
roleTowerFeeder.prototype.getSpawnWeight = function(){
    var spawnWeight = 0;
    
    if(creepFunc.getCreepCount('harvester') < 2){
        spawnWeight += 6;
    }

    return spawnWeight;
}	

module.exports = roleTowerFeeder;
