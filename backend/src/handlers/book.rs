use crate::db::DbPool;
use crate::db::book::{self, QueryBook, UpdateBookForm};
use actix_web::{HttpResponse, Responder, get, put, web};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize, Debug)]
pub struct BookQuery {
    pub search_type: Option<String>,
    pub search_value: Option<String>,
    // pub id: Option<Uuid>,
    // pub isbn: Option<String>,
    // pub title: Option<String>,
    // pub author: Option<String>,
    // pub publisher: Option<String>,
}

/// search for books
#[get("/search")]
async fn search_books(
    pool: web::Data<DbPool>,
    web::Query(params): web::Query<BookQuery>,
) -> impl Responder {
    let mut conn = pool.get().unwrap();

    if let Some(search_type) = params.search_type {
        let search_value = params.search_value.unwrap();
        let query_enum = match search_type.as_str() {
            "id" => QueryBook::Id(Uuid::parse_str(search_value.as_str()).unwrap()),
            "isbn" => QueryBook::Isbn(search_value),
            "title" => QueryBook::Title(search_value),
            "author" => QueryBook::Author(search_value),
            "publisher" => QueryBook::Publisher(search_value),
            _ => return HttpResponse::BadRequest().body("Invalid query type."),
        };
        match book::get_book(&mut conn, query_enum) {
            Ok(books) => HttpResponse::Ok().json(books),
            Err(_) => HttpResponse::InternalServerError().body("Query failed."),
        }
    } else {
        return HttpResponse::BadRequest().body(format!("Receive:{:?}.\nNo query type provided.", params));
    }
}

/// update book info
#[put("/update/{id}")]
async fn update_book_info(
    pool: web::Data<DbPool>,
    book_id: web::Path<Uuid>,
    web::Json(update_form): web::Json<UpdateBookForm>,
) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let book_id = book_id.into_inner();

    match book::update(&mut conn, book_id, update_form) {
        Ok(b) => HttpResponse::Ok().json(b),
        Err(_) => HttpResponse::InternalServerError().body("Update failed."),
    }
}

/// Register route
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(search_books).service(update_book_info);
}
