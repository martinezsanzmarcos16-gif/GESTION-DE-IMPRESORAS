-- 1. Create custom types (Enums)
CREATE TYPE public.product_status AS ENUM ('activo', 'borrador');
CREATE TYPE public.product_category AS ENUM ('Lámparas', 'Objetos Decorativos');
CREATE TYPE public.printer_status AS ENUM ('imprimiendo', 'libre', 'mantenimiento');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE public.transaction_category AS ENUM ('Venta', 'Materiales', 'Mantenimiento', 'Varios');
CREATE TYPE public.order_status AS ENUM ('Pendiente', 'Pagado', 'Enviado');
CREATE TYPE public.purchase_status AS ENUM ('Pendiente', 'Completado', 'Pagado');

-- 2. Create tables

-- Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    category public.product_category,
    status public.product_status DEFAULT 'borrador',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Printers
CREATE TABLE public.printers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    status public.printer_status DEFAULT 'libre',
    total_hours_printed NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materials
CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_type TEXT NOT NULL, -- PLA, PETG, ABS, Resin
    color TEXT,
    brand TEXT,
    quantity_grams NUMERIC(10, 2) DEFAULT 0,
    min_threshold_grams NUMERIC(10, 2) DEFAULT 1000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers
CREATE TABLE public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Orders (Proveedores)
CREATE TABLE public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    status public.purchase_status DEFAULT 'Pendiente',
    total_amount NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Order Items
CREATE TABLE public.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
    description TEXT, -- fallback if it's not a specific material
    quantity NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions (Finance)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type public.transaction_type NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    category public.transaction_category NOT NULL,
    description TEXT,
    reference_id UUID, -- Polymorphic reference (order_id or purchase_order_id)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (Customer Sales)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    payment_status public.order_status DEFAULT 'Pendiente',
    total_amount NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Triggers logic for automatic transactions

-- Trigger function for Sales (Orders)
CREATE OR REPLACE FUNCTION generate_sale_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if payment_status changed to 'Pagado'
    IF (TG_OP = 'INSERT' AND NEW.payment_status = 'Pagado') OR 
       (TG_OP = 'UPDATE' AND OLD.payment_status != 'Pagado' AND NEW.payment_status = 'Pagado') THEN
        
        INSERT INTO public.transactions (type, amount, category, description, reference_id)
        VALUES (
            'income', 
            NEW.total_amount, 
            'Venta', 
            'Venta generada automáticamente desde pedido', 
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sale_transaction_trigger
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_sale_transaction();


-- Trigger function for Purchases (Purchase Orders)
CREATE OR REPLACE FUNCTION generate_purchase_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if status changed to 'Pagado' o 'Completado'
    IF (TG_OP = 'INSERT' AND NEW.status IN ('Pagado', 'Completado')) OR 
       (TG_OP = 'UPDATE' AND OLD.status NOT IN ('Pagado', 'Completado') AND NEW.status IN ('Pagado', 'Completado')) THEN
        
        -- Generate expense transaction
        INSERT INTO public.transactions (type, amount, category, description, reference_id)
        VALUES (
            'expense', 
            NEW.total_amount, 
            'Materiales', 
            'Compra de proveedor generada automáticamente', 
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchase_transaction_trigger
AFTER INSERT OR UPDATE ON public.purchase_orders
FOR EACH ROW
EXECUTE FUNCTION generate_purchase_transaction();
