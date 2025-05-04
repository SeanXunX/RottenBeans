import { useState, useEffect } from "react";
import api from "../api";
import { v4 as uuidv4 } from "uuid";

interface BookType {
    id: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    retail_price: string;
    stock: string;
}

interface PurchaseType {
    id: string;
    book_id: string;
    quantity: string;
    purchase_price: string;
    status: string;
    created_at: string;
}

function OrderPage() {
    const [searchType, setSearchType] = useState("place_holder");
    const [searchValue, setSearchValue] = useState("");

    const [books, setBooks] = useState<BookType[]>([]);
    const [editBookIndex] = useState<number | null>(null);
    const [editBook, setEditBook] = useState<Partial<BookType>>({});

    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [orderQuantity, setOrderQuantity] = useState("");
    const [orderPrice, setOrderPrice] = useState("");

    const [newBook, setNewBook] = useState<Partial<BookType>>({});
    const [purchases, setPurchases] = useState<PurchaseType[]>([]);

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

    const handleChange = (field: keyof BookType, value: string) => {
        setEditBook((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCreateOrder = async () => {
        if (!selectedBookId || !orderQuantity || !orderPrice) {
            alert("请填写完整订单信息");
            return;
        }
        try {
            await api.post("/api/purchase/create", {
                id: uuidv4(),
                book_id: selectedBookId,
                quantity: parseInt(orderQuantity),
                purchase_price: parseFloat(orderPrice),
                status: "Unpaid",
            });
            alert("下单成功");
            setOrderQuantity("");
            setOrderPrice("");
            fetchPurchases();
        } catch (err) {
            alert("下单失败");
            console.error(err);
        }
    };

    const fetchPurchases = async () => {
        try {
            const res = await api.get("/api/purchase/list");
            setPurchases(res.data);
        } catch (e) {
            console.error("获取订单失败", e);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/api/purchase/update_status/${id}`, { status });
            fetchPurchases();
        } catch (e) {
            alert("操作失败");
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <h1>订单管理</h1>
            {/* 搜索区域 */}
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

            {/* 图书列表 */}
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
                            <th>选择</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, idx) => (
                            <tr
                                key={book.id}
                                className={
                                    editBookIndex === idx ? "table-warning" : ""
                                }
                            >
                                {editBookIndex === idx ? (
                                    <>
                                        <td>{book.isbn}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.publisher}</td>
                                        <td>
                                            <input
                                                value={
                                                    editBook.retail_price || ""
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
                                    </>
                                ) : (
                                    <>
                                        <td>{book.isbn}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.publisher}</td>
                                        <td>{book.retail_price}</td>
                                        <td>{book.stock}</td>
                                    </>
                                )}
                                <td>
                                    {selectedBookId === book.id ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setSelectedBookId(null)
                                                }
                                                className="btn btn-sm btn-danger me-2"
                                            >
                                                ❌取消
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success"
                                                disabled
                                            >
                                                ✔ 已选
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                setSelectedBookId(book.id)
                                            }
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            选择
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 如果没有找到图书，允许添加新书 */}
            {books.length === 0 && (
                <div className="mt-4">
                    <h2>添加新书</h2>
                    <div className="row g-2">
                        {["isbn", "title", "author", "publisher"].map(
                            (field) => (
                                <div key={field} className="col-md-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={field}
                                        value={(newBook as any)[field] || ""}
                                        onChange={(e) =>
                                            setNewBook({
                                                ...newBook,
                                                [field]: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            )
                        )}
                    </div>
                    <div className="row g-2 mt-2">
                        <div className="col-md-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="retail_price"
                                value={newBook.retail_price || ""}
                                onChange={(e) =>
                                    setNewBook({
                                        ...newBook,
                                        retail_price: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="库存"
                                value={newBook.stock || ""}
                                onChange={(e) =>
                                    setNewBook({
                                        ...newBook,
                                        stock: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="col-md-3">
                            <button
                                className="btn btn-success"
                                onClick={async () => {
                                    try {
                                        const res = await api.post(
                                            "/api/book/create",
                                            {
                                                ...newBook,
                                                retail_price: parseFloat(
                                                    newBook.retail_price || "0"
                                                ),
                                                stock: parseInt(
                                                    newBook.stock || "0"
                                                ),
                                            }
                                        );
                                        alert("添加成功");
                                        setBooks([res.data]);
                                        setSelectedBookId(res.data.id);
                                    } catch (e) {
                                        alert("添加失败");
                                    }
                                }}
                            >
                                添加新书
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 创建订单 */}
            <div className="mt-4">
                <h2>下订单</h2>
                <div className="row g-2">
                    <div className="col-md-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="数量"
                            value={orderQuantity}
                            onChange={(e) => setOrderQuantity(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="单价"
                            value={orderPrice}
                            onChange={(e) => setOrderPrice(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <button
                            className="btn btn-primary"
                            onClick={handleCreateOrder}
                        >
                            下单
                        </button>
                    </div>
                </div>
            </div>

            {/* 订单列表 */}
            <div className="mt-4">
                <h2>订单列表</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>书籍ID</th>
                            <th>数量</th>
                            <th>进价</th>
                            <th>状态</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.book_id}</td>
                                <td>{p.quantity}</td>
                                <td>{p.purchase_price}</td>
                                <td>{p.status}</td>
                                <td>{p.created_at}</td>
                                <td>
                                    {p.status === "Unpaid" && (
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() =>
                                                updateStatus(p.id, "Paid")
                                            }
                                        >
                                            💰付款
                                        </button>
                                    )}
                                    {p.status !== "Returned" && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                updateStatus(p.id, "Returned")
                                            }
                                        >
                                            🔁退货
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default OrderPage;
