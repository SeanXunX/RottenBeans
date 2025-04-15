use diesel::prelude::*;
use crate::models::purchase::*;
use uuid::Uuid;
use bigdecimal::BigDecimal;

pub fn create_purchase(
    conn: &mut PgConnection,
    b_id: Uuid,
    quan: i32,
    price: BigDecimal,
    stat: &str,
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

pub fn get_purch() {

}

pub fn update() {

}

pub fn delete() {

}
