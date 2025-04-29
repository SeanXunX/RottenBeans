use backend::{db::utils::establish_connection, models::book::NewBook};
use serde_json;
use std::{fs::read_to_string, path::Path};
use diesel::{dsl::insert_into, prelude::*};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut conn = establish_connection();
    let data_path = Path::new("/home/sean/RottenBeans/book_scraper/book_scraper/douban_book.json");
    let file_content = read_to_string(data_path)?;
    let data: Vec<NewBook> = serde_json::from_str(&file_content)?;
    use backend::schema::books::dsl::*;
    insert_into(books)
        .values(&data)
        .execute(&mut conn)?;
    Ok(())
}
