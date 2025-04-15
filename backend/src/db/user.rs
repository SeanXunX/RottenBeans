use diesel::prelude::*;
use crate::models::user::{NewUser, User};

pub fn create_user(
    conn: &mut PgConnection, 
    username: &str, password: &str, 
    real_name: &str, employee_id: i32, 
    gender: &str, 
    age: i32
) -> QueryResult<User> {

    use crate::schema::users;

    let new_user = NewUser {
        username, 
        password,
        real_name, 
        employee_id, 
        gender, 
        age};
    
    diesel::insert_into(users::table)
        .values(&new_user)
        .returning(User::as_returning())
        .get_result(conn)
}

pub fn get_user_by_username(conn: &mut PgConnection, username: &str) -> QueryResult<User> {
    use crate::schema::users;

    users::table
        .filter(users::username.eq(username))
        .select(User::as_select())
        .first(conn)
}

pub fn update_user_password(
    conn: &mut PgConnection,
    uname: &str,
    new_password: &str
) -> QueryResult<User> {
    use crate::schema::users::dsl::*;

    diesel::update(users.filter(username.eq(uname)))
        .set(password.eq(new_password))
        .returning(User::as_returning())
        .get_result(conn)
}

pub fn delete_user_by_username(
    conn: &mut PgConnection,
    uname: &str,
) -> QueryResult<usize> {
    use crate::schema::users::dsl::*;

    diesel::delete(users.filter(username.eq(uname)))
        .execute(conn)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::utils::*;

    #[test]
    fn test_delete_fail_case() {
        let conn = &mut establish_connection();
        let res = delete_user_by_username(conn, "no user");
        let error_string = match res {
            Err(_) => String::from("Error Delete!"),
            Ok(num) if num > 0 => format!("Succeed in deleting {} accounts!", num),
            Ok(_) => format!("Delete nothing"),
        };
        assert_eq!(error_string, "Delete nothing");
    }
}