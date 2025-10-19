-- ================================================
-- 🚀 AURA - Base de Données MySQL
-- ================================================
-- Créer la base de données et les tables
-- À exécuter dans phpMyAdmin ou MySQL Workbench
-- ================================================

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS aura_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aura_db;

-- ================================================
-- Table: users (Utilisateurs)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('user', 'admin', 'moderator', 'super_admin') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended', 'banned') DEFAULT 'active',
    
    -- Profil
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar VARCHAR(10) DEFAULT '👤',
    phone VARCHAR(20),
    address TEXT,
    
    -- Portfolio
    portfolio_value DECIMAL(15, 2) DEFAULT 0.00,
    aura_score INT DEFAULT 50,
    
    -- Sécurité
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_password_change DATE,
    login_attempts INT DEFAULT 0,
    
    -- Activité
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    login_count INT DEFAULT 0,
    total_transactions INT DEFAULT 0,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: assets (Actifs crypto)
-- ================================================
CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    quantity DECIMAL(18, 8) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: login_history (Historique des connexions)
-- ================================================
CREATE TABLE IF NOT EXISTS login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    location VARCHAR(100),
    success BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_success (success)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: sessions (Sessions actives)
-- ================================================
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: two_factor_codes (Codes 2FA temporaires)
-- ================================================
CREATE TABLE IF NOT EXISTS two_factor_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(100) NOT NULL,
    code VARCHAR(6) NOT NULL,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: transactions (Transactions blockchain)
-- ================================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('buy', 'sell', 'transfer', 'stake', 'withdraw') NOT NULL,
    asset_symbol VARCHAR(10) NOT NULL,
    quantity DECIMAL(18, 8) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    signature VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: notifications (Notifications système)
