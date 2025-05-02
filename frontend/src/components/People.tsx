import { useEffect, useState } from "react";
import api from "../api";

interface PeopleType {
    id: number;
    username: string;
    password: string;
    real_name: string;
    employee_id: string;
    gender: string;
    age: string;
}

type NewPeopleType = Omit<PeopleType, "id">;

function PeoplePage() {
    const [users, setUsers] = useState<PeopleType[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editUser, setEditUser] = useState<Partial<PeopleType>>({});

    const fetchUsers = async () => {
        try {
            let username = sessionStorage.getItem("username");
            let res;
            if (username !== "admin") {
                res = await api.get("/api/me");
                setUsers([res.data]);
            } else {
                res = await api.get("/api/users");
                setUsers(res.data);
            }
        } catch (err: any) {
            console.error(err);
            const message = err.response.data;
            alert(`${message}`);
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
            let dataSubmit = {
                ...editUser,
                ...(editUser.age ? { age: parseInt(editUser.age) } : {}),
                ...(editUser.employee_id
                    ? { employee_id: parseInt(editUser.employee_id) }
                    : {}),
            };
            let is_password_change = false;
            if (editIndex && editUser.password !== users[editIndex].password) {
                is_password_change = true; 
            }
            await api.put(`/api/update/${editUser.username}/${is_password_change}`, dataSubmit);
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
            [field]: value,
        }));
    };

    const [creating, setCreating] = useState(false);

    const handleDelete = async (idx: number) => {
        try {
            await api.delete(`/api/user/${users[idx].username}`);
            alert("Delete succeeded");
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        }
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
                                className={
                                    editIndex === idx ? "table-warning" : ""
                                }
                            >
                                {editIndex === idx ? (
                                    <>
                                        <td>{user.username}</td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={editUser.password || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={editUser.real_name || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "real_name",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={
                                                    editUser.employee_id?.toString() ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "employee_id",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={editUser.gender || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "gender",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={
                                                    editUser.age?.toString() ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "age",
                                                        e.target.value
                                                    )
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
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                ✏️修改
                                            </button>

                                            {user.username === "admin" ? (
                                                <></>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(idx)
                                                    }
                                                    className="btn btn-danger btn-sm me-2"
                                                >
                                                    ☠️删除
                                                </button>
                                            )}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        <NewPeople
                            creating={creating}
                            setCreating={setCreating}
                            fetchUsers={fetchUsers}
                        />
                    </tbody>
                </table>

                <button
                    className="btn btn-success mb-2"
                    onClick={() => setCreating(true)}
                >
                    ➕ 创建新用户
                </button>
            </div>
        </main>
    );
}

interface NewPeopleProps {
    creating: boolean;
    setCreating: React.Dispatch<React.SetStateAction<boolean>>;
    fetchUsers: () => Promise<void>;
}

function NewPeople({ creating, setCreating, fetchUsers }: NewPeopleProps) {
    const [newUser, setNewUser] = useState<Partial<NewPeopleType>>({});

    const handleChange = (field: keyof NewPeopleType, value: string) => {
        setNewUser((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const requiredKeys: (keyof NewPeopleType)[] = [
        "username",
        "password",
        "real_name",
        "employee_id",
        "gender",
        "age",
    ];

    const isCompleteUser = (
        user: Partial<NewPeopleType>
    ): user is NewPeopleType => {
        return requiredKeys.every((key) => user[key] !== undefined);
    };

    const handleCreate = async () => {
        if (!isCompleteUser(newUser)) {
            return;
        }

        try {
            const dataSubmit = {
                ...newUser,
                ...(newUser.age ? { age: parseInt(newUser.age) } : {}),
                ...(newUser.employee_id
                    ? { employee_id: parseInt(newUser.employee_id) }
                    : {}),
            };
            await api.post("/api/users", dataSubmit);
            alert("Update successful");
            setCreating(false);
            setNewUser({});
            fetchUsers();
        } catch (e) {
            console.log(e);
            alert("Create failed.");
        }
    };

    return (
        <>
            {creating && (
                <tr>
                    <td>
                        <input
                            value={newUser.username}
                            onChange={(e) =>
                                handleChange("username", e.target.value)
                            }
                            className="form-control"
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.password}
                            onChange={(e) =>
                                handleChange("password", e.target.value)
                            }
                            className="form-control"
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.real_name}
                            onChange={(e) =>
                                handleChange("real_name", e.target.value)
                            }
                            className="form-control"
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.employee_id?.toString()}
                            onChange={(e) =>
                                handleChange("employee_id", e.target.value)
                            }
                            className="form-control"
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.gender}
                            onChange={(e) =>
                                handleChange("gender", e.target.value)
                            }
                            className="form-control"
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.age?.toString() || ""}
                            onChange={(e) =>
                                handleChange("age", e.target.value)
                            }
                            className="form-control"
                        />
                    </td>
                    <td>
                        <div className="flex gap-2">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleCreate}
                            >
                                💾保存
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    setNewUser({});
                                    setCreating(false);
                                }}
                            >
                                ❌取消
                            </button>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default PeoplePage;
