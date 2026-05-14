use rusqlite::{Connection, Result, params};
use std::sync::Mutex;
use std::path::PathBuf;

pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(path: PathBuf) -> Result<Self> {
        let conn = Connection::open(path)?;
        let db = Self { conn: Mutex::new(conn) };
        db.init_tables()?;
        Ok(db)
    }

    fn init_tables(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "CREATE TABLE IF NOT EXISTS customers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT DEFAULT '',
                phone TEXT DEFAULT '',
                company TEXT DEFAULT '',
                notes TEXT DEFAULT '',
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            )",
            [],
        )?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                status TEXT NOT NULL DEFAULT 'todo',
                position INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            )",
            [],
        )?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )",
            [],
        )?;
        Ok(())
    }
}

// ── Customers ──────────────────────────────────────────────

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
pub struct Customer {
    pub id: String,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub company: String,
    pub notes: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, serde::Deserialize)]
pub struct CustomerInput {
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub company: Option<String>,
    pub notes: Option<String>,
}

impl Database {
    pub fn get_customers(&self) -> Result<Vec<Customer>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, name, email, phone, company, notes, created_at, updated_at FROM customers ORDER BY created_at DESC")?;
        let rows = stmt.query_map([], |row| {
            Ok(Customer {
                id: row.get(0)?,
                name: row.get(1)?,
                email: row.get(2)?,
                phone: row.get(3)?,
                company: row.get(4)?,
                notes: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })?;
        rows.collect()
    }

    pub fn create_customer(&self, input: CustomerInput) -> Result<Customer> {
        let conn = self.conn.lock().unwrap();
        let id = uuid::Uuid::new_v4().to_string();
        let now = chrono::Utc::now().timestamp_millis();
        conn.execute(
            "INSERT INTO customers (id, name, email, phone, company, notes, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![id, input.name, input.email.as_deref().unwrap_or(""), input.phone.as_deref().unwrap_or(""), input.company.as_deref().unwrap_or(""), input.notes.as_deref().unwrap_or(""), now, now],
        )?;
        Ok(Customer {
            id,
            name: input.name,
            email: input.email.unwrap_or_default(),
            phone: input.phone.unwrap_or_default(),
            company: input.company.unwrap_or_default(),
            notes: input.notes.unwrap_or_default(),
            created_at: now,
            updated_at: now,
        })
    }

    pub fn update_customer(&self, id: &str, input: CustomerInput) -> Result<Customer> {
        let conn = self.conn.lock().unwrap();
        let now = chrono::Utc::now().timestamp_millis();
        conn.execute(
            "UPDATE customers SET name=?1, email=?2, phone=?3, company=?4, notes=?5, updated_at=?6 WHERE id=?7",
            params![input.name, input.email.as_deref().unwrap_or(""), input.phone.as_deref().unwrap_or(""), input.company.as_deref().unwrap_or(""), input.notes.as_deref().unwrap_or(""), now, id],
        )?;
        let mut stmt = conn.prepare("SELECT id, name, email, phone, company, notes, created_at, updated_at FROM customers WHERE id=?1")?;
        stmt.query_row([id], |row| {
            Ok(Customer {
                id: row.get(0)?,
                name: row.get(1)?,
                email: row.get(2)?,
                phone: row.get(3)?,
                company: row.get(4)?,
                notes: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })
    }

    pub fn delete_customer(&self, id: &str) -> Result<bool> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM customers WHERE id=?1", [id])?;
        Ok(true)
    }
}

// ── Tasks ───────────────────────────────────────────────────

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
    pub position: i32,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, serde::Deserialize)]
pub struct TaskInput {
    pub title: String,
    pub description: Option<String>,
    pub status: Option<String>,
    pub position: Option<i32>,
}

