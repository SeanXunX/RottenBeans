use crate::models::book::*;
use bigdecimal::BigDecimal;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

pub fn create_book(
    conn: &mut PgConnection,
    isbn: String,
    title: String,
    author: String,
    publisher: String,
    retail_price: BigDecimal,
) -> QueryResult<Book> {
    use crate::schema::books;

    let new_book = NewBook {
        id: Uuid::new_v4(),
        isbn,
        title,
        author,
        publisher,
        retail_price,
    };

    diesel::insert_into(books::table)
        .values(&new_book)
        .returning(Book::as_returning())
        .get_result(conn)
}

pub enum QueryBook {
    Id(Uuid),
    Isbn(String),
    Title(String),
    Author(String),
    Publisher(String),
}

pub fn get_book(conn: &mut PgConnection, query_enum: QueryBook) -> QueryResult<Vec<Book>> {
    use crate::schema::books;

    let query = books::table.into_boxed::<diesel::pg::Pg>();
    match query_enum {
        QueryBook::Id(id_val) => query.filter(books::id.eq(id_val)),
        QueryBook::Isbn(isbn_val) => query.filter(books::isbn.eq(isbn_val)),
        QueryBook::Title(title_val) => query.filter(books::title.eq(title_val)),
        QueryBook::Author(author_val) => query.filter(books::author.eq(author_val)),
        QueryBook::Publisher(publisher_val) => query.filter(books::publisher.eq(publisher_val)),
    }
    .select(Book::as_select())
    .load(conn)
}

#[derive(Deserialize, AsChangeset)]
#[diesel(table_name = crate::schema::books)]
pub struct UpdateBookForm {
    pub title: Option<String>,
    pub author: Option<String>,
    pub publisher: Option<String>,
    pub stock: i32,
    pub retail_price: Option<BigDecimal>,
}

pub fn update(
    conn: &mut PgConnection,
    book_id: Uuid,
    update_form: UpdateBookForm,
) -> QueryResult<Book> {
    use crate::schema::books::dsl::*;

    diesel::update(books.filter(id.eq(book_id)))
        .set(&update_form)
        .returning(Book::as_returning())
        .get_result(conn)
}

pub fn delete(conn: &mut PgConnection, book_id: Uuid) -> QueryResult<usize> {
    use crate::schema::books::dsl::*;

    diesel::delete(books.filter(id.eq(book_id))).execute(conn)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::utils::*;

    #[test]
    fn book_create_get() {
        let conn = &mut establish_connection();
        /*
        燃烧的远征
        作者: [美]拉尔斯·布朗沃思
        出版社: 中信出版社
        出品方: 纸间悦动
        副标题: 十字军东征简史
        原作名: In Distant Lands
        译者: 严匡正
        出版年: 2018-8
        页数: 280
        定价: 45
        装帧: 精装
        ISBN: 9787508690001
         */
        use bigdecimal::FromPrimitive;
        let res = create_book(
            conn,
            String::from("9787508690001"),
            String::from("燃烧的远征"),
            String::from("尔斯·布朗沃思"),
            String::from("中信出版社"),
            BigDecimal::from_f64(45.0).unwrap(),
        );
        println!("{:?}", res);
        assert!(res.is_ok());

        let search = get_book(conn, QueryBook::Title(String::from("燃烧的远征")));
        assert!(search.is_ok());
    }

    // #[test]
    // fn book_update() {
    //     let conn = &mut establish_connection();
        
    // }
}
