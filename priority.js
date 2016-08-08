/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('priority');
 * mod.thing == 'a thing'; // true
 */
var func = require('functions.creep');
var config = require('config');
var construction = require('struct.construction');
var tower = require('role.tower');
var roads = require('struct.roads');

module.exports = {
    favorClass: null,
    emergency: false,
    
    check: function(){
        //Do an environment scan and adjust any values based on certain conditions
        var r = {};
        
        //Scan for enemies, if no tower is up what do we do?
        //If we don't have a tower and RCL is < 2, focus more on upgraders
            //Setup a ratio of 3:1 for upgraders:other creeps
        //If we have a tower and RCL < 4, focus on upgraders
            //Setup a ration of 3:1
        //If we have construction sites, add 2 more builders to the builder quota


        var length = Object.keys(Game.creeps).length;
        var half = length / 2;
        var ctr = length;
        var towerFeeders = func.getCreepCount('towerFeeder');
        var room = config.room();
        var hostiles = room.find(FIND_HOSTILE_CREEPS);

        for(var i in Game.creeps){
            if(ctr-- > half){
                Game.creeps[i].memory.source = 0;
            }else{
                Game.creeps[i].memory.source = 1;
            }
            if(hostiles.length){
                if(towerFeeders < config.towerFeedersDuringInvasion()){
                    Game.creeps[i].memory.role = 'towerFeeder';
                    towerFeeders++;
                }
            }
            if(construction.count() == 0 && Game.creeps[i].memory.role == 'builder' && roads.getNextHeal(config.room()) == null){
                Game.creeps[i].memory.role = 'upgrader';
            }else if(construction.count() > 0){
                if(Game.creeps[i].name.match(/^builder/)){
                    Game.creeps[i].memory.role = 'builder';
                }
            }
        }
        
        return 0;
    },
    shiftAllRoles: function(){
        
    }
};