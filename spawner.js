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

/* Roles */
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleTowerFeeder = require('role.towerFeeder');
var roleUpgrader = require('role.upgrader');
var roleRepairMang = require('role.repairMang');
/* Structs */
var tower = require('role.tower');
var controller = require('struct.controller');
/* Conceptual */
var priority = require('priority');
var config = require('config');
var general = require('functions.general');
var cron = require('cron');
var constants = require('constants');
var events = require('events')
var spawnPoint = function(){};
var roomMemory = require('room.memory');
var roleTower = new tower();

spawnPoint.prototype.constructor = function(){ };
spawnPoint.prototype = {
    UPGRADER: 1,
    TOWER_FEEDER: 2,
    BUILDER: 3,
    HARVESTER: 4,
    spawnPoint: function(){
		return Game.spawns.Spawn1;
	},
    creepCount: {},
    creepTypes: function(){
		/* Right idea, but hard-coded to fail */
        return {
            'harvester':{
                'controller_level': 0
            },
            'upgrader': {
                'controller_level': 0
            },
            'builder': {
                'controller_level': 0
            },'towerFeeder': {
                'controller_level': 5   //TODO: this isn't correct, find out what the real value is
            },
        };
    },
    creepTypesArray: ['harvester','upgrader','builder','towerFeeder'],
    'eventHandler': events,
    'trigger_handler': function(type,event_name,extra_data){
        if(type == 'trigger_unless' && event_name == 'spawn_full'){
            this.eventHandler.trigger('spawn_new','harvester');
        }
    },
    trigger: function(event_type,data){
        return this.trigger_handler('trigger',this.eventHandler.trigger(event_type,data));
    },
    print: function(foo){
       console.log(['{spawner}',foo.toString()].join(':')); 
    },
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
            },
			'repairMang': {

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
	max_creep: {
		'harvester': 3,
		'upgrader':3,
		'builder': 5,
		'repairMang': 2,
	},
	healers: ['repairMang'],
    spawn: function(type){
		var base = [WORK,CARRY,MOVE];
		if(this.count(type) < this.max_creep[type]){
			var _controller = require('struct.controller');
			var controller = new _controller();
			var ext = require('struct.extension');
			
			if(controller.level() > 2 && ext.count()){
				var energy = ext.total_energy();
				var ctr = 0;
				var max_iterations = 5;
				while(energy > 0 && max_iterations-- > 0){
					if(( ctr == 0 && type == 'harvester') || 
					   ( ctr > 2 && type == 'harvester')){
						base.push(MOVE);
						energy -= MOVE;
						ctr++;
						continue;
					}
					if(ctr == 1 && type == 'harvester'){
						base.push(WORK);
						energy -= WORK;
						ctr++;
						continue;
					}
					if(ctr == 2 && type == 'harvester'){
						base.push(CARRY);
						energy -= CARRY;
						ctr++;
						continue;
					}
				}
			}
			if(this.healers.indexOf(type) !== -1){
				var ret = this.spawnPoint().createCreep([WORK,CARRY,HEAL,MOVE],[type,'_',general.guid()].join(''),{role: type});
			}else{
				var ret = this.spawnPoint().createCreep(base,[type,'_',general.guid()].join(''),{role: type});
				switch(ret){
					case 0:
						this.log('zero spawn');break;
					default:
						this.log(['unhandled spawn return:',ret,' of type:',type,' with base:',base.join(':')].join(''));break;
				}
			}
		}
    },
	once_ran : false,
	exterminate_leftovers: function(){
		for(var i in this.max_creep){
			if(this.count(i) > this.max_creep[i]){
				for(var k in Game.creeps){
					if(Game.creeps[k].memory.role == i){
						Game.creeps[k].suicide();
						return;
					}
				}
			}
		}
	},
	run_once_per_turn: function(){
		if(this.once_ran){ return; }
		this.exterminate_leftovers();
		/** Give each type a chance to spawn a creep if need be */
		for(var i in this.max_creep){
			this.spawn(i);
		}
		this.once_ran = true;
	},
    run: function(){
        this.clearCount();
		this.run_once_per_turn();
        if(Object.keys(Game.creeps).length == 0){
            this.print('spawning new harvester');
            this.spawn('harvester');
        }
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            var total = Game.creeps.length;
            if(typeof Game.creeps[name].memory.role == 'undefined'){
                this.print('setting creep role to harvester');
                Game.creeps[name].memory.role = 'harvester';
            }
			var runner = {};
			switch(creep.memory.role){
				case 'builder': 
            		runner = new roleBuilder(creep);
					break;
				case 'upgrader': 
            		runner = new roleUpgrader(creep);
					break;
				case 'repairMang':
					runner = new roleRepairMang(creep);
					break;
				default:	/* Purposeful fall-through behaviour */
				case 'harvester': 
            		runner = new roleHarvester(creep);
					break;
			}


            if(runner.preDispatch(creep)){
                var status = runner.run(creep);
                if(status){
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
                        this.print('trigger: ' + status.trigger);
                        return this.trigger_handler('trigger',this.eventHandler.trigger(status.trigger,status.trigger_data));
                    }
                    if(status.hasOwnProperty('trigger_unless')){
                        this.print('trigger_unless event: ' + status.trigger_type);
                        return this.trigger_handler('trigger_unless',status.trigger_type,status.trigger_unless_cb,this.eventHandler.trigger_unless(status.trigger_type,status.trigger_unless_cb));
                    }
                }
            }
        }

        //FIXME: Find a better way to do this
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
			switch(part) {
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
