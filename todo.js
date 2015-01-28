'use strict';

var program = require('commander'),
	fs = require('fs');

var listTasks = function () {
		fs.exists('todo.json', function (exists) {
			console.log('\nTO DO LIST:');
		  	if (exists){
		  		fs.readFile('todo.json', 'utf8', function (err, data) {
				  	if (err) throw err;
				  	data = JSON.parse(data);
				  	for (var i=0,x=data.length; i<x; i++){
				  		console.log('\t' + (i+1) + '. ' + data[i].name + ' > ' + data[i].status);
				  	}
		  			console.log('\n');
				})
		  	} else {
		  		console.log('\tNothing yet...\n');
		  	}
		});
	},

	flushDoneTask = function (){
		fs.exists('todo.json', function (exists) {
		  	if (exists){
		  		fs.readFile('todo.json', 'utf8', function (err, data) {
				  	if (err) throw err;
				  	var edited = JSON.parse(data);
				  	data = JSON.parse(data);
				  	for (var i=0,x=edited.length; i<x; i++){
				  		if (edited[i].status === 'done') {
				  			edited.splice(i, 1);
				  			i--;
				  			x--;
				  		}
				  	}
				  	if (edited !== data){
					  	fs.writeFile('todo.json', JSON.stringify(edited), function (err) {
						  	if (err) throw err;
							console.log('Done tasks have been removed\n');
						});	
				  	} else {
				  		console.log('Nothing done yet...\n');
				  	}
				});
		  	} else {
		  		console.log('\tNothing to do...\n');
		  	}
		});
	},

	storeTask = function (task){
		if (task && (typeof(task) === 'string')){
			fs.exists('todo.json', function (exists) {
			  	if (exists){
			  		fs.readFile('todo.json', 'utf8', function (err, data) {
					  	if (err) throw err;
					  	data = JSON.parse(data);
					  	data.push({'name': task, 'status': 'to do'});
					  	fs.writeFile('todo.json', JSON.stringify(data), function (err) {
						  	if (err) throw err;
							console.log('New task added: "' + task + '"\n');
						});	
					})
			  	} else {
			  		fs.writeFile('todo.json', JSON.stringify([{'name': task, 'status': 'to do'}]), function (err) {
						if (err) throw err;
						console.log('New task added: "' + task + '"\n');
					});	
			  	}
			});
		} else {
			console.log('Please specify a valid name for your new task\n');
		}
	},

	doTask = function (task){
		if (task && (typeof(task) === 'string')){
			fs.exists('todo.json', function (exists) {
			  	if (exists){
			  		fs.readFile('todo.json', 'utf8', function (err, data) {
					  	if (err) throw err;
					  	var edited = JSON.parse(data);
					  	data = JSON.parse(data);
					  	for (var i=0,x=edited.length; i<x; i++){
					  		if (edited[i].name === task) edited[i].status = 'done';
					  	}
					  	if (edited !== data){
						  	fs.writeFile('todo.json', JSON.stringify(edited), function (err) {
							  	if (err) throw err;
								console.log(task + ' > done\n');
							});	
					  	} else {
					  		console.log('The task doesn\'t exist\n');
					  	}
					});
			  	} else {
			  		console.log('\tNothing to do...\n');
			  	}
			});
		} else {
			console.log('Please specify the exact name of the task\n');
		}
	};


program
	.command('list')
	.alias('li')
	.description('list tasks in the todo list')
	.action(listTasks);

program
	.command('done [task]')
	.alias('ok')
	.alias('do')
	.description('mark a task as "done"')
	.action(doTask);

program
	.command('flush')
	.alias('fl')
	.description('flush the whole list')
	.action(flushDoneTask);

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