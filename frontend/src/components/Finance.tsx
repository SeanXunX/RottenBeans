import { useState } from "react";
import api from "../api";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface FinanceLog {
    id: string;
    action_type: string;
    amount: string;
    created_at: string;
}

interface ChartDataPoint {
    date: string;
    total: number;
}

function FinancePage() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [logs, setLogs] = useState<FinanceLog[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFilter = async () => {
        if (!startDate || !endDate) {
            setError("Please enter both start and end dates.");
            return;
        }

        setLoading(true);
        setError("");
        setLogs([]);

        try {
            const response = await api.get("/api/finance/logs", {
                params: {
                    start: `${startDate}T00:00:00`,
                    end: `${endDate}T23:59:59`,
                },
            });

            const rawLogs = response.data as FinanceLog[];
            setLogs(rawLogs);

            // 按日期聚合金额
            const grouped: { [date: string]: number } = {};
            rawLogs.forEach((log) => {
                const dateKey = log.created_at.split("T")[0];
                const amount = parseFloat(log.amount);
                grouped[dateKey] = (grouped[dateKey] || 0) + amount;
            });

            const dataPoints = Object.entries(grouped).map(([date, total]) => ({ date, total }));
            dataPoints.sort((a, b) => a.date.localeCompare(b.date));
            setChartData(dataPoints);

        } catch (err) {
            setError("Error fetching logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <h2 className="my-4">Finance Log</h2>

            <div className="row mb-3">
                <div className="col-auto">
                    <label className="form-label">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="col-auto">
                    <label className="form-label">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="col-auto align-self-end">
                    <button onClick={handleFilter} className="btn btn-primary">
                        Filter
                    </button>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {chartData.length > 0 && (
                <div style={{ width: "100%", height: 300, marginBottom: "2rem" }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="table-responsive small">
                <table className="table table-striped table-bordered table-sm">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Action</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    No data available.
                                </td>
                            </tr>
                        )}
                        {logs.map((log, index) => (
                            <tr key={log.id}>
                                <td>{index + 1}</td>
                                <td>{log.action_type}</td>
                                <td>{log.amount}</td>
                                <td>{log.created_at.split("T")[0]}</td>
                                <td>{log.created_at.split("T")[1].split('.')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default FinancePage;
