Lists = new Meteor.Collection("lists");
Tasks = new Meteor.Collection("tasks");

if (Meteor.isClient) {
	Template.tasktemplate.tasks = function() {
		var list = Lists.find({}).fetch()[0];
		if (list) {
			
			return Tasks.find({listid:list._id});
			
		}
	};
	Template.tasktemplate.newtask = function() {
		var list = Lists.find({});
		console.dir(list);
		//console.log('count = ' + list.count());

		list.newtask = "new task";
		return list.newtask;
	}

	Template.tasktemplate.done_checkbox = function() {
		return this.isDone ? 'checked="checked"':''
	};

	Template.tasktemplate.events({
		'click .donecheckbox':function() {
			console.dir(this._id);
			Tasks.update(this._id,{$set: {isDone:!this.isDone}});
			console.log("updating ");
		},
		'click .addtask': function() {
			var list = Lists.find({}).fetch()[0];
		
			console.log('new task ' + Template.tasktemplate.find(".addtask").value());
		}

	});

 
}
if (Meteor.isServer) {
	Meteor.startup(function () {
		console.log("remove all");
		Lists.remove({});
      		var taskNames = [
			"Milk",
			"Bread",
			"Chicken",
			"Fruit",
			"Radishes"

		];
		
		var list = {newtask:"new here"};
		Lists.insert(list, function(err, id){ 
			for(var i=0; i<taskNames.length; i++) {
        			Tasks.insert({listid:id, name: taskNames[i], isDone: (i%2)==0});
    			}
		});


  });
		
}
