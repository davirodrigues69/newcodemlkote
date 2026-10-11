ALTER TABLE students ADD COLUMN guardian_email TEXT;
ALTER TABLE students ADD COLUMN guardian_relationship TEXT;
ALTER TABLE students ADD COLUMN guardian_two_name TEXT;
ALTER TABLE students ADD COLUMN guardian_two_email TEXT;
ALTER TABLE students ADD COLUMN guardian_two_relationship TEXT;
ALTER TABLE students ADD COLUMN guardian_emails_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE students ADD COLUMN class_group_id TEXT;

ALTER TABLE assignments ADD COLUMN student_email TEXT;
ALTER TABLE assignments ADD COLUMN student_name TEXT;
ALTER TABLE assignments ADD COLUMN guardian_emails_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE assignments ADD COLUMN assignment_instructions TEXT;
ALTER TABLE assignments ADD COLUMN due_at TEXT;
ALTER TABLE assignments ADD COLUMN pdf_url TEXT;
ALTER TABLE assignments ADD COLUMN pdf_name TEXT;
ALTER TABLE assignments ADD COLUMN pdf_size INTEGER;

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT,
  guardian_emails_json TEXT NOT NULL DEFAULT '[]',
  teacher_id TEXT NOT NULL,
  teacher_name TEXT,
  start_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  format TEXT NOT NULL CHECK(format IN ('online','presential')),
  meeting_url TEXT,
  location TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS pedagogical_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT,
  guardian_emails_json TEXT NOT NULL DEFAULT '[]',
  period TEXT NOT NULL,
  summary TEXT NOT NULL,
  skills TEXT,
  next_steps TEXT NOT NULL,
  created_by TEXT NOT NULL,
  teacher_name TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS academic_structure (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('school','course','class_group')),
  name TEXT NOT NULL,
  school_id TEXT,
  course_id TEXT,
  modality TEXT CHECK(modality IN ('online','presential')),
  schedule TEXT,
  meeting_url TEXT,
  address TEXT,
  description TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_guardian_email ON students(guardian_email);
CREATE INDEX IF NOT EXISTS idx_students_guardian_two_email ON students(guardian_two_email);
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON lessons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_student_email ON lessons(student_email);
CREATE INDEX IF NOT EXISTS idx_pedagogical_student_email ON pedagogical_records(student_email);
CREATE INDEX IF NOT EXISTS idx_academic_structure_created_by ON academic_structure(created_by);

PRAGMA optimize;
