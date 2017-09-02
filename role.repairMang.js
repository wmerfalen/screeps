/*
 * THe purpose of this file is to serve as a template for when you create a new role. 
 * This is not supposed to be an actual role. There is no role named 'template'.
 * To use this file, copy it to a new role file (i.e.: role.harvester.js) then find and replace
 * all instances of RepairMang with the phrase "harvester". You'll then have a ready to go file.
 */
var gameplan = require('gameplan');
var config = require('config');
var parent = require('role.parent');
var u = require('util');

var roleRepairMang = function(creep){
    parent.call(this);
	this.creep = creep;
	this.class_name = 'repairMang';
};

roleRepairMang.prototype = Object.create(parent.prototype);
roleRepairMang.prototype.constructor = roleRepairMang;
roleRepairMang.prototype.maxCreep = function(){	
    return 4;
};
roleRepairMang.prototype.getSpawnWeight = function(){
    var spawnWeight = 0;
    return spawnWeight;
}	

roleRepairMang.prototype.run = function(creep) {
		creep.say('moo',true);
        var spawn = config.spawn();
        if(!u.defined(spawn)){
            console.log("SPAWN undefined");
        }
        
        if(creep.carry.energy == 0){
            u.memset(creep,'energy_full',false);
        }
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.carry.energy < creep.carryCapacity && !creep.memory.energy_full){
			creep.say('mth');
            var ret = 0;
                switch( ret = creep.harvest(sources[config.repairMangSource(creep)]) ){
                    case ERR_INVALID_TARGET:
                        console.log("Invalid source passed to creep[harvester]... searching..");
						/* Purposeful fall through */
                    case 0:
						creep.say('0');
                        return;
                    case ERR_NOT_IN_RANGE:
						creep.say('mt');
                        creep.moveTo(sources[config.repairMangSource(creep)]);
						break;
                    default:
                        console.log("Harvest unhandled return: " + ret);
                }
            return;
        }

		/** Find the next available heal */
		var roads = require('struct.roads');
		var needs_help = roads.getNextHeal();
		if(!needs_help.pos.isNearTo(creep)){
			creep.say('moving to road');
			creep.moveTo(needs_help);
		}else{
			var ret=0;
			creep.say('ahor');
			switch(ret = creep.heal(needs_help)){
				default: this.log(['unhandled return:',ret].join(''));break;
            	case ERR_NOT_IN_RANGE:
					this.log('not in range.. moving..');
					break;
            	case ERR_NOT_ENOUGH_RESOURCES:
                	this.log("Not enough resources");
					break;
			}
		}
		return;
};
module.exports = roleRepairMang;
