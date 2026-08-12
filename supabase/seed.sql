-- 1. Truncate existing data to ensure clean seed
TRUNCATE public.transactions CASCADE;
TRUNCATE public.order_items CASCADE;
TRUNCATE public.orders CASCADE;
TRUNCATE public.purchase_order_items CASCADE;
TRUNCATE public.purchase_orders CASCADE;
TRUNCATE public.suppliers CASCADE;
TRUNCATE public.materials CASCADE;
TRUNCATE public.printers CASCADE;
TRUNCATE public.products CASCADE;

-- Disable triggers temporarily to avoid duplicating transactions on seed
ALTER TABLE public.orders DISABLE TRIGGER sale_transaction_trigger;
ALTER TABLE public.purchase_orders DISABLE TRIGGER purchase_transaction_trigger;

-- 2. Insert Products
INSERT INTO public.products (id, title, description, price, stock_quantity, images, category, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Lámpara Cónica', 'Diseño geométrico puro impreso en PLA reciclado. Proporciona una luz cálida y direccional, perfecta para mesas de noche o rincones de lectura.', 45.0, 12, '{"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop"}', 'Lámparas', 'activo'),
('11111111-1111-1111-1111-111111111112', 'Lámpara Nube', 'Forma orgánica que difumina la luz creando una atmósfera relajante. Su textura translúcida revela el patrón de impresión 3D.', 65.0, 5, '{"https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop"}', 'Lámparas', 'activo'),
('11111111-1111-1111-1111-111111111113', 'Jarrón Estrías', 'Jarrón minimalista con textura estriada. Ideal para flores secas. No apto para contener agua sin un recipiente interior.', 28.0, 20, '{"https://images.unsplash.com/photo-1613904985222-0d5344302d6c?q=80&w=800&auto=format&fit=crop"}', 'Objetos Decorativos', 'activo'),
('11111111-1111-1111-1111-111111111114', 'Lámpara Cilindro', 'Un clásico atemporal. Su forma cilíndrica ranurada ofrece una iluminación ambiental de 360 grados.', 55.0, 0, '{"https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop"}', 'Lámparas', 'activo'),
('11111111-1111-1111-1111-111111111115', 'Organizador Hexa', 'Bandeja organizadora modular en forma de hexágono. Perfecta para escritorio o recibidor.', 15.0, 35, '{"https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=800&auto=format&fit=crop"}', 'Objetos Decorativos', 'activo'),
('11111111-1111-1111-1111-111111111116', 'Lámpara Arco', 'Diseño moderno y atrevido. El arco central dirige la luz hacia la base, creando un efecto flotante.', 75.0, 8, '{"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop"}', 'Lámparas', 'borrador');

-- 3. Insert Printers
INSERT INTO public.printers (id, brand, model, status, total_hours_printed) VALUES
('22222222-2222-2222-2222-222222222221', 'Bambu Lab', 'X1 Carbon', 'imprimiendo', 1250),
('22222222-2222-2222-2222-222222222222', 'Prusa', 'MK4', 'libre', 840),
('22222222-2222-2222-2222-222222222223', 'Creality', 'Ender 3 S1 Pro', 'mantenimiento', 3200);

-- 4. Insert Materials
INSERT INTO public.materials (id, material_type, color, brand, quantity_grams, min_threshold_grams) VALUES
('33333333-3333-3333-3333-333333333331', 'PLA', 'Blanco Mate', 'PolyTerra', 2500, 1000),
('33333333-3333-3333-3333-333333333332', 'PLA', 'Negro Mate', 'PolyTerra', 800, 1000),
('33333333-3333-3333-3333-333333333333', 'PETG', 'Transparente', 'Prusament', 3200, 1000),
('33333333-3333-3333-3333-333333333334', 'PLA', 'Terracota', 'SmartMaterials', 150, 1000);

-- 5. Insert Suppliers
INSERT INTO public.suppliers (id, name, contact_info) VALUES
('44444444-4444-4444-4444-444444444441', 'Filament2Print', 'contacto@filament2print.com'),
('44444444-4444-4444-4444-444444444442', '3D Jake', 'info@3djake.com');

-- 6. Insert Purchase Orders
INSERT INTO public.purchase_orders (id, supplier_id, status, total_amount, created_at) VALUES
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', 'Completado', 150.50, '2026-08-10 10:00:00+00'),
('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442', 'Pendiente', 85.00, '2026-08-12 10:00:00+00');

-- 7. Insert Transactions (mock ones)
INSERT INTO public.transactions (type, amount, category, description, created_at) VALUES
('income', 45.00, 'Venta', 'Venta de Lámpara Cónica', '2026-08-10 12:00:00+00'),
('expense', 150.50, 'Materiales', 'Compra Filament2Print', '2026-08-10 14:00:00+00'),
('income', 130.00, 'Venta', 'Venta de Lámpara Nube x2', '2026-08-11 11:00:00+00'),
('expense', 45.00, 'Mantenimiento', 'Repuestos Ender 3', '2026-08-11 16:00:00+00'),
('income', 28.00, 'Venta', 'Venta de Jarrón Estrías', '2026-08-12 09:00:00+00'),
('expense', 12.00, 'Varios', 'Suscripción Software', '2026-08-12 15:00:00+00');

-- Re-enable triggers
ALTER TABLE public.orders ENABLE TRIGGER sale_transaction_trigger;
ALTER TABLE public.purchase_orders ENABLE TRIGGER purchase_transaction_trigger;
