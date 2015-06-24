EM = {
	events: {},
	on: function(eventName, handler, context) { // add event handlers
		if(eventName && handler && context)
		{
			if(!this.events[eventName]) {
				this.events[eventName] = [];
			}
			var guid = this.guid();
			this.events[eventName][guid] = { action: handler, context: context || this };

			return guid; // return the guid so the handler can be retrieved later
		}
		else
		{
			console.info('An event name, a valid function, and the function\'s context are required');
			return undefined;
		}
	},
	emit: function() {
		var args = Array.prototype.slice.call(arguments);
		if(args.length == 0) {
			console.info('At least one argument must be passed to emit.');
			return false;
		}
		else if(this.events[args[0]]) {
			var handler;
			for(var item in this.events[args[0]]) {
				handler = this.events[args[0]][item];
				handler.action.apply(handler.context || this, args.slice(1, args.length));
			}
			return true;
		}
		else {
			console.info('No event by the name', args[0], 'found.');
		}
	},
	delete: function(eventName, guid) {
		if(eventName || guid) {
			console.info('An event name and a id are required to delete a handler.')
			return false;
		}
		if(this.events[eventName] && this.events[eventName][guid]) {
			delete this.events[eventName][guid];
			return true;
		}
		else {
			console.info('No handler found for', eventName, guid);
			return false;
		}
	},
	guid: function() { // generates random guid
		var result=[];
		for(var i=0; i<16; i++) {
			result.push(Math.floor(Math.random()*16).toString(16).toUpperCase());
		}
		return result.join('');
	}
};