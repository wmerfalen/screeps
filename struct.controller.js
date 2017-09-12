/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('struct.controller');
 * mod.thing == 'a thing'; // true
 */

var config = require('config');
var struct = require('struct.parent');

var controller  = function(){};
controller.prototype = Object.create(function(){});

controller.prototype.constructor = controller;
controller.prototype.get= function(){
        var room = config.room();
        return room.controller;
    };
controller.prototype.level= function(){
        var controller = this.get();
        return controller.level;
    };

module.exports = controller;
