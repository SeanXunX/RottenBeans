use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::NaiveDateTime;
use bigdecimal::BigDecimal;
use diesel::prelude::*;

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::finance_logs)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct FinanceLog {
    pub id: Uuid,
    pub action_type: String, // income / expense
    pub amount: BigDecimal,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = crate::schema::finance_logs)]
pub struct NewFinanceLog {
    pub id: Uuid,
    pub action_type: String,
    pub amount: BigDecimal,
}
