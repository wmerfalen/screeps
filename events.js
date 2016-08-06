/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('events');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    registry: {},
    add: function(type,callback){
        if(!this.registry.hasOwnProperty(type)){
            this.registry[type] = [callback];
        }else{
            this.registry[type].push(callback);
        }
    },
    trigger: function(type,data){
        if(!this.registry.hasOwnProperty(type)){
            return false;
        }
        for(var i in this.registry[type]){
            return this.registry[type](data);
        }
    }
};