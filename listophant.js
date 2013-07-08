Lists = new Meteor.Collection("lists");
Tasks = new Meteor.Collection("tasks");

// Creates an event handler for interpreting "escape", "return", and "blur"
  // on a text field and calling "ok" or "cancel" callbacks.
  var make_okcancel_handler = function (options) {
    var ok = options.ok || function () {};
    var cancel = options.cancel || function () {};
    return function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);
      } else if (evt.type === "keyup" && evt.which === 13) {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };
  };

if (Meteor.isClient) {
	var listid = null;

	Template.tasktemplate.tasks = function() {
		var list = Lists.find({}).fetch()[0];
		if (list) {
			listid = list._id;
			return Tasks.find({listid:listid});
			
		}
	};
	
	Template.tasktemplate.done_checkbox = function() {
		return this.isDone ? 'checked="checked"':''
	};

	
	Template.tasktemplate.events({
		'click .donecheckbox':function() {
			console.dir(this._id);
			Tasks.update(this._id,{$set: {isDone:!this.isDone}});
			console.log("updating ");
		},
		
		'keyup #newtask, keydown #newtask, focusout #newtask': make_okcancel_handler({
			ok: function(text,event) {
				saveTask(listid, text);
				event.target.value="";
			},
			cancel: function(text, event) {
				console.log("canceled");
			}
		})
		

	});
	// Returns an event_map key for attaching "ok/cancel" events to
  // a text input (given by selector)
  var okcancel_events = function (selector) {
    return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
  };
  	var eventxx = okcancel_events("#newtask");

  console.log(eventxx);
  
  
  Template.tasktemplate.events[okcancel_events["#newtask"]] = make_okcancel_handler({
	ok: function(text,event) {
		console.log("you typed " + text );
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
        			saveTask(id,taskNames[i]);
    			}
		});


  });
		
}

function saveTask(id, taskName) {
	Tasks.insert({listid:id, name: taskName, isDone: false});
}