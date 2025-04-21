import "./SignIn.css";
import beanIcon from "../assets/bean-coffee-leaf-svgrepo-com.svg";

function SignIn() {
    return (
        <div className="d-flex align-items-center py-4 bg-body-tertiary full-height">
            <main className="form-signin w-100 m-auto">
                <form>
                    <img
                        src={beanIcon}
                        className="img-fluid rounded-circle"
                        width={100}
                        height={100}
                    />
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingInput"
                            placeholder="admin"
                        />
                        <label htmlFor="floatingInput">Username</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
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