-- ================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('info', 'warning', 'alert', 'success') DEFAULT 'info',
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_read_status (read_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- DONNÉES INITIALES
-- ================================================

-- Insérer votre compte Bakr Sassi (ignore si existe déjà)
INSERT IGNORE INTO users (
    username, password, email, role, status,
    first_name, last_name, avatar, phone, address,
    portfolio_value, aura_score,
    two_factor_enabled, last_password_change
) VALUES (
    'bakr_sassi',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: "pass"
    'bakrtn9@gmail.com',
    'super_admin',
    'active',
    'Bakr',
    'Sassi',
    '👨‍💻',
    '+216 XX XXX XXX',
    'Tunisia',
    250000.00,
    95,
    TRUE,
    CURDATE()
);

-- Récupérer l'ID de Bakr
SET @bakr_id = LAST_INSERT_ID();

-- Ajouter les actifs de Bakr
INSERT INTO assets (user_id, name, symbol, quantity, value) VALUES
(@bakr_id, 'Bitcoin', 'BTC', 3.5, 157500.00),
(@bakr_id, 'Ethereum', 'ETH', 25, 54250.00),
(@bakr_id, 'Solana', 'SOL', 500, 38250.00);

-- Autres utilisateurs de test (ignore si existent déjà)
INSERT IGNORE INTO users (
    username, password, email, role, status,
    first_name, last_name, avatar, phone, address,
    portfolio_value, aura_score,
    two_factor_enabled
) VALUES 
(
    'john_doe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: "user123"
    'asma.bennou@esprit.tn',
    'user',
    'active',
    'John',
    'Doe',
    '👨',
    '+1 234-567-8901',
    '123 Main St, New York, NY',
    134200.00,
    78,
    TRUE  -- 2FA activée
),
(
    'jane_smith',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: "user456"
    'asma.bennou@esprit.tn',
    'user',
    'active',
    'Jane',
    'Smith',
    '👩',
    '+1 234-567-8902',
    '456 Oak Ave, Los Angeles, CA',
    89500.00,
    85,
    TRUE
),
(
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: "Admin@2025"
    'admin@aura.com',
    'admin',
    'active',
    'Admin',
    'AURA',
    '👨‍💼',
    '+1 800-AURA-ADM',
    'AURA Headquarters',
    0,
    100,
    FALSE
);

-- Ajouter des actifs pour John
SET @john_id = (SELECT id FROM users WHERE username = 'john_doe');
INSERT INTO assets (user_id, name, symbol, quantity, value) VALUES
(@john_id, 'Bitcoin', 'BTC', 2.5, 112500.00),
(@john_id, 'Ethereum', 'ETH', 10, 21700.00);

-- Ajouter des actifs pour Jane
SET @jane_id = (SELECT id FROM users WHERE username = 'jane_smith');
INSERT INTO assets (user_id, name, symbol, quantity, value) VALUES
(@jane_id, 'Bitcoin', 'BTC', 1.2, 54000.00),
(@jane_id, 'Ethereum', 'ETH', 15, 32500.00),
(@jane_id, 'Cardano', 'ADA', 5000, 3000.00);

-- ================================================
-- VUES UTILES
-- ================================================

-- Vue: Utilisateurs avec leur portfolio complet
CREATE OR REPLACE VIEW v_users_portfolio AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    u.status,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    u.portfolio_value,
    u.aura_score,
    COUNT(a.id) AS total_assets,
    u.login_count,
    u.last_login,
    u.created_at
FROM users u
LEFT JOIN assets a ON u.id = a.user_id
GROUP BY u.id;

-- Vue: Activité récente des utilisateurs
CREATE OR REPLACE VIEW v_recent_activity AS
SELECT 
    u.username,
    u.email,
    lh.ip_address,
    lh.location,
    lh.success,
    lh.timestamp
FROM login_history lh
JOIN users u ON lh.user_id = u.id
ORDER BY lh.timestamp DESC
LIMIT 100;

-- ================================================
-- PROCÉDURES STOCKÉES
-- ================================================

-- Procédure: Mettre à jour le score AURA d'un utilisateur
DELIMITER //
CREATE PROCEDURE UpdateAuraScore(IN p_user_id INT)
BEGIN
    DECLARE v_portfolio_value DECIMAL(15,2);
    DECLARE v_login_count INT;
    DECLARE v_transaction_count INT;
    DECLARE v_score INT;
    
    SELECT portfolio_value, login_count, total_transactions
    INTO v_portfolio_value, v_login_count, v_transaction_count
    FROM users WHERE id = p_user_id;
    
    -- Calcul du score (simple)
    SET v_score = LEAST(100, GREATEST(0, 
        (v_portfolio_value / 5000) + 
        (v_login_count / 2) + 
        (v_transaction_count * 2)
    ));
    
    UPDATE users SET aura_score = v_score WHERE id = p_user_id;
END //
DELIMITER ;

-- ================================================
-- INDEX SUPPLÉMENTAIRES POUR PERFORMANCE
-- ================================================

CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_active ON users(last_active);
CREATE INDEX idx_assets_value ON assets(value);
CREATE INDEX idx_transactions_created ON transactions(created_at);

-- ================================================
-- TRIGGERS
-- ================================================

-- Trigger: Mettre à jour portfolio_value après insertion d'asset
DELIMITER //
CREATE TRIGGER after_asset_insert
AFTER INSERT ON assets
FOR EACH ROW
BEGIN
    UPDATE users 
    SET portfolio_value = (
        SELECT SUM(value) FROM assets WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
END //
DELIMITER ;

-- Trigger: Mettre à jour portfolio_value après mise à jour d'asset
DELIMITER //
CREATE TRIGGER after_asset_update
AFTER UPDATE ON assets
FOR EACH ROW
BEGIN
    UPDATE users 
    SET portfolio_value = (
        SELECT SUM(value) FROM assets WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
END //
DELIMITER ;

-- Trigger: Mettre à jour portfolio_value après suppression d'asset
DELIMITER //
CREATE TRIGGER after_asset_delete
AFTER DELETE ON assets
FOR EACH ROW
BEGIN
    UPDATE users 
    SET portfolio_value = (
        SELECT COALESCE(SUM(value), 0) FROM assets WHERE user_id = OLD.user_id
    )
    WHERE id = OLD.user_id;
END //
DELIMITER ;

-- ================================================
-- REQUÊTES UTILES
-- ================================================

-- Voir tous les utilisateurs avec leur portfolio
-- SELECT * FROM v_users_portfolio;

-- Voir l'activité récente
-- SELECT * FROM v_recent_activity;

-- Trouver les meilleurs investisseurs
-- SELECT username, portfolio_value, aura_score 
-- FROM users 
-- ORDER BY aura_score DESC, portfolio_value DESC 
-- LIMIT 10;

-- Statistiques globales
-- SELECT 
--     COUNT(*) as total_users,
--     SUM(portfolio_value) as total_value,
--     AVG(aura_score) as avg_score,
--     SUM(login_count) as total_logins
-- FROM users;

-- ================================================
-- FIN DU SCRIPT
-- ================================================
-- 
-- 🎉 Base de données créée avec succès!
--
-- Prochaines étapes:
-- 1. Ouvrez phpMyAdmin (http://localhost/phpmyadmin)
-- 2. Créez une nouvelle base de données "aura_db"
-- 3. Importez ce fichier SQL
-- 4. Configurez le fichier .env avec vos identifiants
-- 5. Lancez le serveur backend avec: node server/server.js
--
-- ================================================
