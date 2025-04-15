// @generated automatically by Diesel CLI.

diesel::table! {
    books (id) {
        id -> Uuid,
        isbn -> Text,
        title -> Text,
        author -> Text,
        publisher -> Text,
        retail_price -> Numeric,
        stock -> Int4,
        created_at -> Timestamp,
    }
}

diesel::table! {
    finance_logs (id) {
        id -> Uuid,
        action_type -> Text,
        amount -> Numeric,
        note -> Nullable<Text>,
        created_at -> Timestamp,
    }
}

diesel::table! {
    purchases (id) {
        id -> Uuid,
        book_id -> Nullable<Uuid>,
        quantity -> Int4,
        purchase_price -> Numeric,
        status -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        #[max_length = 64]
        username -> Varchar,
        #[max_length = 128]
        password -> Varchar,
        #[max_length = 64]
        real_name -> Varchar,
        employee_id -> Int4,
        #[max_length = 8]
        gender -> Varchar,
        age -> Int4,
        is_super -> Bool,
    }
}

diesel::joinable!(purchases -> books (book_id));

diesel::allow_tables_to_appear_in_same_query!(
    books,
    finance_logs,
    purchases,
    users,
);
