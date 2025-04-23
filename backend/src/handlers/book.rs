use crate::db::DbPool;
use crate::db::book::{self, QueryBook, UpdateBookForm};
use actix_web::{HttpResponse, Responder, get, put, web};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct BookQuery {
    pub id: Option<Uuid>,
    pub isbn: Option<String>,
    pub title: Option<String>,
    pub author: Option<String>,
    pub publisher: Option<String>,
}

/// search for books
#[get("/search")]
async fn search_books(
    pool: web::Data<DbPool>,
    web::Query(params): web::Query<BookQuery>,
) -> impl Responder {
    let mut conn = pool.get().unwrap();

    let query_enum = if let Some(id) = params.id {
        QueryBook::Id(id)
    } else if let Some(isbn) = params.isbn {
        QueryBook::Isbn(isbn)
    } else if let Some(title) = params.title {
        QueryBook::Title(title)
    } else if let Some(author) = params.author {
        QueryBook::Author(author)
    } else if let Some(publisher) = params.publisher {
        QueryBook::Publisher(publisher)
    } else {
        return HttpResponse::BadRequest().body("At least one query type required.");
    };

    match book::get_book(&mut conn, query_enum) {
        Ok(books) => HttpResponse::Ok().json(books),
        Err(_) => HttpResponse::InternalServerError().body("Query failed."),
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
