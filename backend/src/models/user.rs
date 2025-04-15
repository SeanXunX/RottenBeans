use diesel::prelude::*;

#[derive(Queryable, Selectable)]
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

#[derive(Insertable)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser<'a> {
    pub username: &'a str,
    pub password: &'a str,
    pub real_name: &'a str,
    pub employee_id: i32,
    pub gender: &'a str,
    pub age: i32,
}
