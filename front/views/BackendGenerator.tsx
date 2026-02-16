import React from 'react';
import { Button } from '../components/Button';

export const BackendGenerator: React.FC = () => {
  const goCode = `package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// -- STRUCTS --
type Product struct {
	ID    int     \`json:"id"\`
	Name  string  \`json:"name"\`
	Price float64 \`json:"price"\`
	Qty   int     \`json:"quantity"\`
}

// -- DB INIT --
var db *sql.DB

func initDB() {
	var err error
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_NAME"))
	
	db, err = sql.Open("postgres", connStr)
	if err != nil { log.Fatal(err) }
	
	if err = db.Ping(); err != nil {
		log.Fatal("Cannot connect to DB:", err)
	}
	fmt.Println("Connected to Database")
}

// -- MAIN --
func main() {
	initDB()
	r := gin.Default()

    // Middleware for RBAC would go here
	r.Use(func(c *gin.Context) {
		// Mock RBAC Check
		c.Next()
	})

	r.GET("/api/products", func(c *gin.Context) {
		rows, _ := db.Query("SELECT id, name, price, quantity FROM products")
		defer rows.Close()
		var products []Product
		for rows.Next() {
			var p Product
			rows.Scan(&p.ID, &p.Name, &p.Price, &p.Qty)
			products = append(products, p)
		}
		c.JSON(http.StatusOK, products)
	})

	r.Run(":8080")
}`;

  const dockerCompose = `version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - DB_USER=stock_user
      - DB_PASS=secret123
      - DB_NAME=stock_db
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=stock_user
      - POSTGRES_PASSWORD=secret123
      - POSTGRES_DB=stock_db
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  pgdata:`;

  const sqlInit = `-- init.sql
CREATE TABLE IF NOT EXISTS user_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS group_permissions (
    group_id INT REFERENCES user_groups(id),
    permission_id INT REFERENCES permissions(id),
    PRIMARY KEY (group_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE,
    group_id INT REFERENCES user_groups(id)
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    price DECIMAL(10, 2),
    quantity INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data
INSERT INTO permissions (code, description) VALUES 
('VIEW_STOCK', 'View Stock'), 
('MANAGE_STOCK', 'Manage Stock');
`;

  const CopyBlock = ({ title, code }: { title: string, code: string }) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-700">{title}</h3>
        <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(code)}>Copy</Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Backend & Infrastructure Code</h1>
      <p className="text-gray-600 mb-8">
        This project is currently running in "Mock Mode" for the frontend preview. 
        Below are the generated files required to run the full stack (Go, Postgres, Docker).
      </p>

      <CopyBlock title="docker-compose.yml" code={dockerCompose} />
      <CopyBlock title="backend/main.go (Golang)" code={goCode} />
      <CopyBlock title="db/init.sql (PostgreSQL)" code={sqlInit} />
    </div>
  );
};