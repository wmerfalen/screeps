/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.parent');
 * mod.thing == 'a thing'; // true
 */
var config = require('config');
var scale = require('scale');    

function parent(){
    
};

parent.prototype.preDispatch = function(creep){
        var spawn = config.spawn();
        if( (creep.memory.renew || creep.ticksToLive <= config.tickWarning()) && spawn.energy > 100){
            console.log("Tick warning on creep: " + creep.id);
            creep.memory.renew = true;
            if(creep.pos.isNearTo(spawn)){
                var ret = spawn.renewCreep(creep);
                if(ret == ERR_FULL){
                    creep.memory.renew = false;
                }
            }else{
                creep.moveTo(spawn);
            }
            return false;
        }
        return true;
    };
parent.prototype.roleTemplate = function(){
	    return scale.getScaledTemplate();
	};

module.exports = parent;