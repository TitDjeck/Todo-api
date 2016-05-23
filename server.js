var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var db = require("./db.js");
require("./extenders.js");
var PORT = process.env.PORT || 3000;

debugger;

var todos = [/*{
  id: 1,
  description: "piscine étoile de mer",
  completed: true
},{
  id: 2,
  description: "france loisir",
  completed: false
},{
  id: 3,
  description: "foutu jardin",
  completed: true
}*/];
var todoId = 1;

app.use(bodyParser.json());

app.get("/", function(req, res){
  res.send("Todo API Root");
});

app.get("/todos", function(req,res){
  var queryParams = req.query.pick("id", "description", "completed");
  var q = req.query.q || "";
  if(queryParams.id) queryParams.id = queryParams.id.toNumber();
  if(queryParams.completed) queryParams.completed = queryParams.completed.toBoolean();
  var filteredTodos = todos;
  
  if(Object.getOwnPropertyNames(queryParams).length){
    filteredTodos = todos.filterByValues(queryParams);
  }
  if(q.isString() && q.length){
    filteredTodos = filteredTodos.filter(function(todo, indx){
      return todo.description.toLowerCase().indexOf(q.toLowerCase()) > -1;
    });
  }
  
  res.json(filteredTodos);
});

app.post("/todos", function(req, res){
  var body = req.body.pick("description");
  db.todo.create({
    description: body.description || ""
  }).then(function(todo){
    res.json(todo.toJSON());
  }).catch(function(error){
    res.status(400).json(error);
  });
  // if(!body.description.isString() || !body.description.trim()) return res.status(404).send();
  // todos.push(body.defaults({id: todoId++, completed: false}).trimAll());
  // res.json({"newId": body.id});
});
app.get("/todos/:id", function(req,res){
  var id = parseInt(req.params.id);
  var todo = todos.find(function(item){return item.id == id; });
  if(todo) res.json(todo);
  else res.status(404).send();
});
app.put("/todos/:id", function(req, res){
  var id = parseInt(req.params.id);
  var todo = todos.find(function(item){ return item.id === id});
  if(!todo) return res.status("404").send();
  var body = req.body.pick("description", "completed");
  var validAttributes = {};
  
  if(body.hasOwnProperty("completed")){
    if(body.completed.isBoolean()){
      validAttributes.completed = body.completed;
    } else {
      return res.status(400).send();
    }
  }
  
  if(body.hasOwnProperty("description")){
    if(body.description.isString() && body.description.length){
      validAttributes.description = body.description.trim();
    } else {
      return res.status(400).send();
    }
  }
  
  todo.extend(true, validAttributes);
  
  res.json(todo.omit("id"));
});
app.delete("/todos/:id", function(req,res){
  var id = parseInt(req.params.id);
  var todo = todos.find(function(item){return item.id === id; });
  if(todo) {
    todos.remove(todo);
    res.send("done");
  }
  else {
    res.status(404).send();
  }    
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});