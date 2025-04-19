pub mod utils;
pub mod user;
pub mod book;
pub mod finance;
pub mod purchase;

use diesel::pg::PgConnection;
use diesel::r2d2::{self, ConnectionManager};

pub type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;
