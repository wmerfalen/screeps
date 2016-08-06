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
        
        
        //Scan for enemies, if enemies found and tower is up, if two towerFeeders are not spawned, change the roles of two random creeps to towerFeeders
        var towerFeeders = func.getCreepCount('towerFeeder');
        var room = config.room();
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length){
            if(towerFeeders < config.towerFeedersDuringInvasion()){
                //Grab any random creeps and turn them into towerFeeders
                var ctr = 0;
                for(var i in Game.creeps){
                    if(ctr++ == config.towerFeedersDuringInvasion()){
                        break;
                    }
                    Game.creeps[i].memory.role = 'towerFeeder';
                }
                if(ctr < config.towerFeedersDuringInvasion()){
                    
                }
            }
        }else{
            //Non-violent code
            
            //If no construction sites are up
            try{
                if(construction.count() == 0){
                    for(var i in Game.creeps){
                        if(Game.creeps[i].memory.role == 'builder'){
                            Game.creeps[i].memory.role = 'upgrader';
                        }
                    }
                }
            }catch(e){
                
            }
            //If there are no towers
            //if(tower.count() == 0 && )
        }
        
        //If there are no harvesters then switch 2 of the current creeps roles to harvester
        var harvesters = func.getCreepCount('harvester');
        if(harvesters < config.minimumHarvesters()){
            var ctr = 0;
            for(var i in Game.creeps){
                if(ctr++ >= config.minimumHarvesters()){ break; }
                Game.creeps[i].memory.role = 'harvester';
            }
        }
        
        return r;
    },
    shiftAllRoles: function(){
        
    }
};