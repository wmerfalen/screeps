/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */

var config = require('config');
var scale = require('scale');
var funcCreep = require('functions.creep');
var walls = require('struct.walls');
var parent = require('role.parent');
var roads = require('struct.roads');

var roleTower = function(){};
roleTower.prototype = Object.create(parent.prototype);
//roleTower.prototype.constructor = function(){};

roleTower.prototype.run = function(room) {
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        var towers = room.find( 
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        if(hostiles.length > 0) {
            console.log("INVADERS: " + hostiles.length);
            //var username = hostiles[0].owner.username;
            //Game.notify('User ' + username + ' spotted in room');
            var hostile = null;
            for(var b in hostiles){
                hostile = hostiles[b];
                break;
            }
            for(var t in towers){
                var ret = towers[t].attack(hostile);
            }
            return;
        }
        
        var w = walls.getNextHeal(config.room());
        if(w===null){  }
        else{
            for(var i in towers){
                var ret = towers[i].repair(w);
            }
        }
        
        /* TODO: finish this functionality 
        var heal = roads.getNextHeal(config.room());
        if(heal){
            for(var i in towers){
                console.log("Tower heal: " + towers[i].repair(heal));
            }
        }
        */
        
    };
roleTower.prototype.getAllTowers = function(room){
        var towers = room.find(FIND_MY_STRUCTURES,{filter: {structureType: STRUCTURE_TOWER}});
        return towers;
    };
roleTower.prototype.count = function(){
        return this.getAllTowers(config.room()).length;
    };


module.exports = roleTower;
