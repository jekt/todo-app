'use strict';

var program = require('commander'),
	redis = require('redis'),
	redisClient = redis.createClient(6379, 'localhost'),
	todoList = [];

redisClient.on("error", function (err) {
    console.log(err);
});



/** 
 * Get task index from redis
 * @param {string} name The name of the task to get
 * @return {int} The index of the task in the todoList array (-1 if it not exists)
 */
var getTaskIndex = function (name) {
		switch (typeof(name)){
			case 'string':
				try {
					for (var i=0, x=todoList.length; i<x; i++) {
	    				if (todoList[i].name === name) {
	    					return i;
	    				}
					}
				} catch (err) {
					throw err;
				}
				break;

			case 'undefined':
			default:
				console.log('Please specify the name of the task');
				return -1;
		}
	},

/** 
 * Remove tasks from redis
 * @param {string} name The name of the task to remove
 * @return {object} The object containing the wanted task
 */
	rmTask = function (name){
		try {
			var task = todoList.splice(getTaskIndex(name), 1);
			console(task + 'deleted');
		} catch (err) {
			throw err;
		}
	},

/** 
 * Store tasks in redis
 * @param {object} task The object containing the task data
 * @param {string} name The name of the task to replace (optional)
 * @return {array} The array containing all the tasks
 */
	storeTask = function (name, options){
		switch (typeof(options.name)){
			case 'string':
				var index = getTaskIndex(name);
				if (index > -1) {
					console.log(rmTask(todoList[index]));
				} else {
					console.log("Cannot update this task, it doesn't exist");
				}
				break;

			case 'undefined':
			default:
				var name = options.name;
				if (name) {
					var date = ['today', 'tomorrow', 'upcoming', 'someday'].indexOf(options.date) > -1 ? options.date : 'upcoming',
						priority = ['blocker', 'critical', 'major', 'minor', 'trivial'].indexOf(options.priority) > -1 ? options.priority : 'minor',
						status = 'todo';
					console.log(
						todoList.push(
							JSON.stringify({
								'name': name,
								'date': date,
								'priority': priority,
								'status': status
							})
						)
					);
				} else {
					console.log('Please specify a name for your new task');
				}
		}
	},

/** 
 * List tasks stored in redis
 * @return {array} The todoList array
 */
	listTasks = function () {
		console.log(todoList);
	};

/** 
 * List tasks in the todo list
 * @param {string} date List the taks for the date
 * @options {string} -i --include include List option: all, todo, doing, or done
 */
program
	.command('list [date]')
	.alias('li')
	.option('-i, --include [include]', 'list option: all, todo, doing, or done')
	.description('list tasks in the todo list')
	.action(listTasks);
	/*function(date, options){
		date = ['today', 'tomorrow', 'upcoming', 'someday'].indexOf(date) > -1 ? date : 'today';
		var include = ['all', 'todo', 'doing', 'done'].indexOf(options.include) > -1 ? options.include : 'all';
		//console.log('List ' + include + ' tasks in the todo list for date: ' + date);
		console.log(listTasks());
	});*/

/** 
 * Add a new task in the todo list
 * @param {string} name Name of the task
 * @option {date} -d --date date Set a due date for the task
 * @option {string} -p --priority priority Set a priority for the task
 */
program
	.command('add [name]')
	.alias('new')
	.option('-d, --date [date]', 'set a due date for the task')
	.option('-p, --priority [priority]', 'set a priority for the task')
	.description('list tasks in the todo list')
	.action(storeTask);

/** 
 * Edit an existing task
 * @param {string} name The name of the task to edit
 * @option {string} -n --name name Replace the existing name by this one
 * @option {string} -d --date date Replace the existing date by this one
 * @option {string} -p --priority priority Replace the existing priority by this one
 */
program
	.command('edit [name]')
	.alias('update')
	.alias('ed')
	.option('-n, --name [name]', 'edit the name of the task')
	.option('-d, --date [date]', 'edit the due date of the task')
	.option('-p, --priority [priority]', 'edit the priority of the task')
	.description('list tasks in the todo list')
	.action(storeTask);

/** 
 * Mark a task as "done"
 * @param {string} name The name of the task to set as "done"
 */
program
	.command('done [name]')
	.alias('ok')
	.description('mark a task as "done"')
	.action(function(name, options){
		console.log(storeTask);
	});

/** 
 * Mark a task as "doing"
 * @param {string} name The name of the task to set as "doing"
 */
program
	.command('doing [name]')
	.alias('work')
	.alias('do')
	.description('mark a task as "doing"')
	.action(function(name, options){
		console.log(storeTask);
	});

/** 
 * Delete a task
 * @param {string} name The name of the task to delete
 */
program
	.command('delete [name]')
	.alias('del')
	.alias('remove')
	.alias('rm')
	.description('delete a task')
	.action(function(name, options){
		console.log(rmTask);
	});

program
	.version('0.0.1')
	.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
  }