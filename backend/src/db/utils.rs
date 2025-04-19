use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

use crate::db::DbPool;
use diesel::pg::PgConnection;
use diesel::r2d2::{self, ConnectionManager};

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url).unwrap_or_else(|_| panic!("Error connecting to {database_url}"))
}

pub fn establish_pool() -> DbPool {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    r2d2::Pool::builder()
        .build(manager)
        .expect("DbPool establishing failed")
}