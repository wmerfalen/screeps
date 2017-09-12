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
            u.memset(creep,'energy_full','0');
        }
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.carry.energy < creep.carryCapacity && creep.memory.energy_full == '0'){
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
        }else{
			/** Find the next available heal */
			var roads = require('struct.roads');
			var needs_help = roads.getNextHeal();
			if(!needs_help.pos.isNearTo(creep)){
				creep.say('moving');
				console.log(needs_help);
				creep.moveTo(needs_help);
			}else{
				var ret=0;
				/* AHOR = Attempting Heal On Road */
				creep.say('ahor');
				console.log(needs_help.hits);
				switch(ret = creep.repair(needs_help)){
					case 0: break;
					default: this.log(['unhandled return:',ret].join(''));break;
					case ERR_INVALID_TARGET:
						this.log(needs_help.toString());
						this.log('invalid target');break;
					case ERR_NOT_IN_RANGE:
						this.log(['moving to ',needs_help.toString()].join(''));
						creep.moveTo(needs_help);
						break;
					case ERR_NOT_ENOUGH_RESOURCES:
						this.log("Not enough resources");
						break;
				}
			}
		}
		return;
};
module.exports = roleRepairMang;
