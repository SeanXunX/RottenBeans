use diesel::prelude::*;
use crate::models::user::{NewUser, User};
use serde::Deserialize;

pub fn create_user(
    conn: &mut PgConnection, 
    username: String, password: String, 
    real_name: String, employee_id: i32, 
    gender: String, 
    age: i32
) -> QueryResult<User> {


    let new_user = NewUser {
        username, 
        password,
        real_name, 
        employee_id, 
        gender, 
        age
    };
    
    create_new_user(conn, &new_user)
    // diesel::insert_into(users::table)
    //     .values(&new_user)
    //     .returning(User::as_returning())
    //     .get_result(conn)
}

pub fn create_new_user(
    conn: &mut PgConnection,
    new_user: &NewUser,
) -> QueryResult<User> {

    use crate::schema::users::dsl::*;
    diesel::insert_into(users)
        .values(new_user)
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

#[derive(AsChangeset, Deserialize)]
#[diesel(table_name = crate::schema::users)] 
pub struct UpdateUserInfo {
    pub password: String,
    pub real_name: String,
    pub employee_id: i32,
    pub gender: String,
    pub age: i32,
}

pub fn update_user_info(
    conn: &mut PgConnection,
    uname: &str,
    info: &UpdateUserInfo
) -> QueryResult<User> {
    use crate::schema::users::dsl::*;

    diesel::update(users.filter(username.eq(uname)))
        .set(info)
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

pub fn get_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    use crate::schema::users::dsl::*;
    users.load::<User>(conn)
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