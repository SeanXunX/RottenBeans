import { useState } from "react";
import api from "../api";
import {v4 as uuidv4} from "uuid";

export interface BookType {
    id: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    retail_price: string;
    stock: string;
    created_at: string;
}

function BookPage() {
    const [searchType, setSearchType] = useState("place_holder");
    const [searchValue, setSearchValue] = useState("");
    const [books, setBooks] = useState<BookType[]>([]);

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editBook, setEditBook] = useState<Partial<BookType>>({});

    const [purchaseIndex, setPurchaseIndex] = useState<number | null>(null);
    const [purchaseQuantity, setPurchaseQuantity] = useState<string>("");

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
            const dataSubmit = {
                ...editBook,
                ...(editBook.retail_price
                    ? { retail_price: parseFloat(editBook.retail_price) }
                    : {}),
                ...(editBook.stock ? { stock: parseInt(editBook.stock) } : {}),
            };
            await api.put(`/api/book/update/${editBook.id}`, dataSubmit);
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
        setEditBook((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePurchase = (idx: number) => {
        setPurchaseIndex(idx);
        setPurchaseQuantity("");
    };

    const cancelPurchase = () => {
        setPurchaseIndex(null);
        setPurchaseQuantity("");
    };

    const confirmPurchase = async () => {
        if (purchaseIndex === null) return;
        const book = books[purchaseIndex];
        const quantity = parseInt(purchaseQuantity);

        if (isNaN(quantity) || quantity <= 0) {
            alert("请输入有效的购买数量。");
            return;
        }

        if (quantity > parseInt(book.stock)) {
            alert("购买数量不能超过库存。");
            return;
        }

        try {
            await api.put(`/api/book/update-stock/${book.id}/${-quantity}`);
            await api.post("/api/finance/create", {
                id: uuidv4(),
                action_type: "Income",
                amount: quantity * parseFloat(book.retail_price),
            })
            alert("购买成功！");
            setPurchaseIndex(null);
            handleSearch();
        } catch (err) {
            console.error(err);
            alert("购买失败。");
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
                                                <td>
                                                    <input
                                                        value={
                                                            editBook.isbn || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "isbn",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        value={
                                                            editBook.title || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "title",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        value={
                                                            editBook.author ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "author",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        value={
                                                            editBook.publisher ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "publisher",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        value={
                                                            editBook.retail_price ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "retail_price",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        value={
                                                            editBook.stock?.toString() ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "stock",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-control"
                                                    />
                                                </td>
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
                                                        className="btn btn-warning btn-sm me-2"
                                                    >
                                                        ✏️修改
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handlePurchase(idx)
                                                        }
                                                        className="btn btn-success btn-sm"
                                                    >
                                                        🛒购买
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

            {/* 购买弹出框 */}
            {purchaseIndex !== null && (
                <div className="modal d-block" style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                    <div className="bg-white p-4 rounded shadow" style={{ minWidth: "300px" }}>
                        <h5>请输入购买数量（库存：{books[purchaseIndex].stock}）</h5>
                        <input
                            type="number"
                            className="form-control my-3"
                            value={purchaseQuantity}
                            onChange={(e) => setPurchaseQuantity(e.target.value)}
                            min={1}
                            max={books[purchaseIndex].stock}
                        />
                        <div className="d-flex justify-content-end">
                            <button onClick={confirmPurchase} className="btn btn-primary me-2">
                                确认
                            </button>
                            <button onClick={cancelPurchase} className="btn btn-secondary">
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BookPage;
