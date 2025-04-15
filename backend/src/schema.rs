// @generated automatically by Diesel CLI.

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
