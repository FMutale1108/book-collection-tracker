import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import DeleteModal from "./components/DeleteModal";
import api from "./api";

function App() {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch books from the backend API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books/");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Save (Add or Edit) a book
  const handleSaveBook = async (book) => {
    try {
      if (book.id) {
        // Update existing book
        const response = await api.put(`/books/${book.id}/`, book);
        setBooks(books.map((b) => (b.id === book.id ? response.data : b)));
      } else {
        // Add new book
        const response = await api.post("/books/", book);
        setBooks([...books, response.data]);
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  // Delete a book
  const handleDelete = async () => {
    try {
      await api.delete(`/books/${currentBook.id}/`);
      setBooks(books.filter((b) => b.id !== currentBook.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <h1>My Book List</h1>
        <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
          Add Book
        </button>
        <BookList
          books={books}
          onEdit={(book) => {
            setCurrentBook(book);
            setShowForm(true);
          }}
          onDelete={(book) => {
            setCurrentBook(book);
            setShowDeleteModal(true);
          }}
        />
        {showForm && <BookForm book={currentBook} onSave={handleSaveBook} />}
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;
