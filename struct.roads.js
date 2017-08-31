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
			var collection_of_roads = Game.rooms[i].find(FIND_STRUCTURES);
			for(var i in collection_of_roads){
				var current = (collection_of_roads[i]);
				console.log(current);
				return current;
			}
		}
	}
};
