CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student','parent','teacher','admin')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name_normalized TEXT NOT NULL,
  email TEXT,
  birth_date TEXT,
  course TEXT,
  guardian_name TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  resource_url TEXT,
  content_type TEXT NOT NULL,
  age_group TEXT,
  estimated_minutes INTEGER NOT NULL DEFAULT 30,
  teacher_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  assigned_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned',
  assigned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(content_id, student_id),
  FOREIGN KEY(content_id) REFERENCES contents(id),
  FOREIGN KEY(student_id) REFERENCES students(id)
);

CREATE INDEX IF NOT EXISTS idx_students_full_name_normalized
ON students(full_name_normalized);

CREATE INDEX IF NOT EXISTS idx_students_created_by
ON students(created_by);

CREATE INDEX IF NOT EXISTS idx_contents_teacher_id
ON contents(teacher_id);

CREATE INDEX IF NOT EXISTS idx_assignments_student_id
ON assignments(student_id);

PRAGMA optimize;
