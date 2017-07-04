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
    recent_type: null,
    has_seen_events: [],
    has_seen_add: function(type){
        has_seen_events.push(type);
    },
    has_seen: function(type){
        return this.has_seen_events.find(function(ele){ return ele == type; });
    },
    add: function(type,callback){
        if(!this.registry.hasOwnProperty(type)){
            this.registry[type] = [callback];
        }else{
            this.registry[type].push(callback);
        }
        this.recent_type = type;
        return this;
    },
    addEventListener: function(type,callback){
        return this.add(type,callback);
    },
    trigger: function(type,data){
        if(!this.registry.hasOwnProperty(type)){
            return false;
        }
        var results = [];
        this.has_seen_add(type);
        for(var i in this.registry[type]){
            results.push({'func': this.registry[type][i].toString(), 'return_data' : this.registry[type][i](data)});
        }
        return results;
    },
    trigger_unless: function(type,callback){
        if(callback(this)){
            return;
        }else{
            return this.trigger(type,data);
        }
    }
};
