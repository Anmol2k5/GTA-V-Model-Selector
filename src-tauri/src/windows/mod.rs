//! Windows-specific functionality for the overlay application.

mod setup;

pub use setup::force_layered_alpha_opaque;
pub use setup::set_content_protection;
pub use setup::setup_overlay_window;
