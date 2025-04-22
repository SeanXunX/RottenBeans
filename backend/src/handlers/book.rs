use actix_web::{get, put, web, HttpResponse, Responder};
use uuid::Uuid;
use bigdecimal::BigDecimal;
use crate::db::DbPool;
use crate::db::book::{self, QueryBook, UpdateBook};
use serde::Deserialize;


#[derive(Deserialize)]
pub struct BookQuery {
    pub id: Option<Uuid>,
    pub isbn: Option<String>,
    pub title: Option<String>,
    pub author: Option<String>,
    pub publisher: Option<String>,
}

/// 更新请求体
#[derive(Deserialize)]
pub struct UpdateBookForm {
    pub title: Option<String>,
    pub author: Option<String>,
    pub publisher: Option<String>,
    pub retail_price: Option<BigDecimal>,
}

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
        return HttpResponse::BadRequest().body("必须提供至少一个查询条件");
    };

    match book::get_book(&mut conn, query_enum) {
        Ok(books) => HttpResponse::Ok().json(books),
        Err(_) => HttpResponse::InternalServerError().body("查询失败"),
    }
}

/// ✅ PUT /books/{id}
#[put("/books/{id}")]
async fn update_book_info(
    pool: web::Data<DbPool>,
    book_id: web::Path<Uuid>,
    web::Json(update_form): web::Json<UpdateBookForm>,
) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let book_id = book_id.into_inner();

    if let Some(title) = update_form.title {
        if let Ok(book) = book::update(&mut conn, book_id, UpdateBook::Title(title)) {
            return HttpResponse::Ok().json(book);
        }
    }
    if let Some(author) = update_form.author {
        if let Ok(book) = book::update(&mut conn, book_id, UpdateBook::Author(author)) {
            return HttpResponse::Ok().json(book);
        }
    }
    if let Some(publisher) = update_form.publisher {
        if let Ok(book) = book::update(&mut conn, book_id, UpdateBook::Publisher(publisher)) {
            return HttpResponse::Ok().json(book);
        }
    }
    if let Some(retail_price) = update_form.retail_price {
        if let Ok(book) = book::update(&mut conn, book_id, UpdateBook::RetailPrice(retail_price)) {
            return HttpResponse::Ok().json(book);
        }
    }

    HttpResponse::BadRequest().body("没有任何需要更新的字段")
}

/// ✅ 路由注册
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(search_books)
       .service(update_book_info);
}
