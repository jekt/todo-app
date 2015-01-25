'use strict';

var program = require('commander'),
	redis = require('redis'),
	//redisClient = redis.createClient(),
	todoList = [],
	i = 0;

/*redisClient.on("error", function (err) {
    console.log("Error " + err);
});*/

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
	.action(function(date, options){
		date = ['today', 'tomorrow', 'upcoming', 'someday'].indexOf(date) > -1 ? date : 'today';
		var include = ['all', 'todo', 'doing', 'done'].indexOf(options.include) > -1 ? options.include : 'all';
		//console.log('List ' + include + ' tasks in the todo list for date: ' + date);
		console.log(todoList);
	});

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
	.action(function(name, options){
		var date = ['today', 'tomorrow', 'upcoming', 'someday'].indexOf(options.date) > -1 ? options.date : 'upcoming',
			priority = ['blocker', 'critical', 'major', 'minor', 'trivial'].indexOf(options.priority) > -1 ? options.priority : 'minor',
			status = 'todo';

		if (typeof(name) === 'string'){
			todoList.push({
				'name': name,
				'date': date,
				'priority': priority,
				'status': status
			});
			console.log('new task: ');
			console.log(todoList[i]);
		} else {
			console.log('Please specify a name for your new task');
		}
	});

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
	.action(function(name, options){
		var newName = options.name;
			newDate = ['today', 'tomorrow', 'upcoming', 'someday'].indexOf(options.date) > -1 ? options.date : 'upcoming',
			newPriority = ['blocker', 'critical', 'major', 'minor', 'trivial'].indexOf(options.priority) > -1 ? options.priority : 'minor';

		if (typeof(name) === 'string'){
			try {
				for (i=0, x=todoList.length; i<x; i++) {
    				if (todoList[i].name === name) {
    					todoList[i].name = newName;
    					todoList[i].date = newDate;
    					todoList[i].priority = newPriority;
    					console.log(name + ' has been edited:');
    					console.log(todoList[i]);
    				}
				}
			} catch (err) {
				throw err;
			}
		} else {
			console.log('Please specify the name of the task');
		}
	});

/** 
 * Mark a task as "done"
 * @param {string} name The name of the task to set as "done"
 */
program
	.command('done [name]')
	.alias('ok')
	.description('mark a task as "done"')
	.action(function(name, options){
		if (typeof(name) === 'string'){
			try {
				for (i=0, x=todoList.length; i<x; i++) {
    				if (todoList[i].name === name) {
    					todoList[i].status = 'done';
    					console.log(name + ' marked as done');
    				}
				}
			} catch (err) {
				throw err;
			}
		} else {
			console.log('Please specify the name of the task');
		}
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
		if (typeof(name) === 'string'){
			try {
				for (i=0, x=todoList.length; i<x; i++) {
    				if (todoList[i].name === name) {
    					todoList[i].status = 'doing';
    					console.log(name + ' marked as doing');
    				}
				}
			} catch (err) {
				throw err;
			}
		} else {
			console.log('Please specify the name of the task');
		}
	});

/** 
 * Delete a task
 * @param {string} name The name of the task to delete
 */
program
	.command('delete [name]')
	.alias('stop')
	.alias('del')
	.description('delete a task')
	.action(function(name, options){
		if (typeof(name) === 'string'){
			try {
				for (i=0, x=todoList.length; i<x; i++) {
    				if (todoList[i].name === name) {
    					console.log(todoList[i].pop() + 'deleted');
    				}
				}
			} catch (err) {
				throw err;
			}
		} else {
			console.log('Please specify the name of the task');
		}
	});

program
	.version('0.0.1')
	.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
  }