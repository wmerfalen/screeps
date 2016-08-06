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

var roleUpgrader = function(){};
roleUpgrader.prototype = Object.create(parent.prototype);

//roleUpgrader.prototype.constructor = function(){}; 

roleUpgrader.prototype.run = function(creep) {
        var sources = creep.room.find(FIND_SOURCES);

        if((typeof creep.memory['harvesting'] == 'undefined' || creep.memory['harvesting'] == false) && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
            creep.moveTo(creep.room.controller);
        }
        if(creep.carry.energy == 0 || creep.memory['harvesting']){
            if(creep.harvest(sources[config.upgraderSource]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[config.upgraderSource]);
            }
            creep.memory['harvesting'] = true;
        }
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory['harvesting'] = false;
        }
	};

module.exports = roleUpgrader;