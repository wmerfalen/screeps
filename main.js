var roleTowerFeeder = require('role.towerFeeder');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTower = require('role.tower');
var spawner = require('spawner');
var events = require('events');
var config = require('config');
var priority = require('priority');
var general = require('functions.general');


function revertRoles(type){
    for(var i in Game.creeps){
        var role = Game.creeps[i].memory.role
        if(role == type && type != Game.creeps[i].memory.override_role){
            Game.creeps[i].memory.override_role = null;
        }
    }
}

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    spawner.run();
}