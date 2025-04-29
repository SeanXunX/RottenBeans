use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::NaiveDateTime;
use diesel::prelude::*;


#[derive(Queryable, Selectable, Serialize, Debug)]
#[diesel(table_name = crate::schema::books)]
#[diesel(check_for_backend(diesel::pg::Pg))]
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

#[derive(Insertable, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::books)]
pub struct NewBook {
    pub id: Uuid,
    pub isbn: String,
    pub title: String,
    pub author: String,
    pub publisher: String,
    pub retail_price: bigdecimal::BigDecimal,
}
