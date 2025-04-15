use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::NaiveDateTime;
use bigdecimal::BigDecimal;
use diesel::prelude::*;

#[derive(Queryable, Serialize)]
pub struct FinanceLog {
    pub id: Uuid,
    pub action_type: String, // income / expense
    pub amount: BigDecimal,
    pub note: Option<String>,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = crate::schema::finance_logs)]
pub struct NewFinanceLog {
    pub action_type: String,
    pub amount: BigDecimal,
    pub note: Option<String>,
}
