use diesel::prelude::*;
use crate::models::finance::*;
use bigdecimal::BigDecimal;
use chrono::NaiveDateTime;

pub fn create_log(
    conn: &mut PgConnection,
    act_type: String,
    amt: BigDecimal
) -> QueryResult<FinanceLog> {
    use crate::schema::finance_logs::dsl::*;

    let new_log = NewFinanceLog {
        action_type: act_type,
        amount: amt,
    };

    diesel::insert_into(finance_logs)
        .values(&new_log)
        .returning(FinanceLog::as_returning())
        .get_result(conn)
}

pub fn get_log(
    conn: &mut PgConnection,
    start: NaiveDateTime,
    end: NaiveDateTime
) -> QueryResult<Vec<FinanceLog>> {
    use crate::schema::finance_logs::dsl::*;

    finance_logs.filter(created_at.ge(start).and(created_at.le(end)))
        .select(FinanceLog::as_returning())
        .load(conn)
}