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
var constants = require('constants');
var events = require('events')
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
    creepTypes: function(){
        return {
            'harvester':{
                'controller_level': 0
            },
            'towerFeeder': {
                'controller_level': 5   //TODO: this isn't correct, find out what the real value is
            },
            'upgrader': {
                'controller_level': 0
            },
            'builder': {
                'controller_level': 0
            }
        };
    },
    'eventHandler': events,
    'trigger_handler': function(type,event_name,extra_data){
        if(type == 'trigger_unless' && event_name == 'spawn_full'){
            this.eventHandler.trigger('spawn_new','harvester');
        }
    },
    creeps: function(){
        var spawner = this;
        console.log("inside spawner");
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
            },
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
        console.log(Game.creeps);
        if(Object.keys(Game.creeps).length == 0){
            this.spawn('harvester');
        }
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            var total = Game.creeps.length;
                console.log('setting creep role to harvester');
                Game.creeps[name].memory.role = 'harvester';
            var runner = this.creeps()[creep.memory.role]['runner'];
            
            this.creepCount[creep.memory.role] = this.count(creep.memory.role);
            if(this.creepCount[creep.memory.role] < runner.maxCreep()){
                if(this.creepTypes(creep.memory.role).controller_level <= creep.room.controller.level){
                    this.spawn(creep.memory.role);
                }
            }
            
            if(this.creepCount[creep.memory.role] > runner.maxCreep()){
                /* Maximum creep count reached for this role. Start killing off newbs */
                while(runner.maxCreep() < this.creepCount[creep.memory.role]){
                    runner.destroy(creep);
                    this.creepCount[creep.memory.role]--;
                }
            }
            if(runner.preDispatch(creep)){
                var status = runner.run(creep);
                if(status){
                    if(status.hasOwnProperty('shift_role')){
                        //TODO: shift the role of this creep. FInd out what needs to be changed memory-wise to make this happen
                       console.log('shift_role stub'); 
                    }
                    if(status.hasOwnProperty('spawn_new')){
                        /* In the example of Harvesters, sometimes the spawn is full. If that's the case and the maxCreep() count
                         * for current harvesters is below whats on the playing field, then spawn a creep. 
                         * NOTE: it does NOT have to be another harvester creep that gets spawned. If we have a full spawn, then
                         * the next viable thing to do might be to spawn an upgrader.
                         */
                        console.log('spawn_new event stub');
                        
                    }
                    if(status.hasOwnProperty('trigger')){
                        //TODO: trigger an event on a listener object
                        /* If spawn is full */
                        console.log('trigger: ' + status.trigger);
                        return this.trigger_handler('trigger',this.eventHandler.trigger(status.trigger,status.trigger_data));
                    }
                    if(status.hasOwnProperty('trigger_unless')){
                        console.log('trigger_unless event: ' + status.trigger_type);
                        return this.trigger_handler('trigger_unless',status.trigger_type,status.trigger_unless_cb,this.eventHandler.trigger_unless(status.trigger_type,status.trigger_unless_cb));
                    }
                }
            }
        }

        var creeps = this.creeps();
        //TODO: repair this functionality 
        /*
        var spawnQueue = new queue();
        //#########################
        //# spawn decision making #
        //#########################
        //If towers exist and energy is low, shift two existing roles to towerFeeders
        //If RCL is >= 5 and RCL <= 6 and towerCount < 2, spawn tower
        //If RCL == 4 spawn extensions
        //If spawn hasn't been fed energy in ten ticks, prioritize spawning harvesters
        //If roads are near destruction, prioritize builders. Priority level is less than harvester priority level
        //If construction sites exist, make sure there are atleast 2 builders
        //===========================================================================================================
        Memory.spawn_check -= 1;
        if(Memory.spawn_check <= 0){
            console.log("Spawn check");
            for(var i in creeps){
                if(creeps[i].runner.getSpawnWeight){
                    spawnQueue.set({'level': creeps[i].runner.getSpawnWeight(), 'type': i});
                }
            }
            
            if(spawnQueue.items.length){
                console.log("Prioritzied spawn: " + spawnQueue.next()['type']);
                this.spawn(spawnQueue.next()['type']);
            }
            Memory.spawn_check = 10;
        }
        */
        
        //TODO: Find a better way to do this
        var room = config.room();
        
        priority.check();
        roleTower.run(room);
        cron.run(room);

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
