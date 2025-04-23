use actix_web::{App, HttpServer, web};
use backend::db::{establish_pool, user::initialize_super_admin};
use backend::handlers::*;
use dotenvy::dotenv;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = establish_pool(&database_url);

    initialize_super_admin(&pool);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .configure(user::config)
            .service(web::scope("/book").configure(book::config))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
