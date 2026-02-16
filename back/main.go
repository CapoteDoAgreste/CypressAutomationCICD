package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

var db *sql.DB

type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	SKU         string  `json:"sku"`
	Price       float64 `json:"price"`
	Quantity    int     `json:"quantity"`
	LastUpdated string  `json:"lastUpdated"`
}

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	IsAdmin  bool   `json:"isAdmin"`
	GroupID  string `json:"groupId,omitempty"`
}

type Group struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	PermissionIds []string `json:"permissionIds"`
}

func main() {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	var err error
	db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Erro ao conectar ao banco: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Erro ao comunicar com banco: %v", err)
	}

	log.Println("✅ Conectado ao PostgreSQL com sucesso!")

	mux := http.NewServeMux()

	// Health
	mux.HandleFunc("/api/health", healthHandler)

	// Tratamento genérico para todas as rotas
	mux.HandleFunc("/api/", apiRouter)

	handler := cors.AllowAll().Handler(mux)

	port := ":8080"
	log.Printf("🚀 Backend rodando em http://localhost%s", port)
	log.Fatal(http.ListenAndServe(port, handler))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// Router principal - dispatch por recurso
func apiRouter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	path := strings.TrimPrefix(r.URL.Path, "/api/")
	parts := strings.Split(path, "/")
	
	if len(parts) == 0 {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	resource := parts[0]
	var id string
	if len(parts) > 1 && parts[1] != "" {
		id = parts[1]
	}

	switch resource {
	case "products":
		handleProductRoute(w, r, id)
	case "users":
		handleUserRoute(w, r, id)
	case "groups":
		handleGroupRoute(w, r, id)
	case "health":
		healthHandler(w, r)
	default:
		http.Error(w, "Not found", http.StatusNotFound)
	}
}

// ===== PRODUTOS =====
func handleProductRoute(w http.ResponseWriter, r *http.Request, id string) {
	switch r.Method {
	case http.MethodGet:
		getProductsHandler(w, r)
	case http.MethodPost:
		createProductHandler(w, r)
	case http.MethodPut:
		if id == "" {
			http.Error(w, "ID required", http.StatusBadRequest)
			return
		}
		updateProductHandler(w, r, id)
	case http.MethodDelete:
		if id == "" {
			http.Error(w, "ID required", http.StatusBadRequest)
			return
		}
		deleteProductHandler(w, r, id)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getProductsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, sku, price, quantity, last_updated FROM products ORDER BY id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	products := []Product{}
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.SKU, &p.Price, &p.Quantity, &p.LastUpdated); err != nil {
			continue
		}
		products = append(products, p)
	}

	json.NewEncoder(w).Encode(products)
}

