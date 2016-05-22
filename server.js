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
  res.json(todos);
});

app.get("/todos/:id", function(req,res){
  var id = req.params.id;
  var todo = todos.find(function(item){return item.id == id; });
  if(todo) res.json(todo);
  else res.status(404).send();
});

app.post("/todos", function(req, res){
  var body = req.body.pick("description");
  if(!body.description.isString() || !body.description.trim()) return res.status(404).send();
  todos.push(body.defaults({id: todoId++, completed: false}).trimAll());
  res.json({"newId": body.id});
});



app.listen(PORT, function(){
  console.log(`Express listening on port ${PORT}`);
});
