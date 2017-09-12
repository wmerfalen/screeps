/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
var scale = require('scale');
var config = require('config');
var parent = require('role.parent');
var controller = require('struct.controller');
var creepFunc = require('functions.creep');
var roleUpgrader = function(){};
roleUpgrader.prototype = Object.create(parent.prototype);
roleUpgrader.prototype.constructor = function(creep){
	parent.call(this);
	this.creep = creep;
};

//roleUpgrader.prototype.constructor = function(){}; 

roleUpgrader.prototype.output = function(msg){
    this.log(this.creep.toString() + "[ " + msg + " ]");
};

roleUpgrader.prototype.run = function(creep) {
    this.creep = creep;
    //this.output("inside upgrader run");
    var sources = creep.room.find(FIND_SOURCES);

    if((typeof creep.memory['harvesting'] == 'undefined' || creep.memory['harvesting'] == false) && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
        //this.output("moving to upgrade controller: ");
        creep.moveTo(creep.room.controller);
    }
    if(creep.carry.energy == 0 || creep.memory['harvesting']){
        if(creep.harvest(sources[config.upgraderSource(creep)]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[config.upgraderSource(creep)]);
        }
        creep.memory['harvesting'] = true;
    }
    if(creep.carry.energy == creep.carryCapacity){
        creep.memory['harvesting'] = false;
    }
};

roleUpgrader.prototype.maxCreep = function(){
    return 4;
}

roleUpgrader.prototype.getSpawnWeight = function(){
    var c = new controller();
    var rcl = c.level();
    var ctrl = c.get();
    var spawnWeight = 0;
    var upgraderCount = creepFunc.getCreepCount('upgrader');
    if(ctrl.ticksToDowngrade <= 100){
        spawnWeight += 10;
    }
    if(upgraderCount == 0){
        spawnWeight += 3;
    }
    if(creepFunc.invasion()){
        spawnWeight |= SPAWN_INVASION_DISPOSABLE;
        spawnWeight = spawnWeight * -1;
    }
    if(upgraderCount >= this.maxCreep()){
        return 0;
    }
    return spawnWeight;
}

module.exports = roleUpgrader;
