/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleManager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
	roleExists: function(role){
		try
		{
			require("roles." + role);
			return true;
		}
		catch(e)
		{
			return false;
		}
	},
};