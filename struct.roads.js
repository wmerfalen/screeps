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
		for(var i in Game.rooms){
			var collection_of_structures = Game.rooms[i].find(FIND_STRUCTURES);
			for(var i in collection_of_structures){
				var current = (collection_of_structures[i]);
				if(current.toString().match(/road/)){
					roads.push({'hits': current.hits,'obj': current});
				}
			}
		}
		if(roads.length <= 0){
			return null;
		}
		var needs_help = null;
		var lowest = 9999;
		for(var i in roads){
			if(lowest > roads[i].hits){
				needs_help = roads[i].obj;
			}
		}
		return needs_help;
	}
};
