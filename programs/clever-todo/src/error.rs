use anchor_lang::prelude::*;

#[error_code]
// #[derive(Default)]
pub enum TodoError {
    #[msg("You are not authorzed to perform this action ")]
    Unauthorized,
    #[msg("Not Allowed")]
    NotAllowed,
    #[msg("Math Operatin OVerflow")]
    MathOverflow,
    #[msg("ALready Marked")]
    AlredyMarked,
}