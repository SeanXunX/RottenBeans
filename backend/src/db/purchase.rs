use crate::models::purchase::*;
use bigdecimal::BigDecimal;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

pub fn create_new_purchase(
    conn: &mut PgConnection,
    new_purchase: &NewPurchase,
) -> QueryResult<Purchase> {
    use crate::schema::purchases::dsl::*;
    diesel::insert_into(purchases)
        .values(new_purchase)
        .returning(Purchase::as_returning())
        .get_result(conn)
}

pub fn create_purchase(
    conn: &mut PgConnection,
    b_id: Uuid,
    quan: i32,
    price: BigDecimal,
    stat: String,
) -> QueryResult<Purchase> {
    // use crate::schema::purchases::dsl::*;

    let new_purchase = NewPurchase {
        id: Uuid::new_v4(),
        book_id: b_id,
        quantity: quan,
        purchase_price: price,
        status: stat,
    };

    create_new_purchase(conn, &new_purchase)

    // diesel::insert_into(purchases)
    //     .values(&new_purchase)
    //     .returning(Purchase::as_returning())
    //     .get_result(conn)
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

pub fn get_all_purchases(conn: &mut PgConnection) -> QueryResult<Vec<Purchase>> {
    use crate::schema::purchases::dsl::*;
    purchases
        .order((created_at.desc(), status.asc()))
        .load::<Purchase>(conn)
}

#[derive(AsChangeset, Deserialize)]
#[diesel(table_name = crate::schema::purchases)]
pub struct UpdatePurchase {
    pub status: Option<String>,
}

pub fn update(
    conn: &mut PgConnection,
    p_id: Uuid,
    update_info: &UpdatePurchase,
) -> QueryResult<Purchase> {
    use crate::schema::purchases::dsl::*;

    let up = diesel::update(purchases.filter(id.eq(p_id)));

    up.set(update_info)
        .returning(Purchase::as_returning())
        .get_result(conn)
}

pub fn delete(conn: &mut PgConnection, p_id: Uuid) -> QueryResult<usize> {
    use crate::schema::purchases::dsl::*;

    diesel::delete(purchases.filter(id.eq(p_id))).execute(conn)
}