impl Database {
    pub fn get_tasks(&self) -> Result<Vec<Task>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, title, description, status, position, created_at, updated_at FROM tasks ORDER BY position ASC")?;
        let rows = stmt.query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                status: row.get(3)?,
                position: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?;
        rows.collect()
    }

    pub fn create_task(&self, input: TaskInput) -> Result<Task> {
        let conn = self.conn.lock().unwrap();
        let id = uuid::Uuid::new_v4().to_string();
        let now = chrono::Utc::now().timestamp_millis();
        let status = input.status.unwrap_or_else(|| "todo".to_string());
        let position = input.position.unwrap_or(0);
        conn.execute(
            "INSERT INTO tasks (id, title, description, status, position, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![id, input.title, input.description.as_deref().unwrap_or(""), status, position, now, now],
        )?;
        Ok(Task {
            id,
            title: input.title,
            description: input.description.unwrap_or_default(),
            status,
            position,
            created_at: now,
            updated_at: now,
        })
    }

    pub fn update_task(&self, id: &str, input: TaskInput) -> Result<Task> {
        let conn = self.conn.lock().unwrap();
        let now = chrono::Utc::now().timestamp_millis();

        // Fetch current
        let mut stmt = conn.prepare("SELECT id, title, description, status, position, created_at, updated_at FROM tasks WHERE id=?1")?;
        let mut task: Task = stmt.query_row([id], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                status: row.get(3)?,
                position: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?;

        let title = if input.title.is_empty() { task.title } else { input.title };
        let description = input.description.unwrap_or(task.description.clone());
        let status = input.status.unwrap_or(task.status.clone());
        let position = input.position.unwrap_or(task.position);

        conn.execute(
            "UPDATE tasks SET title=?1, description=?2, status=?3, position=?4, updated_at=?5 WHERE id=?6",
            params![title, description, status, position, now, id],
        )?;

        task.title = title;
        task.description = description;
        task.status = status;
        task.position = position;
        task.updated_at = now;
        Ok(task)
    }

    pub fn delete_task(&self, id: &str) -> Result<bool> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM tasks WHERE id=?1", [id])?;
        Ok(true)
    }

    pub fn reorder_tasks(&self, ids: Vec<String>) -> Result<bool> {
        let conn = self.conn.lock().unwrap();
        for (pos, id) in ids.iter().enumerate() {
            conn.execute("UPDATE tasks SET position=?1 WHERE id=?2", params![pos as i32, id])?;
        }
        Ok(true)
    }
}

// ── Export ──────────────────────────────────────────────────

impl Database {
    pub fn export_json(&self) -> Result<String> {
        let customers = self.get_customers()?;
        let tasks = self.get_tasks()?;
        let data = serde_json::json!({ "customers": customers, "tasks": tasks });
        Ok(serde_json::to_string_pretty(&data).unwrap())
    }

    pub fn export_csv(&self, table: &str) -> Result<String, String> {
        if table == "customers" {
            let customers = self.get_customers()?;
            let mut lines = vec!["id,name,email,phone,company,notes,created_at,updated_at".to_string()];
            for c in customers {
                lines.push(format!("{},{},{},{},{},{},{},{}",
                    escape_csv(&c.id), escape_csv(&c.name), escape_csv(&c.email),
                    escape_csv(&c.phone), escape_csv(&c.company), escape_csv(&c.notes),
                    c.created_at, c.updated_at))
            }
            Ok(lines.join("\n"))
        } else {
            let tasks = self.get_tasks()?;
            let mut lines = vec!["id,title,description,status,position,created_at,updated_at".to_string()];
            for t in tasks {
                lines.push(format!("{},{},{},{},{},{},{}",
                    escape_csv(&t.id), escape_csv(&t.title), escape_csv(&t.description),
                    t.status, t.position, t.created_at, t.updated_at))
            }
            Ok(lines.join("\n"))
        }
    }
}

fn escape_csv(s: &str) -> String {
    if s.contains(',') || s.contains('"') || s.contains('\n') {
        format!("\"{}\"", s.replace('"', "\"\""))
    } else {
        s.to_string()
    }
}
