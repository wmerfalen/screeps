/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */

/*
 * UPDATES
 * - Builders repair roads
 * - Builders build construction sites that are closest to the source they are mining
 * - Harvesters use the source closest to the spawn
 */
/*
 * TODO:
 * - Builders need to repair walls
 * - Prevent overcrowding the sources
 * - Have upgraders use the source closest to the controller
 * - Create "run once" code 
 * - Create priority queue
 * - Finish cron class
 */

var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var tower = require('role.tower');
var roleTowerFeeder = require('role.towerFeeder');
var roleUpgrader = require('role.upgrader');
var priority = require('priority');
var config = require('config');
var general = require('functions.general');
var controller = require('struct.controller');
var cron = require('cron');

var roleTower = new tower();
var spawnPoint = function(){};

spawnPoint.prototype.constructor = function(){ };
spawnPoint.prototype = {
    UPGRADER: 1,
    TOWER_FEEDER: 2,
    BUILDER: 3,
    HARVESTER: 4,
    spawnPoint: Game.spawns.Spawn1,
    creepCount: {},
    creeps: function(){
        var spawner = this;
        return { 
            'harvester': {
                'runner': new roleHarvester(),
                'counter': function(){
                    if(spawner.creepCount['harvester'] == 0){
                        var harvesterAttempt = spawner.spawn('harvester');
                        switch(harvesterAttempt){
                            case ERR_NOT_ENOUGH_ENERGY:
                                if(spawner.count('harvester') == 0){
                                    //We have zero harvesters and not enough energy to spawn a harvester. We must switch roles for a few units
                                    //Grab the first two units we find and turn them into harvesters
                                    var ctr = 0;
                                    for(var i in Game.creeps){
                                        Game.creeps[i].memory.role = 'harvester';
                                        if(++ctr == 2){
                                            break;
                                        }
                                    }
                                }
                                break;
                            default:
                                console.log("Unhandled harvesterAttempt: " + harvesterAttempt);
                                break;
                        }
                    }
                    return 2;
                }
            },
            'towerFeeder': {
                'runner': new roleTowerFeeder(),
                'counter': function(){
                    if(roleTower.count()){
                        return 2;
                    }else{
                        return 0;
                    }
                }
            },
            'upgrader': {
                'runner': new roleUpgrader(),
                'counter': function(){
                    return 2;
                }
            },
            'builder': {
                'runner': new roleBuilder(),
                'counter': function(){
                    return 4;
                }
            }
        };
    },
    clearCount: function(){
        for(var i in Game.creeps){
            this.creepCount[Game.creeps[i].memory.role] = 0;
        }
    },
    count: function(type){
        var count = 0;
        if(Game.creeps.length == 0){
            return 0;
        }
        for(var i in Game.creeps){
            if(Game.creeps[i].memory.role == type){ count++; }
        }
        return count;
    },
    spawn: function(type){
        var c = this.creeps()[type];
        if(typeof c == 'undefined'){
            console.log("Cannot spawn, creep undefined");
            return -1;
        }else{
            console.log("Spawning creep: " + type);
            return this.spawnPoint.createCreep(c['runner'].roleTemplate(),type + '_' + general.guid(),{role: type});
        }
    },
    run: function(){
        this.clearCount();
        if(Object.keys(Game.creeps).length == 0){
            this.spawn('harvester');
        }
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            var total = Game.creeps.length;
            if(Game.creeps[name].memory.hasOwnProperty('role') == false){
                Game.creeps[name].memory.role = 'harvester';
            }
            this.creepCount[creep.memory.role]++;
            var runner = this.creeps()[creep.memory.role]['runner'];
            if(runner.preDispatch(creep)){
                runner.run(creep);
            }
            console.log(name);
        }

        for(var i in this.creeps()){
            
            console.log("I: " + i + "::" + this.creepCount[i] + " < " + this.creeps()[i].counter());
            
            if(typeof this.creepCount[i] == 'undefined' || this.creepCount[i] < this.creeps()[i].counter()){
                console.log("Spawning: " + i);
                this.spawn(i);
            }
        }
        //If not ran, run init on this room
        for(var i in Game.rooms){
            config.init(Game.rooms[i]);
        }
        
        //TODO: Find a better way to do this
        var room = config.room();
        
        priority.check();
        roleTower.run(room);
        (new cron).run(room);

    },
    spawnCost: function(role)
	{
		var manager = require('roleManager');
		var parts = [];

		var total = 0;
		for(var index in parts)
		{
			var part = parts[index];
			switch(part)
			{
				case Game.MOVE:
					total += 50
					break;

				case Game.WORK:
					total += 20
					break;

				case Game.CARRY:
					total += 50
					break;

				case Game.ATTACK:
					total += 100
					break;

				case Game.RANGED_ATTACK:
					total += 150
					break;

				case Game.HEAL:
					total += 200
					break;

				case Game.TOUGH:
					total += 5
					break;
			}
		}

		return total;
	}

};

module.exports = spawnPoint;