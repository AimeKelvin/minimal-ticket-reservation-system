CREATE DATABASE IF NOT EXISTS swift_wheels CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE swift_wheels;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS buses;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sessions;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','fleetmanager') NOT NULL DEFAULT 'customer',
  status ENUM('active','disabled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB;

CREATE TABLE buses (
  bus_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plate_number VARCHAR(40) NOT NULL UNIQUE,
  total_seat INT UNSIGNED NOT NULL,
  status ENUM('active','maintenance','retired') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_total_seat CHECK (total_seat BETWEEN 1 AND 80),
  INDEX idx_buses_status (status)
) ENGINE=InnoDB;

CREATE TABLE routes (
  route_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  source VARCHAR(120) NOT NULL,
  destination VARCHAR(120) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  status ENUM('active','disabled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_route_price CHECK (price >= 0),
  CONSTRAINT chk_route_direction CHECK (source <> destination),
  CONSTRAINT uq_route_source_destination UNIQUE (source, destination),
  INDEX idx_routes_search (source, destination, status)
) ENGINE=InnoDB;

CREATE TABLE schedules (
  schedule_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  bus_id BIGINT UNSIGNED NOT NULL,
  route_id BIGINT UNSIGNED NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time DATETIME NULL,
  status ENUM('scheduled','boarding','departed','cancelled') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_schedules_bus FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE RESTRICT,
  CONSTRAINT fk_schedules_route FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE RESTRICT,
  CONSTRAINT chk_arrival_after_departure CHECK (arrival_time IS NULL OR arrival_time > departure_time),
  CONSTRAINT uq_bus_departure UNIQUE (bus_id, departure_time),
  INDEX idx_schedules_search (route_id, departure_time, status),
  INDEX idx_schedules_bus (bus_id)
) ENGINE=InnoDB;

CREATE TABLE ticket (
  ticket_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_code VARCHAR(32) NOT NULL UNIQUE,
  customer_name VARCHAR(120) NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  schedule_id BIGINT UNSIGNED NOT NULL,
  seat_number INT UNSIGNED NOT NULL,
  amount_paid DECIMAL(12,2) NOT NULL,
  status ENUM('reserved','cancelled','used') NOT NULL DEFAULT 'reserved',
  reserved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP NULL,
  CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT fk_ticket_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id) ON DELETE RESTRICT,
  CONSTRAINT chk_seat_number CHECK (seat_number >= 1),
  CONSTRAINT chk_amount_paid CHECK (amount_paid >= 0),
  CONSTRAINT uq_schedule_seat_active UNIQUE (schedule_id, seat_number, status),
  INDEX idx_ticket_user (user_id, reserved_at),
  INDEX idx_ticket_schedule (schedule_id),
  INDEX idx_ticket_code (ticket_code)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  audit_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL,
  entity VARCHAR(80) NOT NULL,
  entity_id VARCHAR(80) NULL,
  ip_address VARCHAR(64) NULL,
  user_agent VARCHAR(255) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_audit_actor (actor_user_id),
  INDEX idx_audit_entity (entity, entity_id),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;
