use diesel::prelude::*;
use crate::models::book::*;
use bigdecimal::BigDecimal;
use uuid::Uuid;

pub fn create_user(
    conn: &mut PgConnection,
    isbn: String,
    title: String,
    author: String,
    publisher: String,
    retail_price: BigDecimal,
) -> QueryResult<Book> {
    use crate::schema::books;

    let new_book = NewBook {
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

pub fn get_book(
    conn: &mut PgConnection,
    query_enum: QueryBook
) -> QueryResult<Vec<Book>> {
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

pub enum UpdateBook {
    Title(String),
    Author(String),
    Publisher(String),
    RetailPrice(BigDecimal),
    Stock(i32),
}

pub fn update(
    conn: &mut PgConnection,
    book_id: Uuid,
    update_enum: UpdateBook
) -> QueryResult<Book> {
    use crate::schema::books::dsl::*;

    let up = diesel::update(books.filter(id.eq(book_id)));
    match update_enum {
        UpdateBook::Title(t) => up.set(title.eq(t)).returning(Book::as_returning()).get_result(conn),
        UpdateBook::Author(a) => up.set(author.eq(a)).returning(Book::as_returning()).get_result(conn),
        UpdateBook::Publisher(p) => up.set(publisher.eq(p)).returning(Book::as_returning()).get_result(conn),
        UpdateBook::RetailPrice(r) => up.set(retail_price.eq(r)).returning(Book::as_returning()).get_result(conn),
        UpdateBook::Stock(delta) => up.set(stock.eq(stock + delta)).returning(Book::as_returning()).get_result(conn),
    } 

}

pub fn delete(
    conn: &mut PgConnection,
    book_id: Uuid
) -> QueryResult<usize> {
    use crate::schema::books::dsl::*;

    diesel::delete(books.filter(id.eq(book_id))).execute(conn)
}