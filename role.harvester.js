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
            if(creep.harvest(sources[config.harvesterSource]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[config.harvesterSource]);
            }
            return;
        }
	    if(creep.carry.energy < creep.carryCapacity && creep.carry.energy) {
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
	                    this.run(creep);
	                    return;
	                }
	            }
	        }
        }else {
            if(creep.memory.energy_fallback !== false){
                var energyFallback = ext.nextEnergyQueue(creep);
                if(energyFallback === null){ 
                    creep.memory.energy_fallback = false;
                    creep.memory.role = 'builder';
                    return; 
                }
                var r = creep.transfer(energyFallback,RESOURCE_ENERGY);
                if(r == ERR_NOT_IN_RANGE){
                    creep.moveTo(energyFallback);
                    return;
                }
                
            }
            var transferReturn = 0;
            switch(transferReturn = creep.transfer(spawn,RESOURCE_ENERGY)){
                case ERR_FULL:
                    creep.memory.energy_fallback = true;
                    creep.memory.energy_full = true;
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(spawn);
                    break;
                default:
                    console.log("Unhandled creep.transfer:" + transferReturn);
                    break;
            }


        }
	};

module.exports = roleHarvester;