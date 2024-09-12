-- Tabla para tableros (boards)
CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para tarjetas (cards)
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  board_id INT REFERENCES boards(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para tareas (tasks)
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  card_id INT REFERENCES cards(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
