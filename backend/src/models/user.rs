use diesel::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password: String,
    pub real_name: String,
    pub employee_id: i32,
    pub gender: String,
    pub age: i32,
    pub is_super: bool,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub username: String,
    pub password: String,
    pub real_name: String,
    pub employee_id: i32,
    pub gender: String,
    pub age: i32,
}
