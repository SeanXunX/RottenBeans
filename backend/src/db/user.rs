use diesel::prelude::*;
use crate::models::user::{NewUser, User};
use serde::Deserialize;
use crate::db::DbPool;

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

fn create_super_admin(conn: &mut PgConnection) -> QueryResult<User> {
    use crate::schema::users::dsl::*;

    let admin = NewUser {
        username: "admin".to_string(),
        password: format!("{:x}", md5::compute("admin")), // 默认密码 admin123 (已加密)
        real_name: "Sean".to_string(),
        employee_id: 0,
        gender: "male".to_string(),
        age: 4869,
    };

    create_new_user(conn, &admin)?;

    diesel::update(users.filter(username.eq("admin")))
        .set(is_super.eq(true))
        .returning(User::as_returning())
        .get_result(conn)
}

/// ✅ 检查并初始化超级管理员
pub fn initialize_super_admin(pool: &DbPool) {
    let mut conn = &mut pool.get().expect("Failed to get DB connection");

    // 尝试查找 admin 用户
    if get_user_by_username(&mut conn, "admin").is_err() {
        println!("🌟 超级管理员不存在，正在初始化...");
        match create_super_admin(&mut conn) {
            Ok(_) => println!("✅ 初始化超级管理员成功 (账号：admin / 密码：admin)"),
            Err(e) => eprintln!("❌ 初始化超级管理员失败: {:?}", e),
        }
    } else {
        println!("✅ 超级管理员账号已存在。");
    }
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