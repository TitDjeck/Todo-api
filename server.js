var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require("bcrypt");
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=false&q=work
app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function (todos) {
		res.json(todos);
	}, function (e) {
		res.status(500).send();
	});
});

// GET /todos/:id
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});
});

// POST /todos
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	body.description = body.description.trim() || "";
	body.completed = body.completed && body.completed.toLowerCase() == "true" ? true : false; 
	db.todo.create(body).then(function (todo) {
		req.user.addTodo(todo).then(function(){
			return todo.reload();
		}).then(function(todo){
			res.json(todo.toJSON());
		});;
		// .then(function(){})
		// res.json(todo.toJSON());
	}).then(function(data){
		debugger;
	}).catch(function (e) {
		res.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);	
	db.todo.destroy({where: {id: todoId}})
		.then(function(todo){
			if(todo === 0){ res.status(404).send("todo not found"); } 
			else { res.json(todo); }
		})
		.catch(function(error){ res.status(500).json(error); });
});

// PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	debugger;
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	if(body.description) body.description.trim();
	//if(body.completed) (_isBoolean(body.completed) && body.completed) || (body.completed = body.completed.toLowerCase() == "true") ? true : false;
	db.todo.update(body, {where: {id: todoId}})
		.then(function(todo){
			if(todo[0] == 0){ res.status(404).send("todo not found"); }
			else { res.json(todo); }
		})
		.catch(function(error){ res.status(500).json(error); });
});


// POST /users
app.post('/users', function(req, res){
	var user = _.pick(req.body, "email", "password");	
	db.user.create(user)
		.then(function(newUser){
			if(newUser){
				res.json(newUser.toPublicJSON());
			}
		})
		.catch(function(error){ res.status(500).json(error); });
});

// POST /users/login
app.post('/users/login', function(req, res){
	var body = _.pick(req.body, "email", "password");	
	db.user.authenticate(body)
		.then(function(user){
			var token =  user.generateToken('authentication');
			if(token)
				res.header('Auth', user.generateToken('authentication')).json(user.toPublicJSON());
			else 
				res.status(401).send();
		}).catch(function(error){ res.status(401).send(); });
});


db.sequelize.sync(
	// {force: true}
	).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});