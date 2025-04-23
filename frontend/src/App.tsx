import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import RequireAuth from "./RequireAuth";
import HomePage from "./components/HomePage";
import Book from "./components/Book";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route
                    path="/dashboard"
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="book" element={<Book />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
