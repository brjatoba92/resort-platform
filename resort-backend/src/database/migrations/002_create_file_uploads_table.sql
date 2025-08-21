-- Migração para criar tabela de uploads de arquivos
-- Arquivo: 002_create_file_uploads_table.sql

-- Criar enum para categorias de arquivo
DO $$ BEGIN
    CREATE TYPE file_category AS ENUM (
        'room_image',
        'guest_document', 
        'payment_receipt',
        'system_file'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar enum para tipos de entidade
DO $$ BEGIN
    CREATE TYPE entity_type AS ENUM (
        'room',
        'guest',
        'payment',
        'system'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabela file_uploads
CREATE TABLE IF NOT EXISTS file_uploads (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL UNIQUE,
    path VARCHAR(500) NOT NULL,
    size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    category file_category NOT NULL,
    entity_type entity_type NOT NULL,
    entity_id INTEGER,
    uploaded_by INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_file_uploads_category ON file_uploads(category);
CREATE INDEX IF NOT EXISTS idx_file_uploads_entity ON file_uploads(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_file_uploads_created_at ON file_uploads(created_at);
CREATE INDEX IF NOT EXISTS idx_file_uploads_active ON file_uploads(is_active);

-- Trigger para atualizar updated_at (se necessário no futuro)
-- Por enquanto, a tabela não tem updated_at, mas pode ser adicionada se necessário
