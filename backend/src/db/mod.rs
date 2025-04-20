pub mod utils;
pub mod user;
pub mod book;
pub mod finance;
pub mod purchase;

use diesel::pg::PgConnection;
use diesel::r2d2::{self, ConnectionManager};

pub type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub fn establish_pool(database_url: &str) -> DbPool {
    // 创建连接管理器
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    
    // 使用 r2d2 构建连接池
    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create DB pool")
}