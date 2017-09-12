module.exports = {
	defined: function(f){ return !(typeof f === 'undefined'); },
	mem: function(creep,member){
		if(!this.defined(creep[member])){ return null; }
		return creep.memory[member];
	},
	memset: function(creep,member,value){
		if(!this.defined(creep)){ return null; }
		creep.memory[member] = value;
		return 1;
	},
};
