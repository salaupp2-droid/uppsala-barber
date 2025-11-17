/*
  # UPPSALA BARBER Database Schema

  1. New Tables
    - `barbers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `bio` (text)
      - `instagram` (text)
      - `whatsapp` (text)
      - `photo_url` (text)
      - `created_at` (timestamptz)
    
    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (integer)
      - `created_at` (timestamptz)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `barber_id` (uuid, FK to barbers)
      - `service_id` (uuid, FK to services)
      - `client_name` (text)
      - `client_phone` (text)
      - `client_instagram` (text, nullable)
      - `date` (date)
      - `time` (text)
      - `comment` (text, nullable)
      - `status` (text) - 'pending', 'completed', 'cancelled'
      - `created_at` (timestamptz)
    
    - `media`
      - `id` (uuid, primary key)
      - `barber_id` (uuid, FK to barbers, nullable)
      - `type` (text) - 'photo' or 'video'
      - `url` (text)
      - `description` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for barbers, services, and media
    - Authenticated access for appointments management
*/

-- Barbers table
CREATE TABLE IF NOT EXISTS barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text NOT NULL,
  instagram text NOT NULL,
  whatsapp text NOT NULL,
  photo_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view barbers"
  ON barbers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_instagram text,
  date date NOT NULL,
  time text NOT NULL,
  comment text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'cancelled')),
  CONSTRAINT unique_barber_datetime UNIQUE (barber_id, date, time)
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view appointments"
  ON appointments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid REFERENCES barbers(id) ON DELETE CASCADE,
  type text NOT NULL,
  url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('photo', 'video'))
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample data for barbers
INSERT INTO barbers (name, bio, instagram, whatsapp, photo_url) VALUES
('Hugo', 'Especialista en fades, barbería urbana y color.', 'https://www.instagram.com/hug0._mrt', '+595976854267', '/barbers/hugo.jpg'),
('Miguel', 'Especialista en cortes urbanos, diseños y color.', 'https://www.instagram.com/miguel_barb3r_', '+595993385530', '/barbers/miguel.jpg');

-- Insert sample services
INSERT INTO services (name, description, price) VALUES
('Corte Clásico', 'Corte tradicional con tijera y máquina', 80000),
('Corte Urbano / Fade', 'Degradado moderno con diseño personalizado', 100000),
('Barba', 'Perfilado y arreglo de barba', 50000),
('Corte + Barba', 'Combo completo de corte y barba', 130000),
('Color / Fantasía', 'Tinte y colores vibrantes', 150000),
('Diseño en el cabello', 'Diseños personalizados y creativos', 70000);

-- Insert sample media
INSERT INTO media (barber_id, type, url, description) VALUES
((SELECT id FROM barbers WHERE name = 'Hugo'), 'photo', '/gallery/hugo-1.jpg', 'Fade con diseño'),
((SELECT id FROM barbers WHERE name = 'Hugo'), 'photo', '/gallery/hugo-2.jpg', 'Color fantasía'),
((SELECT id FROM barbers WHERE name = 'Miguel'), 'photo', '/gallery/miguel-1.jpg', 'Corte urbano'),
((SELECT id FROM barbers WHERE name = 'Miguel'), 'photo', '/gallery/miguel-2.jpg', 'Diseño creativo'),
(NULL, 'photo', '/gallery/general-1.jpg', 'Trabajo del equipo'),
(NULL, 'photo', '/gallery/general-2.jpg', 'Ambiente Uppsala');