func createProductHandler(w http.ResponseWriter, r *http.Request) {
	var p Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	if p.Price < 0 || p.Quantity < 0 {
		http.Error(w, "Price and quantity must be >= 0", http.StatusBadRequest)
		return
	}

	if p.ID == "" {
		p.ID = fmt.Sprintf("prod-%d", time.Now().UnixNano())
	}
	p.LastUpdated = time.Now().Format(time.RFC3339)

	_, err := db.Exec(
		"INSERT INTO products (id, name, sku, price, quantity, last_updated) VALUES ($1, $2, $3, $4, $5, $6)",
		p.ID, p.Name, p.SKU, p.Price, p.Quantity, p.LastUpdated,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(p)
}

func updateProductHandler(w http.ResponseWriter, r *http.Request, id string) {
	var p Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	if p.Price < 0 || p.Quantity < 0 {
		http.Error(w, "Price and quantity must be >= 0", http.StatusBadRequest)
		return
	}

	p.LastUpdated = time.Now().Format(time.RFC3339)

	result, err := db.Exec(
		"UPDATE products SET name=$1, sku=$2, price=$3, quantity=$4, last_updated=$5 WHERE id=$6",
		p.Name, p.SKU, p.Price, p.Quantity, p.LastUpdated, id,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	affected, _ := result.RowsAffected()
	if affected == 0 {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	p.ID = id
	json.NewEncoder(w).Encode(p)
}

func deleteProductHandler(w http.ResponseWriter, r *http.Request, id string) {
	result, err := db.Exec("DELETE FROM products WHERE id=$1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	affected, _ := result.RowsAffected()
	json.NewEncoder(w).Encode(map[string]int64{"deleted": affected})
}

// ===== USUÁRIOS =====
func handleUserRoute(w http.ResponseWriter, r *http.Request, id string) {
	switch r.Method {
	case http.MethodGet:
		getUsersHandler(w, r)
	case http.MethodPost:
		createUserHandler(w, r)
	case http.MethodDelete:
		if id == "" {
			http.Error(w, "ID required", http.StatusBadRequest)
			return
		}
		deleteUserHandler(w, r, id)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, username, is_admin, COALESCE(group_id, '') FROM users ORDER BY id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	users := []User{}
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Username, &u.IsAdmin, &u.GroupID); err != nil {
			continue
		}
		users = append(users, u)
	}

	json.NewEncoder(w).Encode(users)
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
	var u User
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	if u.ID == "" {
		u.ID = fmt.Sprintf("user-%d", time.Now().UnixNano())
	}

	_, err := db.Exec(
		"INSERT INTO users (id, username, is_admin, group_id) VALUES ($1, $2, $3, $4)",
		u.ID, u.Username, u.IsAdmin, u.GroupID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(u)
}

func deleteUserHandler(w http.ResponseWriter, r *http.Request, id string) {
	result, err := db.Exec("DELETE FROM users WHERE id=$1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	affected, _ := result.RowsAffected()
	json.NewEncoder(w).Encode(map[string]int64{"deleted": affected})
}

// ===== GRUPOS =====
func handleGroupRoute(w http.ResponseWriter, r *http.Request, id string) {
	switch r.Method {
	case http.MethodGet:
		getGroupsHandler(w, r)
	case http.MethodPost:
		createGroupHandler(w, r)
	case http.MethodPut:
		if id == "" {
			http.Error(w, "ID required", http.StatusBadRequest)
			return
		}
		updateGroupHandler(w, r, id)
	case http.MethodDelete:
		if id == "" {
			http.Error(w, "ID required", http.StatusBadRequest)
			return
		}
		deleteGroupHandler(w, r, id)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getGroupsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name FROM user_groups ORDER BY id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	groups := []Group{}
	for rows.Next() {
		var g Group
		if err := rows.Scan(&g.ID, &g.Name); err != nil {
			continue
		}

		permRows, _ := db.Query("SELECT permission_id FROM group_permissions WHERE group_id=$1", g.ID)
		for permRows.Next() {
			var perm string
			if err := permRows.Scan(&perm); err == nil {
				g.PermissionIds = append(g.PermissionIds, perm)
			}
		}
		permRows.Close()

		groups = append(groups, g)
	}

	json.NewEncoder(w).Encode(groups)
}
func createGroupHandler(w http.ResponseWriter, r *http.Request) {
	var g Group
	if err := json.NewDecoder(r.Body).Decode(&g); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	if g.ID == "" {
		g.ID = fmt.Sprintf("group-%d", time.Now().UnixNano())
	}
	if g.PermissionIds == nil {
		g.PermissionIds = []string{}
	}

	// Insert group
	_, err := db.Exec(
		"INSERT INTO user_groups (id, name) VALUES ($1, $2)",
		g.ID, g.Name,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert permissions
	for _, permId := range g.PermissionIds {
		_, err := db.Exec(
			"INSERT INTO group_permissions (group_id, permission_id) VALUES ($1, $2)",
			g.ID, permId,
		)
		if err != nil {
			log.Printf("Erro ao inserir permissão: %v", err)
		}
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(g)
}

func updateGroupHandler(w http.ResponseWriter, r *http.Request, id string) {
	var g Group
	if err := json.NewDecoder(r.Body).Decode(&g); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	g.ID = id
	if g.PermissionIds == nil {
		g.PermissionIds = []string{}
	}

	// Update group name
	result, err := db.Exec(
		"UPDATE user_groups SET name=$1 WHERE id=$2",
		g.Name, id,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	affected, _ := result.RowsAffected()
	if affected == 0 {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	// Delete existing permissions
	_, err = db.Exec("DELETE FROM group_permissions WHERE group_id=$1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert new permissions
	for _, permId := range g.PermissionIds {
		_, err := db.Exec(
			"INSERT INTO group_permissions (group_id, permission_id) VALUES ($1, $2)",
			id, permId,
		)
		if err != nil {
			log.Printf("Erro ao inserir permissão: %v", err)
		}
	}

	json.NewEncoder(w).Encode(g)
}

func deleteGroupHandler(w http.ResponseWriter, r *http.Request, id string) {
	result, err := db.Exec("DELETE FROM user_groups WHERE id=$1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	affected, _ := result.RowsAffected()
	json.NewEncoder(w).Encode(map[string]int64{"deleted": affected})
}