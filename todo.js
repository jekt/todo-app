'use strict';

var program = require('commander'),
	colors = require('colors'),
	fs = require('fs');

var listTasks = function () {
		fs.exists('todo.json', function (exists) {
			console.log('\n*** TO DO LIST ***'.bold);
		  	if (exists){
		  		fs.readFile('todo.json', 'utf8', function (err, data) {
				  	if (err) throw err;
				  	data = JSON.parse(data);
				  	for (var i=0,x=data.length; i<x; i++){
				  		console.log(((data[i].status === 'TO DO') ?
				  				(data[i].status).red :
				  				(data[i].status).green) + 
				  			'\t' + (i+1) + '. '+ data[i].name);
				  	}
		  			console.log('\n');
				})
		  	} else {
		  		console.log('\tNothing yet...\n'.yellow);
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
				  		if (edited[i].status === 'DONE') {
				  			edited.splice(i, 1);
				  			i--;
				  			x--;
				  		}
				  	}
				  	if (edited !== data){
					  	fs.writeFile('todo.json', JSON.stringify(edited), function (err) {
						  	if (err) throw err;
							console.log('Done tasks have been removed\n'.green);
						});	
				  	} else {
				  		console.log('Nothing done yet...\n'.yellow);
				  	}
				});
		  	} else {
		  		console.log('\tNothing to do...\n'.yellow);
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
					  	data.push({'name': task, 'status': 'TO DO'});
					  	fs.writeFile('todo.json', JSON.stringify(data), function (err) {
						  	if (err) throw err;
							console.log(('New task added: "' + task + '"\n').green);
						});	
					})
			  	} else {
			  		fs.writeFile('todo.json', JSON.stringify([{'name': task, 'status': 'TO DO'}]), function (err) {
						if (err) throw err;
						console.log(('New task added: "' + task + '"\n').green);
					});	
			  	}
			});
		} else {
			console.log('\/\!\\ Please specify a valid name for your new task\n'.red);
		}
	},

	doTask = function (options){
		if (options.task || options.id){
			fs.exists('todo.json', function (exists) {
			  	if (exists){
			  		fs.readFile('todo.json', 'utf8', function (err, data) {
					  	if (err) throw err;
					  	var edited = JSON.parse(data);
					  	data = JSON.parse(data);
					  	for (var i=0,x=edited.length; i<x; i++){
					  		if ((edited[i].name === options.task) || (i+1 == options.id)) edited[i].status = 'DONE';
					  	}
					  	if (edited !== data){
						  	fs.writeFile('todo.json', JSON.stringify(edited), function (err) {
							  	if (err) throw err;
								console.log(((options.task || options.id) + ' > DONE\n').green);
							});	
					  	} else {
					  		console.log('\/\!\\ The task doesn\'t exist\n'.red);
					  	}
					});
			  	} else {
			  		console.log('\tNothing to do...\n'.yellow);
			  	}
			});
		} else {
			console.log('\/\!\\ Please specify the exact name of the task\n'.red);
		}
	};


program
	.command('list')
	.alias('li')
	.description('list tasks in the todo list')
	.action(listTasks);

program
	.command('done')
	.alias('ok')
	.alias('do')
	.option('-t, --task [task]', 'find by name')
	.option('-i, --id [id]', 'find by id')
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