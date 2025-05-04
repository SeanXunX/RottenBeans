use crate::models::finance::*;
use bigdecimal::BigDecimal;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use uuid::Uuid;

pub fn create_new_log(conn: &mut PgConnection, new_log: &NewFinanceLog) -> QueryResult<FinanceLog> {
    use crate::schema::finance_logs::dsl::*;
    diesel::insert_into(finance_logs)
        .values(new_log)
        .returning(FinanceLog::as_returning())
        .get_result(conn)
}

pub fn create_log(
    conn: &mut PgConnection,
    act_type: String,
    amt: BigDecimal,
) -> QueryResult<FinanceLog> {
    use crate::schema::finance_logs::dsl::*;

    let new_log = NewFinanceLog {
        id: Uuid::new_v4(),
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
    end: NaiveDateTime,
) -> QueryResult<Vec<FinanceLog>> {
    use crate::schema::finance_logs::dsl::*;

    finance_logs
        .filter(created_at.ge(start).and(created_at.le(end)))
        .select(FinanceLog::as_returning())
        .order(created_at.desc())
        .load(conn)
}
