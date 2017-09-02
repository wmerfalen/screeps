/*
 * THe purpose of this file is to serve as a template for when you create a new role. 
 * This is not supposed to be an actual role. There is no role named 'template'.
 * To use this file, copy it to a new role file (i.e.: role.harvester.js) then find and replace
 * all instances of __TEMPLATE__ with the phrase "harvester". You'll then have a ready to go file.
 */
var gameplan = require('gameplan');
var config = require('config');
var parent = require('role.parent');
var u = require('util');

var role__TEMPLATE__ = function(creep){
    parent.call(this);
	this.creep = creep;
}
role__TEMPLATE__.prototype = Object.create(parent.prototype);
role__TEMPLATE__.prototype.constructor = role__TEMPLATE__;
role__TEMPLATE__.prototype.run = function(creep) {
        var spawn = config.spawn();
        var sources = creep.room.find(FIND_SOURCES);
};
role__TEMPLATE__.prototype.maxCreep = function(){	
    return 4;
};
role__TEMPLATE__.prototype.getSpawnWeight = function(){
    var spawnWeight = 0;
    return spawnWeight;
}	

module.exports = role__TEMPLATE__;
