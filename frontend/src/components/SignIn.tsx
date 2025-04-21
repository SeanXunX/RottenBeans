import "./SignIn.css";
import beanIcon from "../assets/bean-coffee-leaf-svgrepo-com.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/login", {
                username,
                password,
            });

            const { token, is_super } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("is_super", JSON.stringify(is_super));

            navigate("/dashboard");
        } catch (error) {
            alert("Login failed. Please check username/passowrd.");
        }
    };

    return (
        <div className="d-flex align-items-center py-4 bg-body-tertiary full-height">
            <main className="form-signin w-100 m-auto">
                <form onSubmit={handleSubmit}>
                    <img
                        src={beanIcon}
                        className="img-fluid rounded-circle"
                        width={100}
                        height={100}
                    />
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating mb-3">
                        <input
                            type="username"
                            className="form-control"
                            id="floatingInput"
                            placeholder="admin"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="floatingInput">Username</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="form-check text-start mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value="remember-me"
                            id="flexCheckDefault"
                        />
                        <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                        >
                            Remember me
                        </label>
                    </div>

                    <button
                        className="btn btn-primary w-100 py-2"
                        type="submit"
                    >
                        Sign in
                    </button>

                    <p className="mt-5 mb-3 text-body-secondary text-center">
                        © 2025
                    </p>
                </form>
            </main>
        </div>
    );
}

export default SignIn;
