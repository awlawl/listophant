Tasks = new Meteor.Collection("tasks");

if (Meteor.isClient) {
	Template.tasktemplate.tasks = function() {
		var tasks = Tasks.find({});
		return tasks;
	};

	Template.tasktemplate.done_checkbox = function() {
		return this.isDone ? 'checked="checked"':''
	};

	Template.tasktemplate.events({
		'click .donecheckbox':function() {
			Tasks.update(this._id,{$set: {isDone:!this.isDone}});
			console.log("updating ");
		}
	});

 
}
if (Meteor.isServer) {
	Meteor.startup(function () {
		console.log("remove all");
		Tasks.remove({});
      		var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      		for (var i = 0; i < names.length; i++) {
			console.log("adding " + names[i]);
        		Tasks.insert({name: names[i], isDone: (i%2)==0});
    		}
  });
		
}
