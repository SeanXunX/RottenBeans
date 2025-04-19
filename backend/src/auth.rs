use std::env;
use serde::{Serialize, Deserialize};
use jsonwebtoken::{encode, decode, Header, EncodingKey, DecodingKey, Validation};
use actix_web::{FromRequest, Error, HttpRequest, dev::Payload};
use futures_util::future::{ready, Ready};


fn get_secret_key() -> Vec<u8> {
    env::var("SECRET_KEY")
        .expect("SECRET_KEY not set")
        .as_bytes()
        .to_vec()
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub username: String,
    pub is_super: bool,
}

pub fn generate_token(username:& str, is_super: bool) -> String {
    let key = get_secret_key();

    let claims = Claims {
        username: username.to_string(), 
        is_super,
    };

    encode(&Header::default(), &claims, &EncodingKey::from_secret(&key)).unwrap()
}

pub fn verify_token(token: &str) -> Option<Claims> {
    let key = get_secret_key();

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(&key),
        &Validation::default(),
    )
    .map(|data| data.claims)
    .ok()
}

#[derive(Debug, Clone)]
pub struct AuthUser {
    pub username: String,
    pub is_super: bool,
}

impl FromRequest for AuthUser {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        // Get token from Header
        let token_opt = req
            .headers()
            .get("Authorization")
            .and_then(|value| value.to_str().ok())
            .and_then(|header| {
                if header.starts_with("Bearer ") {
                    Some(header[7..].to_string())
                } else {
                    None
                }
            });

        if let Some(token) = token_opt {
            if let Some(claims) = verify_token(&token) {
                return ready(Ok(AuthUser {
                    username: claims.username,
                    is_super: claims.is_super,
                }));
            }
        }

        ready(Err(actix_web::error::ErrorUnauthorized("Invalid token")))
    }
}