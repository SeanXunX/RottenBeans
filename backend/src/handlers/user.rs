use crate::auth::*;
use crate::db::{DbPool, user::*};
use crate::models::user::*;
use actix_web::{HttpResponse, Responder, get, post, put, web};
use md5;
use serde::{Deserialize, Serialize};

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
                HttpResponse::Ok().json(LoginResponse {
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
        let mut new_user = new_user.into_inner();
        new_user.password = format!("{:x}", md5::compute(&new_user.password));
        match crate::db::user::create_new_user(&mut conn, &new_user) {
            Ok(u) => HttpResponse::Created().json(u),
            Err(e) => HttpResponse::InternalServerError()
                .body(format!("Failed to create new user: {:?}", e)),
        }
    } else {
        HttpResponse::Unauthorized().body("Only super users can create users")
    }
}

#[get("/me")]
async fn get_my_info(pool: web::Data<DbPool>, user: AuthUser) -> impl Responder {
    let mut conn = pool.get().unwrap();
    match get_user_by_username(&mut conn, &user.username) {
        Ok(u) => HttpResponse::Ok().json(u),
        Err(e) => HttpResponse::InternalServerError().body(format!("Failed to get info: {:?}", e)),
    }
}

#[put("/me")]
async fn update_my_info(
    pool: web::Data<DbPool>,
    user: AuthUser,
    info: web::Json<UpdateUserInfo>,
) -> impl Responder {
    let mut conn = pool.get().unwrap();
    match update_user_info(&mut conn, &user.username, &info.into_inner()) {
        Ok(u) => HttpResponse::Ok().json(u),
        Err(_) => HttpResponse::InternalServerError().body("Failed to update info"),
    }
}

#[get("/users")]
async fn list_all_users(pool: web::Data<DbPool>, user: AuthUser) -> impl Responder {
    if !user.is_super {
        HttpResponse::Forbidden().body("Only super user can access all users")
    } else {
        let mut conn = pool.get().unwrap();
        match get_all_users(&mut conn) {
            Ok(u) => HttpResponse::Ok().json(u),
            Err(_) => HttpResponse::InternalServerError().body("Failed to access"),
        }
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(login)
        .service(create_user)
        .service(get_my_info)
        .service(update_my_info)
        .service(list_all_users);
}
