use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::NaiveDateTime;
use bigdecimal::BigDecimal;
use diesel::prelude::*;


#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::purchases)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Purchase {
    pub id: Uuid,
    pub book_id: Uuid,
    pub quantity: i32,
    pub purchase_price: BigDecimal,
    pub status: String,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = crate::schema::purchases)]
pub struct NewPurchase {
    pub book_id: Uuid,
    pub quantity: i32,
    pub purchase_price: BigDecimal,
    pub status: String,
}
