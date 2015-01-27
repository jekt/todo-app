'use strict';

var program = require('commander'),
	redis = require('redis'),
	redisClient = redis.createClient(6379, 'localhost');

redisClient.on("error", function (err){
	console.log(err);
});

var listTasks = function () {
		redisClient.lrange('todoList', 0, -1, function (err, res){
			console.log('\nTO DO:');
			if (res && res.length > 0) {
				res.reverse();
				res.forEach(function(val, i){
					console.log('\t' + (i+1) + '. ' + val);
				});
			} else {
				console.log('\tNothing yet...');
			}
		});
		redisClient.lrange('doneList', 0, -1, function (err, res){
			console.log('\nDONE:');
			if (res && res.length > 0) {
				res.reverse();
				res.forEach(function(val, i){
					console.log('\t' + (i+1) + '. ' + val);
				});
			} else {
				console.log('\tNothing yet...');
			}
		});
	},

	rmTask = function (task){
		if (task && (typeof(task) === 'string')){
			redisClient.lrem('todoList', 1, task, function (err, res){
				console.log(task + ' has been removed!');
				listTasks();
			});
		} else {
			console.log('Please specify the exact name of the task');
		}
	},

	storeTask = function (task){
		if (task && (typeof(task) === 'string')){
			redisClient.lpush('todoList', task, function(err, res){
				console.log('New task added: "' + task + '"');
				listTasks();
			});
		} else {
			console.log('Please specify a valid name for your new task');
		}
	},

	doTask = function (task){
		if (task && (typeof(task) === 'string')){
			redisClient.lrem('todoList', 1, task, function(err, res){
				if (res > 0) {
					console.log('nested');
					redisClient.lpush('doneList', task, function(err, res){
						console.log(task + ' > done, Bravo!');
						listTasks();
					});
				} else {
					console.log('Task doesn\'t exist!');
				}
			});
		} else {
			console.log('Please specify the exact name of the task');
		}
	},

	flushTasks = function (){
		redisClient.flushall(function (){
			console.log('Done list flushed!');
			listTasks();
		});
	};


program
	.command('list')
	.alias('li')
	.description('list tasks in the todo list')
	.action(listTasks);

program
	.command('done [task]')
	.alias('ok')
	.description('mark a task as "done"')
	.action(doTask);

program
	.command('flush')
	.alias('fl')
	.description('flush the whole list')
	.action(flushTasks);

program
	.command('add [task]')
	.alias('new')
	.description('add task in the todo list')
	.action(storeTask);

program
	.version('0.0.1')
	.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
listTasks();
redisClient.quit();