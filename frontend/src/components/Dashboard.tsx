import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const menuItems = [
  { name: "Dashboard", icon: "home" },
  { name: "Orders", icon: "file" },
  { name: "Products", icon: "shopping-cart" },
  { name: "Customers", icon: "users" },
  { name: "Reports", icon: "bar-chart-2" },
  { name: "Integrations", icon: "layers" },
];

const tableData = [
  { id: 1001, col1: "Random", col2: "Data", col3: "Placeholder", col4: "Text" },
  { id: 1002, col1: "Placeholder", col2: "Irrelevant", col3: "Visual", col4: "Layout" },
  { id: 1003, col1: "Data", col2: "Rich", col3: "Dashboard", col4: "Tabular" },
];

const Dashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
          Company Name
        </a>
        <input
          className="form-control form-control-dark w-100"
          type="text"
          placeholder="Search"
          aria-label="Search"
        />
        <div className="navbar-nav">
          <div className="nav-item text-nowrap dropdown">
            <a
              className="nav-link px-3 dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://avatars.githubusercontent.com/u/1?v=4"
                alt="avatar"
                className="rounded-circle avatar"
              />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#">Profile</a></li>
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#">Sign out</a></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
          >
            <div className="position-sticky pt-3 sidebar-sticky">
              <ul className="nav flex-column">
                {menuItems.map((item) => (
                  <li className="nav-item" key={item.name}>
                    <a
                      className={`nav-link ${activeMenu === item.name ? "active" : ""}`}
                      href="#"
                      onClick={() => setActiveMenu(item.name)}
                    >
                      <span data-feather={item.icon} className="align-text-bottom"></span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">{activeMenu}</h1>
            </div>

            <h2>Section title</h2>
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First</th>
                    <th>Second</th>
                    <th>Third</th>
                    <th>Fourth</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.col1}</td>
                      <td>{row.col2}</td>
                      <td>{row.col3}</td>
                      <td>{row.col4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
