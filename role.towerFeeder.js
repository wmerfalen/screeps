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
var roleTower = require('role.tower');
var parent = require('role.parent');

var roleTowerFeeder = function(){};
roleTowerFeeder.prototype = Object.create(parent.prototype);

//roleTowerFeeder.prototype.constructor = function(){};
roleTowerFeeder.prototype.run = function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[config.harvesterSource]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[config.harvesterSource]);
            }
        }
        else {
            var tower = new roleTower();
            var towers = tower.getAllTowers(config.room());
            var target = null;
            for(var i in towers){
                //TODO: Which tower is lowest? Go to that one as a priority
                if(towers[i].energy < towers[i].energyCapacity){
                    target = towers[i];
                    break;
                }
            }

            if(target === null){
                creep.memory.role = 'upgrader';
                return;
            }
            
            var r = creep.transfer(target,RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
                return;
            }
            
            if(r != 0){
                console.log('towerFeeder: unhandled return type:' + r);
            }
        }
	};

module.exports = roleTowerFeeder;