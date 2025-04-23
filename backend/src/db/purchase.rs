use crate::models::purchase::*;
use bigdecimal::BigDecimal;
use diesel::prelude::*;
use uuid::Uuid;

pub fn create_purchase(
    conn: &mut PgConnection,
    b_id: Uuid,
    quan: i32,
    price: BigDecimal,
    stat: String,
) -> QueryResult<Purchase> {
    use crate::schema::purchases::dsl::*;

    let new_purchase = NewPurchase {
        book_id: b_id,
        quantity: quan,
        purchase_price: price,
        status: stat,
    };

    diesel::insert_into(purchases)
        .values(&new_purchase)
        .returning(Purchase::as_returning())
        .get_result(conn)
}

pub enum QueryPurchase {
    Id(Uuid),
    Status(String),
}

pub fn get_purchase(
    conn: &mut PgConnection,
    query_enum: QueryPurchase,
) -> QueryResult<Vec<Purchase>> {
    use crate::schema::purchases::dsl::*;

    match query_enum {
        QueryPurchase::Id(i) => purchases
            .filter(id.eq(i))
            .select(Purchase::as_select())
            .load(conn),
        QueryPurchase::Status(s) => purchases
            .filter(status.eq(s))
            .select(Purchase::as_select())
            .load(conn),
    }
}

pub enum UpdatePurchase {
    Status(String),
}

pub fn update(
    conn: &mut PgConnection,
    p_id: Uuid,
    update_enum: UpdatePurchase,
) -> QueryResult<Purchase> {
    use crate::schema::purchases::dsl::*;

    let up = diesel::update(purchases.filter(id.eq(p_id)));
    match update_enum {
        UpdatePurchase::Status(s) => up
            .set(status.eq(s))
            .returning(Purchase::as_returning())
            .get_result(conn),
    }
}

pub fn delete(conn: &mut PgConnection, p_id: Uuid) -> QueryResult<usize> {
    use crate::schema::purchases::dsl::*;

    diesel::delete(purchases.filter(id.eq(p_id))).execute(conn)
}
