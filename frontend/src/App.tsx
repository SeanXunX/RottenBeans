import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import RequireAuth from "./RequireAuth";
import HomePage from "./components/HomePage";
import BookPage from "./components/Book";
import PeoplePage from "./components/People";
import OrderPage from "./components/Order";
import FinancePage from "./components/Finance";

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
                    <Route path="book" element={<BookPage />} />
                    <Route path="people" element={<PeoplePage />} />
                    <Route path="order" element={<OrderPage />} />
                    <Route path="finance" element={<FinancePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
