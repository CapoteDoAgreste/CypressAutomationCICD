CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  group_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_groups (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_permissions (
  group_id VARCHAR(36) NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
  permission_id VARCHAR(100) NOT NULL,
  PRIMARY KEY (group_id, permission_id)
);

CREATE INDEX idx_users_group_id ON users(group_id);
CREATE INDEX idx_product_sku ON products(sku);

-- Inserir dados de exemplo
INSERT INTO products (id, name, sku, price, quantity) 
VALUES 
  ('prod-001', 'Teclado Mecânico', 'KB-001', 150.00, 15),
  ('prod-002', 'Mouse Gamer', 'MS-001', 80.00, 25),
  ('prod-003', 'Monitor 27"', 'MON-001', 800.00, 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, username, is_admin) 
VALUES 
  ('user-001', 'admin', TRUE),
  ('user-002', 'john', FALSE),
  ('user-003', 'jane', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_groups (id, name) 
VALUES 
  ('group-001', 'Gerentes'),
  ('group-002', 'Vendedores')
ON CONFLICT (id) DO NOTHING;
