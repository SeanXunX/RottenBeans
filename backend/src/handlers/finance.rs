use crate::{
    db::{DbPool, finance::*},
    models::finance::NewFinanceLog,
};
use actix_web::{HttpResponse, Responder, get, post, web};
use chrono::NaiveDateTime;
use serde::Deserialize;

#[post("/create")]
async fn create(pool: web::Data<DbPool>, new_log: web::Json<NewFinanceLog>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let new_log = new_log.into_inner();
    match create_new_log(&mut conn, &new_log) {
        Ok(log) => HttpResponse::Created().json(log),
        Err(_) => HttpResponse::InternalServerError().body("Failed to create log"),
    }
}

#[derive(Deserialize)]
pub struct LogQuery {
    pub start: NaiveDateTime,
    pub end: NaiveDateTime,
}

#[get("/logs")]
async fn get_logs(pool: web::Data<DbPool>, query: web::Query<LogQuery>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let start = query.start;
    let end = query.end;

    match get_log(&mut conn, start, end) {
        Ok(logs) => HttpResponse::Ok().json(logs),
        Err(_) => HttpResponse::InternalServerError().body("Failed to fetch logs"),
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create).service(get_logs);
}
