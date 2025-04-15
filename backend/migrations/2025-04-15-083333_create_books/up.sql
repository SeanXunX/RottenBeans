-- Your SQL goes here
CREATE TABLE books (
    id UUID PRIMARY KEY,
    isbn TEXT NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    publisher TEXT NOT NULL,
    retail_price NUMERIC NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE purchases (
    id UUID PRIMARY KEY,
    book_id UUID REFERENCES books(id) NOT NULL,
    quantity INTEGER NOT NULL,
    purchase_price NUMERIC NOT NULL,
    status TEXT NOT NULL, -- unpaid, paid, returned
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE finance_logs (
    id UUID PRIMARY KEY,
    action_type TEXT NOT NULL, -- income, expense
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);