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
	log_once_per: function(ticks,msg,custom_class){
        if(Game.time % ticks == 0){
			if(this.defined(custom_class)){
				this.log(msg,custom_class);
			}else{
            	this.log(msg);
			}
        }
    },
	log: function(msg,custom_class){
		if(this.defined(custom_class)){
			console.log(['[',custom_class,']',msg].join(':'));
		}else{
			console.log(['[util]',msg].join(':'));
		}
	},
};
