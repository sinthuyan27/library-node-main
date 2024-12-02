import express from "express";
import bodyParser from "body-parser";
import { readFileSync, writeFileSync } from "fs";
import path from 'path';

const booksPath = path.join(__dirname, 'books.json');
console.log(booksPath);
const books = JSON.parse(readFileSync(booksPath, 'utf-8'));

console.log(books);

console.log(books); 


const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const readBooks = () => JSON.parse(readFileSync(booksPath, "utf-8"));
const writeBooks = (data: any) => writeFileSync(booksPath, JSON.stringify(data, null, 2));

app.get("/books", (req, res) => {
  const books = readBooks();
  res.json(books);
});
app.get("/api/books/:id", (req, res) => {
    const books = readBooks();
    const book = books.find((b: any) => b.id === parseInt(req.params.id));
    book ? res.json(book) : res.status(404).send("Book not found");
  });
app.post("/api/books", (req, res) => {
  const books = readBooks();
  const newBook = req.body;
  newBook.id = books.length + 1;
  books.push(newBook);
  writeBooks(books);
  res.status(201).json(newBook);
});
app.put("/api/books/:id", (req, res) => {
  const books = readBooks();
  const book = books.find((b: any) => b.id === parseInt(req.params.id));
  if (book) {
    Object.assign(book, req.body);
    writeBooks(books);
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
});
app.delete("/api/books/:id", (req, res) => {
  const books = readBooks();
  const index = books.findIndex((b: any) => b.id === parseInt(req.params.id));
  if (index !== -1) {
    books.splice(index, 1);
    writeBooks(books);
    res.status(204).send();
  } else {
    res.status(404).send("Book not found");
  }
});
app.listen(PORT, () => {
  console.log(`Server is running 3000:${PORT}`);
});  
