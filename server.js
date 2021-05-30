
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const port = 8080;
const book = require('./app/routes/book');


let options = {
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
	replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};


mongoose.connect("mongodb://localhost:27017/mongo-testing", {
	useNewUrlParser: "true",
	useUnifiedTopology: "true"
});
mongoose.connection.on("error", err => {
	console.log("Error ==>", err);
});
mongoose.connection.on("connected", () => {
	console.log("Mongoose is up and running.");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/json' }));

app.get("/", (req, res) => res.json({ message: "Welcome to Home!" }));

app.route("/book")
	.get(book.getBooks)
	.post(book.postBook);
app.route("/book/:id")
	.get(book.getBook)
	.delete(book.deleteBook)
	.put(book.updateBook);


app.listen(port);
console.log("Listening on port " + port);

module.exports = app;