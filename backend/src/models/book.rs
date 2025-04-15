use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::NaiveDateTime;
use diesel::prelude::*;


#[derive(Queryable, Serialize)]
pub struct Book {
    pub id: Uuid,
    pub isbn: String,
    pub title: String,
    pub author: String,
    pub publisher: String,
    pub retail_price: bigdecimal::BigDecimal,
    pub stock: i32,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = crate::schema::books)]
pub struct NewBook {
    pub isbn: String,
    pub title: String,
    pub author: String,
    pub publisher: String,
    pub retail_price: bigdecimal::BigDecimal,
}
