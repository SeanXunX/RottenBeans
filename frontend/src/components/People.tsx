import { useEffect, useState } from "react";
import api from "../api";

interface PeopleType {
    id: number;
    username: string;
    password: string;
    real_name: string;
    employee_id: number;
    gender: string;
    age: number;
}

function PeoplePage() {
    const [users, setUsers] = useState<PeopleType[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editUser, setEditUser] = useState<Partial<PeopleType>>({});

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            alert("获取用户列表失败");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (idx: number) => {
        setEditIndex(idx);
        setEditUser({ ...users[idx] });
    };

    const handleCancel = () => {
        setEditIndex(null);
        setEditUser({});
    };

    const handleSave = async () => {
        if (!editUser.username) return;

        try {
            await api.put(`/api/user/update/${editUser.username}`, {
                password: editUser.password,
                real_name: editUser.real_name,
                employee_id: editUser.employee_id,
                gender: editUser.gender,
                age: editUser.age,
            });
            alert("更新成功");
            setEditIndex(null);
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert("更新失败");
        }
    };

    const handleChange = (field: keyof PeopleType, value: string) => {
        setEditUser((prev) => ({
            ...prev,
            [field]: field === "age" || field === "employee_id" ? parseInt(value) : value,
        }));
    };

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="container">
                <h1>用户管理</h1>
                <table className="table table-striped table-sm mt-3">
                    <thead>
                        <tr>
                            <th>用户名</th>
                            <th>密码</th>
                            <th>真实姓名</th>
                            <th>工号</th>
                            <th>性别</th>
                            <th>年龄</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => (
                            <tr
                                key={user.id}
                                className={editIndex === idx ? "table-warning" : ""}
                            >
                                {editIndex === idx ? (
                                    <>
                                        <td>{user.username}</td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={editUser.password || ""}
                                                onChange={(e) =>
                                                    handleChange("password", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={editUser.real_name || ""}
                                                onChange={(e) =>
                                                    handleChange("real_name", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={editUser.employee_id?.toString() || ""}
                                                onChange={(e) =>
                                                    handleChange("employee_id", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={editUser.gender || ""}
                                                onChange={(e) =>
                                                    handleChange("gender", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={editUser.age?.toString() || ""}
                                                onChange={(e) =>
                                                    handleChange("age", e.target.value)
                                                }
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
                                        <td>{user.username}</td>
                                        <td>{user.password}</td>
                                        <td>{user.real_name}</td>
                                        <td>{user.employee_id}</td>
                                        <td>{user.gender}</td>
                                        <td>{user.age}</td>
                                        <td>
                                            <button
                                                onClick={() => handleEdit(idx)}
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
        </main>
    );
}

export default PeoplePage;
