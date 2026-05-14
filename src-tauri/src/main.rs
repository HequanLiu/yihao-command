#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;

use commands::*;
use db::Database;
use std::sync::Mutex;
use std::path::PathBuf;

fn main() {
    // Get app data directory
    let app_dir = dirs::data_local_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("yihao-command");
    std::fs::create_dir_all(&app_dir).ok();

    let db_path = app_dir.join("data.db");
    let database = Database::new(db_path).expect("Failed to open database");
    let db_state: DbState = Mutex::new(database);

    tauri::Builder::default()
        .manage(db_state)
        .invoke_handler(tauri::generate_handler![
            get_customers,
            create_customer,
            update_customer,
            delete_customer,
            get_tasks,
            create_task,
            update_task,
            delete_task,
            reorder_tasks,
            export_json,
            export_csv,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
