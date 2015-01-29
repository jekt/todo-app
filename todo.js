'use strict';

var program = require('commander'),
	colors = require('colors'),
	fs = require('fs'),
	inquirer = require('inquirer');

var listTasks = function (callback) {
		fs.exists(__dirname + '/todo.json', function (exists) {
			console.log('\n*** TO DO LIST ***'.bold);
		  	if (exists){
		  		fs.readFile(__dirname + '/todo.json', 'utf8', function (err, data) {
				  	if (err) throw err;
				  	data = JSON.parse(data);
				  	for (var i=0,x=data.length; i<x; i++){
				  		console.log(((data[i].status === 'TO DO') ?
				  				(data[i].status).red :
				  				(data[i].status).green) + 
				  			'\t' + (i+1) + '. '+ data[i].name);
				  	}
		  			console.log('\n');
		  			if (callback) callback();
				});
		  	} else {
		  		console.log('Nothing yet...\n'.yellow);
		  		if (callback) callback();
		  	}
		});
	},

	flushDoneTask = function (callback){
		fs.exists(__dirname + '/todo.json', function (exists) {
		  	if (exists){
		  		fs.readFile(__dirname + '/todo.json', 'utf8', function (err, data) {
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
					  	fs.writeFile(__dirname + '/todo.json', JSON.stringify(edited), function (err) {
						  	if (err) throw err;
							console.log('Done tasks have been removed\n'.green);
						if (callback) callback();
						});	
				  	} else {
				  		console.log('Nothing done yet...\n'.yellow);
				  		if (callback) callback();
				  	}
				});
		  	} else {
		  		console.log('Nothing to do...\n'.yellow);
		  		if (callback) callback();
		  	}
		});
	},

	storeTask = function (task, callback){
		if (task && (typeof(task) === 'string')){
			fs.exists(__dirname + '/todo.json', function (exists) {
			  	if (exists){
			  		fs.readFile(__dirname + '/todo.json', 'utf8', function (err, data) {
					  	if (err) throw err;
					  	data = JSON.parse(data);
					  	data.push({'name': task, 'status': 'TO DO'});
					  	fs.writeFile(__dirname + '/todo.json', JSON.stringify(data), function (err) {
						  	if (err) throw err;
							console.log(('New task added: "' + task + '"\n').green);
							if (callback) callback();
						});	
					})
			  	} else {
			  		fs.writeFile(__dirname + '/todo.json', JSON.stringify([{'name': task, 'status': 'TO DO'}]), function (err) {
						if (err) throw err;
						console.log(('New task added: "' + task + '"\n').green);
						if (callback) callback();
					});	
			  	}
			});
		} else {
			console.log('\/\!\\ Please specify a valid name for your new task\n'.red);
			if (callback) callback();
		}
	},

	doTask = function (id, options, callback){
		if (id || options.task){
			fs.exists(__dirname + '/todo.json', function (exists) {
			  	if (exists){
			  		fs.readFile(__dirname + '/todo.json', 'utf8', function (err, data) {
					  	if (err) throw err;
					  	var edited = JSON.parse(data);
					  	data = JSON.parse(data);
					  	for (var i=0,x=edited.length; i<x; i++){
					  		if ((i+1 == id) || (options && edited[i].name === options.task)) edited[i].status = 'DONE';
					  	}
					  	if (edited !== data){
						  	fs.writeFile(__dirname + '/todo.json', JSON.stringify(edited), function (err) {
							  	if (err) throw err;
								console.log((((options && options.task) || id) + ' > DONE\n').green);
								if (callback) callback();
							});	
					  	} else {
					  		console.log('\/\!\\ The task doesn\'t exist\n'.red);
					  		if (callback) callback();
					  	}
					});
			  	} else {
			  		console.log('Nothing to do...\n'.yellow);
			  		if (callback) callback();
			  	}
			});
		} else {
			console.log('\/\!\\ Please specify the exact name of the task\n'.red);
			if (callback) callback();
		}
	},

	cli = function(){
		inquirer.prompt([
			{
				type: 'list',
				name: 'command',
				message: 'Hi there, what do you want to do?',
				choices: [
					'List the tasks',
					'Add a new task',
					'Mark a task as "DONE"',
					'Flush DONE tasks'
				]
			}
		], function(answers) {
			switch (answers.command){
				case 'Add a new task':
					listTasks(function(){
						inquirer.prompt([
							{
								type: 'input',
								name: 'task',
								message: 'OK, what is it?'
							}
						], function(answer){
							storeTask(answer.task, cli);
						})
					});
					break;

				case 'Mark a task as "DONE"':
					listTasks(function(){
						inquirer.prompt([
							{
								type: 'input',
								name: 'taskID',
								message: 'OK, which one? (id)'
							}
						], function(answer){
							doTask(answer.taskID, null, cli);
						})
					});
					break;

				case 'Flush DONE tasks':
					listTasks(function(){
						inquirer.prompt([
							{
								type: 'input',
								name: 'confirm',
								message: 'OK, which one? (Y/n)'
							}
						], function(answer){
							if (answer.confirm === 'Y'){
								flushDoneTask(cli);
							}
						})
					});
					break;

				case 'List the tasks':
				default:
					listTasks(cli);
			}
		});
	};


program
	.command('list')
	.alias('li')
	.description('list tasks in the todo list')
	.action(listTasks);

program
	.command('done [id]')
	.alias('ok')
	.alias('do')
	.option('-t, --task [task]', 'find by name instead of id')
	.description('mark a task as "done"')
	.action(doTask);

program
	.command('flush')
	.alias('fl')
	.description('flush the done tasks')
	.action(flushDoneTask);

program
	.command('add [task]')
	.alias('new')
	.description('add task in the todo list')
	.action(storeTask);

program
	.command('cli')
	.description('launch a cli to use the program')
	.action(cli);

program
	.version('0.0.1')
	.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}