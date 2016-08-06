/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('scale');
 * mod.thing == 'a thing'; // true
 */
var funcCreep = require('functions.creep');
var config = require('config');

module.exports = {
    
    getCurrentExtensions: function(creep){
        var creep = funcCreep.firstCreep();
        if(creep === null){
            return 0;
        }
        var structs = creep.room.find(FIND_MY_STRUCTURES,{
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        return structs.length;
    },
    getBiggerTemplate: function(){
        return [WORK,WORK,MOVE,MOVE,CARRY,CARRY];
    },
    getNonViolentPriorities: function(){
        return {
            'work': { 
                'weight': 100,
                'priority': 10
            },
            'move': { 
                'weight': 50,
                'priority': 9,
            },
            'carry': {
                'weight': 50,
                'priority': 8
            }
        };
    },
    getScaledTemplate: function(){
        var ext = this.getCurrentExtensions(funcCreep.firstCreep());
        if(ext == 1){
	        return [WORK,MOVE,CARRY,CARRY];
        }
        if(ext >= 2){
            var spawn = 300;
            var extensions = 50;
            var total = spawn + (config.extensionBuildLimit() * extensions);
            var template = this.getBiggerTemplate();
            
            for(var i in template){
                if(template[i] == WORK){
                    total -= 100;
                }
                if(template[i] == MOVE || template[i] == CARRY){
                    total -= 50;
                }
            }
            var limit = config.extensionBuildLimit();
            while(total > 0 && limit-- > 0){
                if((total - 100) >= 0){
                    template.push(WORK);
                    total -= 100;
                }
                if((total - 50) >= 0){
                    template.push(MOVE);
                    total -= 50;
                }
                if((total -100) >= 0){
                    template.push(CARRY);
                    template.push(CARRY);
                    total -= 100;
                }
            }
            return template;
	    }
	    if(ext == 0){
	        return [WORK,CARRY,MOVE];
	    }
    }
};