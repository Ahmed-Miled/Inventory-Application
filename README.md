# Inventory-Application
Inventory management app for an imaginary store (car parts)


Database relationships Summary

One Category → many Parts.
One Part → many Suppliers (optional, via join table).

Database structure

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE parts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  manufacturer TEXT,
  part_number TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

ALTER TABLE parts ADD COLUMN brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL;
