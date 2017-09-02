var config = require('config');
var scale = require('scale');
var funcCreep = require('functions.creep');
var walls = require('struct.walls');
var parent = require('role.parent');
var roads = require('struct.roads');

var roleBuilder = function(){};
roleBuilder.prototype = Object.create(parent.prototype);
roleBuilder.prototype.constructor = function(creep){
	parent.call(this);
	this.creep = creep;
};

roleBuilder.prototype.run = function(creep) {
    if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
    }
    
    if(creep.memory.building) {
        //Attempt to find the closest construction site
        var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        
        if(targets){
            if(creep.build(targets) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets);
            }
        }else if(w = walls.getNextHeal(creep.room)){
            if(creep.repair(w) == ERR_NOT_IN_RANGE){
                creep.moveTo(w);
            }
        }else{ 
            //If no construction sites, start healing roads
            console.log("No construction sites. Healing roads");
			
            var road = roads.getNextHeal(creep.room);
            if(creep.repair(road) == ERR_NOT_IN_RANGE){
                creep.moveTo(road);
            }
        }
    } else {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[config.builderSource(creep)]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[config.builderSource(creep)]);
        }
    }
};

roleBuilder.prototype.maxCreep = function(){
    return 4;
}
	
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

roleBuilder.prototype.getSpawnWeight = function(){
    var creepCount = funcCreep.getCreepCount('builder');
    if(creepCount >= this.maxCreep()){
        return 0;
    }
    return 4;

}
module.exports = roleBuilder;
