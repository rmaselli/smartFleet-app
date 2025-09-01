-- =====================================================
-- FLVEHI Database Setup Script
-- =====================================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS FLVEHI
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Use the FLVEHI database
USE FLVEHI;

-- Create the main users table flveh_s002
CREATE TABLE IF NOT EXISTS flveh_s002 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'user', 'manager') DEFAULT 'user',
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  company_id INT,
  department VARCHAR(100),
  phone VARCHAR(20),
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_role (role),
  INDEX idx_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create legacy users table for backward compatibility
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  due_date DATE,
  assigned_to INT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES flveh_s002(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES flveh_s002(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a default admin user (password: admin123)
-- Note: This password should be changed in production
INSERT INTO flveh_s002 (username, email, password, full_name, role, status) VALUES 
('admin', 'admin@fleetsmart.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/vHhHh6i', 'Administrador del Sistema', 'admin', 'active')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Show table structure
DESCRIBE flveh_s002;

-- Show created tables
SHOW TABLES;

-- Show database info
SELECT 
  SCHEMA_NAME as 'Database',
  DEFAULT_CHARACTER_SET_NAME as 'Charset',
  DEFAULT_COLLATION_NAME as 'Collation'
FROM INFORMATION_SCHEMA.SCHEMATA 
WHERE SCHEMA_NAME = 'FLVEHI'; 