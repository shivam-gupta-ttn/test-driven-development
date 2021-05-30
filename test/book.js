process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Book = require('../app/models/book');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();


chai.use(chaiHttp);

describe('Books', () => {
	beforeEach((done) => {
		Book.remove({}, (err) => {
			done();
		});
	});
	describe('/GET book', () => {
		it('it should GET all the books', (done) => {
			chai.request(server)
				.get('/book')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});
	describe('/POST book', () => {
		it('it should not POST a book without pages field - 1 - negative', (done) => {
			let book = {
				title: "Amazing Wonders",
				author: "W.W. Washington"
			};
			chai.request(server)
				.post('/book')
				.send(book)
				.end((err, res) => {
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('pages');
					res.body.errors.pages.should.have.property('kind').eql('required');
					done();
				});
		}); // negative test case
		it('it should not POST a book without pages field - 2 - negative', (done) => {
			let book = {
				author: "W.W. Washington",
				year: 1923,
				pages: 238
			};
			chai.request(server)
				.post('/book')
				.send(book)
				.end((err, res) => {
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('title');
					done();
				});
		}); // negative test case
	});
	describe('/GET/:id book', () => {
		it('it should not GET a book by the given id - negative', (done) => {
			let book = new Book({});
			book.save((err, book) => {
				chai.request(server)
					.get('/book/' + 45672)
					.send(book)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('name');
						done();
					});
			});

		}); // negative test case
	});
	describe('/PUT/:id book', () => {
		it('it should UPDATE a book given the id', (done) => {
			let book = new Book({ title: "Wonders", author: "L.L. Token", year: 1923, pages: 778 });
			book.save((err, book) => {
				chai.request(server)
					.put('/book/' + book.id)
					.send({ title: "Wonders", author: "L.L. Token", year: 1921, pages: 1778 })
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Book updated!');
						res.body.book.should.have.property('year').eql(1921);
						done();
					});
			});
		});
	});
	describe('/DELETE/:id book', () => {
		it('it should DELETE a book given the id', (done) => {
			let book = new Book({ title: "Adventures of Sherlock Holmes", author: "A.C Doyle", year: 1948, pages: 778 });
			book.save((err, book) => {
				chai.request(server)
					.delete('/book/' + book.id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Book successfully deleted!');
						res.body.result.should.have.property('ok').eql(1);
						res.body.result.should.have.property('n').eql(1);
						done();
					});
			});
		});
	});
});
