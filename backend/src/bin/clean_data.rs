use backend::models::book::NewBook;
use serde_json::{from_str, to_string_pretty};
use std::fs;
use std::path::Path;
use uuid::Uuid;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let data_path = Path::new("/home/sean/RottenBeans/book_scraper/book_scraper/douban_book.json");
    let file_content = fs::read_to_string(data_path).map_err(|e| {
        println!("Failed to read file: {e}");
        e
    })?;
    let file_content = file_content.replace("元", "");
    let mut books: Vec<NewBook> = from_str(&file_content)?;

    for book in books.iter_mut() {
        book.id = Uuid::new_v4();
    }

    let updated_content = to_string_pretty(&books)?;
    fs::write(data_path, updated_content)?;
    Ok(())
}
