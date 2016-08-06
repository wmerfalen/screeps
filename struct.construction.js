/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('struct.construction');
 * mod.thing == 'a thing'; // true
 */

var func = require('functions.creep');

module.exports = {
    nextEnergyQueue: function(creep){
        var constructionFallback = creep.room.find(FIND_CONSTRUCTION_SITES);
        for(var i in constructionFallback){
            if(constructionFallback[i].progress < constructionFallback[i].progressTotal){
                return constructionFallback[i];
            }
        }
        return null;
    },
    count: function(){
        var creep = func.firstCreep();
        return creep.room.find(FIND_CONSTRUCTION_SITES).length;
    }
};