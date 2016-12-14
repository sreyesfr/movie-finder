var mongoClient = require('mongodb').MongoClient;
var connection_string = 'mongodb://localhost:27017/moviefinderv2';
var collect = 'user';

if(process.env.MLAB_MOVIEFINDER_PASSWD){
	connection_string = "mongodb://sreyesfr:" + process.env.MLAB_MOVIEFINDER_PASSWD + "@ds133378.mlab.com:33378/m2cfinalproject";
}

var mongoDB;

console.log("mongoDB line right after this");
mongoClient.connect(connection_string, function(err,db) {
	if (err) doError(err);
	console.log("Connected to MongoDB server at: "+connection_string);
	mongoDB = db;
});

exports.create = function(data,callback){
	mongoDB.collection(collect).insertOne(data, function(err,status){
		if (err) doError(err);
		var success = (status.result.n == 1 ? true : false);
		callback(success);
	});
}

exports.retrieve = function(query,callback){
	mongoDB.collection(collect).find(query).toArray(function(err,docs) {
		if (err) doError(err);
		callback(docs);
	});
}

exports.update = function(filter,update,callback){
	mongoDB.collection(collect).updateMany(filter,update,{upsert:true},function(err,status) {
		if (err) doError(err);
		callback('Modified ' + status.modifiedCount + ' and added ' + status.upsertedCount + ' documents');
	});
}

exports.delete = function(filter,callback){
	mongoDB.collection(collect).deleteMany(filter,function(err,status) {
		console.log(filter);
		if (err) doError(err);
		callback('Deleted ' + status.deletedCount);
	});
}

exports.findByUsername = function(username,callback){
	let query = {'username': username};
	mongoDB.collection(collect).findOne(query, function(err, docs){
		if (err) doError(err);
		console.log(docs);
		callback(err, docs);
	})
}

var doError = function(e) {
	console.error("ERROR: " + e);
	throw new Error(e);
}

