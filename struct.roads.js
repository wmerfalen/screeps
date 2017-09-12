/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('struct.walls');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
	getNextHeal: function(){
		var roads = [];
		var config = require('config');
		config.room().find(FIND_STRUCTURES).forEach(function(i){
			if(i.structureType == 'road'){
				roads.push({'ttd': i.hits, 'obj': i});
			}
		});
		if(roads.length <= 0){
			return null;
		}
		var needs_help = null;
		var lowest = 9999;
		for(var i=0;i < roads.length;i++){
			if(lowest > roads[i].ttd){
				needs_help = roads[i].obj;
				lowest = roads[i].ttd;
			}
		}
		return needs_help;
	}
};
