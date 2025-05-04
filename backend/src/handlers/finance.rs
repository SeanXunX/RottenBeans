use crate::{
    db::{DbPool, finance::*},
    models::finance::NewFinanceLog,
};
use actix_web::{HttpResponse, Responder, post, web};

#[post("/create")]
async fn create(pool: web::Data<DbPool>, new_log: web::Json<NewFinanceLog>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let new_log = new_log.into_inner();
    match create_new_log(&mut conn, &new_log) {
        Ok(log) => HttpResponse::Created().json(log),
        Err(_) => HttpResponse::InternalServerError().body("Failed to create log"),
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create);
}
