use crate::db::{Customer, CustomerInput, Task, TaskInput, Database};
use std::sync::Mutex;
use tauri::State;

pub type DbState = Mutex<Database>;

#[tauri::command]
pub fn get_customers(db: State<DbState>) -> Result<Vec<Customer>, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.get_customers().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_customer(db: State<DbState>, data: CustomerInput) -> Result<Customer, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.create_customer(data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_customer(db: State<DbState>, id: String, data: CustomerInput) -> Result<Customer, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.update_customer(&id, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_customer(db: State<DbState>, id: String) -> Result<bool, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.delete_customer(&id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_tasks(db: State<DbState>) -> Result<Vec<Task>, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.get_tasks().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_task(db: State<DbState>, data: TaskInput) -> Result<Task, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.create_task(data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_task(db: State<DbState>, id: String, data: TaskInput) -> Result<Task, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.update_task(&id, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_task(db: State<DbState>, id: String) -> Result<bool, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.delete_task(&id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn reorder_tasks(db: State<DbState>, ids: Vec<String>) -> Result<bool, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.reorder_tasks(ids).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn export_json(db: State<DbState>) -> Result<String, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.export_json().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn export_csv(db: State<DbState>, table: String) -> Result<String, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.export_csv(&table).map_err(|e| e.to_string())
}
