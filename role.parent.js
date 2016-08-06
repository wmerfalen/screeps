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
        if(creep.ticksToLive <= config.tickWarning()){
            console.log("Tick warning on creep: " + creep.id);
        }
    };
parent.prototype.roleTemplate = function(){
	    return scale.getScaledTemplate();
	};

module.exports = parent;