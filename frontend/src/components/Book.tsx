import { useState } from "react";
import api from "../api";

interface BookType {
    id: string;           // Uuid 转成字符串传输
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    retail_price: string;  // bigdecimal 一般也转成字符串
    stock: number;
    created_at: string;    // NaiveDateTime 通常作为字符串（ISO时间戳）
}

function Book() {
    const [searchType, setSearchType] = useState("place_holder");
    const [searchValue, setSearchValue] = useState("");
    const [books, setBooks] = useState<BookType[]>([]);

    const handleSearch = async () => {
        console.log("Searching: Type =", searchType, "; Value =", searchValue);
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
                        {/* 查询结果区域，后面实现 */}
                        <h2>搜索结果</h2>
                        <table className="table">
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
                                    <tr key={idx}>
                                        <td>{book.isbn}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.publisher}</td>
                                        <td>{book.retail_price}</td>
                                        <td>{book.stock}</td>
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
