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
	var where = {
		userId: req.user.get("id")
	};

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

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});
});

// GET /todos/:id
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var where = {
		userId: req.user.get("id"),
		id: parseInt(req.params.id, 10)
	};

	db.todo.findOne({
		where: where
	}).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});

// POST /todos
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	body.description = body.description.trim() || "";
	body.completed = body.completed && body.completed.toLowerCase() == "true" ? true : false;
	db.todo.create(body).then(function(todo) {
		req.user.addTodo(todo).then(function() {
			return todo.reload();
		}).then(function(todo) {
			res.json(todo.toJSON());
		});;
		// .then(function(){})
		// res.json(todo.toJSON());
	}).then(function(data) {
		debugger;
	}).catch(function(e) {
		res.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	db.todo.destroy({
			where: {
				id: parseInt(req.params.id, 10),
				userId: req.user.get("id")
			}
		})
		.then(function(todo) {
			if (todo === 0) {
				res.status(404).send("todo not found");
			} else {
				res.json(todo);
			}
		})
		.catch(function(error) {
			res.status(500).json(error);
		});
});

// PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	if (body.description) body.description.trim();
	db.todo.update(body, {
			where: {
				id: parseInt(req.params.id, 10),
				userId: req.user.get("id")
			}
		})
		.then(function(todo) {
			if (todo[0] == 0) {
				res.status(404).send("todo not found");
			} else {
				res.json(todo);
			}
		})
		.catch(function(error) {
			res.status(500).json(error);
		});
});

// POST /users
app.post('/users', function(req, res) {
	var user = _.pick(req.body, "email", "password");
	db.user.create(user)
		.then(function(newUser) {
			if (newUser) {
				res.json(newUser.toPublicJSON());
			}
		})
		.catch(function(error) {
			res.status(500).json(error);
		});
});

// POST /users/login
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, "email", "password"),
		userInstance = null;
	db.user.authenticate(body)
		.then(function(user) {
			var token = user.generateToken('authentication');
			userInstance = user;
			return db.token.create({
				token: token
			});
		}).then(function(tokenInstance) {
			res.header('Auth', tokenInstance.get("token")).json(userInstance.toPublicJSON());
		}).catch(function(error) {
			res.status(401).send();
		});
});

// DELETE /user/login
app.delete("/user/login", middleware.requireAuthentication, function(req, res) {
	req.token.destroy().then(function() {
		res.status(204).send();
	}).catch(function(err) {
		console.error(err);
		res.status(500).send();
	});
});

db.sequelize.sync({
	// force: true
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});