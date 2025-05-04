use crate::db::{DbPool, purchase::*};
use crate::models::purchase::*;
use actix_web::{HttpResponse, Responder, delete, get, post, put, web};
use uuid::Uuid;

#[post("/create")]
async fn create(pool: web::Data<DbPool>, new_purchase: web::Json<NewPurchase>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let new_purchase = new_purchase.into_inner();
    match create_new_purchase(&mut conn, &new_purchase) {
        Ok(p) => HttpResponse::Created().json(p),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Failed to create purhcase: {}", e))
        }
    }
}

/// Updates state. Initial state is "Unpaid".
///     - "Paid": Add a record to Finance and update Book stock.
///     - "Returned"
#[put("/update/{id}")]
async fn update_purchase_state(
    pool: web::Data<DbPool>,
    id: web::Path<Uuid>,
    update_info: web::Json<UpdatePurchase>,
) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let id = id.into_inner();
    let update_info = update_info.into_inner();
    match update(&mut conn, id, &update_info) {
        Ok(p) => HttpResponse::Ok().json(p),
        Err(_) => HttpResponse::InternalServerError().body("Failed to update state."),
    }
}

#[get("/list")]
async fn list_all_purchases(pool: web::Data<DbPool>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    match get_all_purchases(&mut conn) {
        Ok(ps) => HttpResponse::Ok().json(ps),
        Err(_) => HttpResponse::InternalServerError().body("Failed to get purchases"),
    }
}

#[delete("/return/{p_id}")]
async fn return_purchase(pool: web::Data<DbPool>, p_id: web::Path<Uuid>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let p_id = p_id.into_inner();
    match delete(&mut conn, p_id) {
        Ok(_) => HttpResponse::Ok().body("Deleted successfully."),
        Err(_) => HttpResponse::InternalServerError().body("Failed to delete"),
    }
}

/// Register route
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create)
        .service(update_purchase_state)
        .service(list_all_purchases)
        .service(return_purchase);
}
