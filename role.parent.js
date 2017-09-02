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
var general = require('functions.general');

function my_parent(){
	this.pos = null;
	this.creep = null;
};

my_parent.prototype.preDispatch = function(creep){
    var spawn = config.spawn();
    /* If the number of creeps for this particular role exceeds the max, destroy this creep */
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

/* THis function is not ready for production use yet */
my_parent.prototype.is_stuck = function() {
  if (!this.creep.memory.last) {
    return false;
  }
  if (!this.creep.memory.last.pos2) {
    return false;
  }
  if (!this.creep.memory.last.pos3) {
    return false;
  }
  for (let pos = 1; pos < 4; pos++) {
    if (!this.creep.pos.isEqualTo(this.creep.memory.last['pos' + pos].x, this.creep.memory.last['pos' + pos].y)) {
      return false;
    }
  }
  return true;
};
my_parent.prototype.destroy = function(creep){
    creep.suicide();
};
my_parent.prototype.roleTemplate = function(){
	    return scale.getScaledTemplate();
	};

my_parent.prototype.shift_role = function(creep,type){
    creep.memory.role = type;
}

module.exports = my_parent;
