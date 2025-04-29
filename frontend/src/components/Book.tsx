import { useState } from "react";
import api from "../api";

interface BookType {
    id: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    retail_price: string;
    stock: number;
    created_at: string;
}

function Book() {
    const [searchType, setSearchType] = useState("place_holder");
    const [searchValue, setSearchValue] = useState("");
    const [books, setBooks] = useState<BookType[]>([]);

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editBook, setEditBook] = useState<Partial<BookType>>({}); // Partially chosen types from BookType

    const handleSearch = async () => {
        try {
            const response = await api.get("/api/book/search", {
                params: {
                    search_type: searchType,
                    search_value: searchValue,
                },
            });
            setBooks(response.data);
        } catch (error) {
            console.log(`Error:${error}`);
            alert("Search failed.");
        }
    };

    const handleEdit = (idx: number) => {
        setEditIndex(idx);
        setEditBook({ ...books[idx] });
    };

    const handleSave = async () => {
        if (!editBook.id) return;

        try {
            await api.put(`/api/book/update/${editBook.id}`, editBook);
            alert("Update successful!");
            setEditIndex(null);
            handleSearch();
        } catch (error) {
            console.log(error);
            alert("Update failed.");
        }
    };

    const handleCancel = () => {
        setEditIndex(null);
        setEditBook({});
    };

    const handleChange = (field: keyof BookType, value: string) => {
        // If passing a function as nextState, it will be treated as an updater function.
        // It must be pure, should take the pending state as its only argument, and should return the next state.
        setEditBook((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div className="container">
                    <h1>Book Management</h1>
                    <div className="mb-3">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="form-select"
                        >
                            <option value="place_holder" hidden>
                                Search by ...
                            </option>
                            <option value="id">编号</option>
                            <option value="isbn">ISBN</option>
                            <option value="title">书名</option>
                            <option value="author">作者</option>
                            <option value="publisher">出版社</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="form-control"
                            placeholder="请输入搜索内容"
                        />
                    </div>
                    <button onClick={handleSearch} className="btn btn-primary">
                        查询
                    </button>

                    <div className="mt-4">
                        <h2>搜索结果</h2>
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>ISBN</th>
                                    <th>书名</th>
                                    <th>作者</th>
                                    <th>出版社</th>
                                    <th>零售价格</th>
                                    <th>库存</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book, idx) => (
                                    <tr
                                        key={idx}
                                        className={
                                            editIndex === idx
                                                ? "table-warning"
                                                : ""
                                        }
                                    >
                                        {editIndex === idx ? (
                                            <>
                                                <td><input value={editBook.isbn || ""} onChange={(e) => handleChange("isbn", e.target.value)} className="form-control" /></td>
                                                <td><input value={editBook.title || ""} onChange={(e) => handleChange("title", e.target.value)} className="form-control" /></td>
                                                <td><input value={editBook.author || ""} onChange={(e) => handleChange("author", e.target.value)} className="form-control" /></td>
                                                <td><input value={editBook.publisher || ""} onChange={(e) => handleChange("publisher", e.target.value)} className="form-control" /></td>
                                                <td><input value={editBook.retail_price || ""} onChange={(e) => handleChange("retail_price", e.target.value)} className="form-control" /></td>
                                                <td><input value={editBook.stock?.toString() || ""} onChange={(e) => handleChange("stock", e.target.value)} className="form-control" /></td>
                                                <td>
                                                    <button
                                                        onClick={handleSave}
                                                        className="btn btn-success btn-sm me-2"
                                                    >
                                                        ✅确认
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="btn btn-secondary btn-sm"
                                                    >
                                                        ❌取消
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{book.isbn}</td>
                                                <td>{book.title}</td>
                                                <td>{book.author}</td>
                                                <td>{book.publisher}</td>
                                                <td>{book.retail_price}</td>
                                                <td>{book.stock}</td>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(idx)
                                                        }
                                                        className="btn btn-warning btn-sm"
                                                    >
                                                        ✏️修改
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Book;
