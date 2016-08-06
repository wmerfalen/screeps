var config = require('config');
var scale = require('scale');
var funcCreep = require('functions.creep');
var walls = require('struct.walls');
var parent = require('role.parent');

var roleBuilder = function(){};
roleBuilder.prototype = Object.create(parent.prototype);

roleBuilder.prototype.run = function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{
                var heal = walls.getNextHeal(config.room());
                if(heal){
                    if(creep.repair(heal) == ERR_NOT_IN_RANGE){
                        creep.moveTo(heal);
                        return;
                    }
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[config.builderSource]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[config.builderSource]);
            }
	    }
	};
	
roleBuilder.prototype.shouldSpawn = function(){
        var func = require('functions.creep');
        var creep = func.firstCreep();
        if(creep === null){
            return false;
        }
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(walls.getNextHeal(config.room()) == 0){
            return true;
        }
        return targets.length;
    };

module.exports = roleBuilder;