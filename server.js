var express = require("express");
var bodyParser = require("body-parser");
var app = express();
require("./extenders.js");
var PORT = process.env.PORT || 3000;

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
  if(queryParams.id) queryParams.id = queryParams.id.toNumber();
  if(queryParams.completed) queryParams.completed = queryParams.completed.toBoolean();
  var filteredTodos = todos;
  
  if(Object.getOwnPropertyNames(queryParams).length){
    filteredTodos = todos.filterByValues(queryParams);
  }
  
  res.json(filteredTodos);
});

app.post("/todos", function(req, res){
  var body = req.body.pick("description");
  if(!body.description.isString() || !body.description.trim()) return res.status(404).send();
  todos.push(body.defaults({id: todoId++, completed: false}).trimAll());
  res.json({"newId": body.id});
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


app.listen(PORT, function(){
  console.log(`Express listening on port ${PORT}`);
});