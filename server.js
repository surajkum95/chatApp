var mongo = require('mongodb').MongoClient;
var client1 = require('socket.io').listen(8080).sockets;

var dbName = 'chat';

mongo.connect('mongodb://127.0.0.1:27017', function(error,client){
if(error){
	throw error;
}

const db = client.db(dbName);
// console.log("Connected to the database");
// console.log("Client : "+client);
// console.log("db : " +db);

client1.on('connection', function(socket){
	//console.log('someone has connected');
var coll = db.collection('messages');

	var sendStatus = function(data){
		socket.emit('status',data);
	};

	coll.find().limit(100).sort({_id: 1}).toArray(function(err,res){
		if(err) throw err;
		//console.log(res);
		socket.emit('output',res);
	});

	//wait for input
	socket.on('input', function(data){
	//console.log(data);
	var name = data.name;
	var message = data.message;

	coll.insert({name : name , message:message},function(){
		//emit latest message to all

		client1.emit('output',[data]);

		sendStatus({
			message : "Message Sent",
			clear : true
		})
		//console.log('Data inserted Successfully');
	});

	});

});

});


//in the console :-
//var scoket = io.connect("http://127.0.0.1:8080");
//socket.emit('input',{"name":"Suraj","message":"Hi Suraj"});
