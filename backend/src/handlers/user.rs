use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use crate::db::{
    DbPool,
    user::*,
};
use md5;
use crate::auth::*;
use crate::models::user::*;



#[derive(Deserialize)]
pub struct LoginForm {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub is_super: bool,
}

#[post("/login")]
async fn login(pool: web::Data<DbPool>, data: web::Json<LoginForm>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let user = get_user_by_username(&mut conn, &data.username);
    
    match user {
        Ok(user) => {
            let hashed_input = format!("{:x}", md5::compute(&data.password));
            if hashed_input == user.password {
                let token = generate_token(&user.username, user.is_super);
                HttpResponse::Ok().json(LoginResponse{
                    token,
                    is_super: user.is_super,
                })
            } else {
                HttpResponse::Unauthorized().body("password incorrect")
            }
        }
        Err(_) => HttpResponse::Unauthorized().body("invalid username"),
    }
}

#[post("/users")]
async fn create_user(
    pool: web::Data<DbPool>,
    user: AuthUser,
    new_user: web::Json<NewUser>,
) -> impl Responder {
    if user.is_super {
        let mut conn = pool.get().unwrap();
        let password = format!("{:x}", md5::compute(&new_user.password));
        match crate::db::user::create_user(
            &mut conn,
            new_user.username,
            password,
            new_user.real_name,
            new_user.employee_id,
            new_user.gender,
            new_user.age
        ) {
            Ok(u) => HttpResponse::Created().json(u),
            Err(_) => 
        }
    } else {
        HttpResponse::Unauthorized().body("Only super user can create users")
    }
}