CREATE TYPE "public"."user_role" AS ENUM('buyer', 'company_admin', 'platform_admin');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('awaiting_phase1', 'phase1_paid', 'processing', 'shipped_from_china', 'in_transit', 'customs_clearance', 'arrived_in_iran', 'awaiting_phase2', 'phase2_overdue', 'phase2_paid', 'delivering', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."shipping_tier" AS ENUM('turbo', 'normal', 'economy');--> statement-breakpoint
CREATE TYPE "public"."payment_gateway" AS ENUM('zarinpal', 'idpay', 'payir');--> statement-breakpoint
CREATE TYPE "public"."payment_phase" AS ENUM('phase_1', 'phase_2');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('processing_in_china', 'shipped_from_china', 'in_transit', 'customs_clearance', 'arrived_in_iran', 'last_mile_delivery', 'delivered');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"name" text,
	"role" "user_role" DEFAULT 'buyer' NOT NULL,
	"password_hash" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name_fa" text NOT NULL,
	"name_en" text NOT NULL,
	"parent_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name_fa" text NOT NULL,
	"name_en" text NOT NULL,
	"description_fa" text NOT NULL,
	"description_en" text NOT NULL,
	"category_id" uuid NOT NULL,
	"wholesale_price_rial" bigint NOT NULL,
	"moq" integer NOT NULL,
	"quantity_step" integer DEFAULT 1 NOT NULL,
	"weight_kg" numeric(10, 3) NOT NULL,
	"volume_cbm" numeric(10, 4) NOT NULL,
	"origin_country" char(2) DEFAULT 'CN' NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"split_payment_ratio" numeric(3, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "moq_min" CHECK ("products"."moq" >= 1),
	CONSTRAINT "split_ratio_range" CHECK ("products"."split_payment_ratio" IS NULL OR ("products"."split_payment_ratio" >= 0.40 AND "products"."split_payment_ratio" <= 0.50))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price_rial" bigint NOT NULL,
	"line_total_rial" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "order_status" DEFAULT 'awaiting_phase1' NOT NULL,
	"shipping_tier" "shipping_tier" NOT NULL,
	"subtotal_rial" bigint NOT NULL,
	"shipping_cost_rial" bigint NOT NULL,
	"total_rial" bigint NOT NULL,
	"split_ratio" numeric(3, 2) NOT NULL,
	"phase1_amount_rial" bigint NOT NULL,
	"phase2_amount_rial" bigint NOT NULL,
	"phase1_paid_at" timestamp with time zone,
	"phase2_paid_at" timestamp with time zone,
	"phase2_due_at" timestamp with time zone,
	"estimated_delivery_at" timestamp with time zone,
	"actual_delivery_at" timestamp with time zone,
	"tracking_number" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "phase_sum_eq_total" CHECK ("orders"."phase1_amount_rial" + "orders"."phase2_amount_rial" = "orders"."total_rial")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"phase" "payment_phase" NOT NULL,
	"amount_rial" bigint NOT NULL,
	"gateway" "payment_gateway" NOT NULL,
	"gateway_ref" text NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_gateway_ref_unique" UNIQUE("gateway","gateway_ref")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"tier" "shipping_tier" NOT NULL,
	"current_status" "shipment_status" DEFAULT 'processing_in_china' NOT NULL,
	"status_history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"eta_min_days" integer NOT NULL,
	"eta_max_days" integer NOT NULL,
	"carrier" text,
	"tracking_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipments_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipping_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" "shipping_tier" NOT NULL,
	"category_id" uuid,
	"weight_min_kg" numeric(10, 3) NOT NULL,
	"weight_max_kg" numeric(10, 3) NOT NULL,
	"rate_per_kg_rial" bigint NOT NULL,
	"base_cost_rial" bigint NOT NULL,
	"eta_min_days" integer NOT NULL,
	"eta_max_days" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"label" text NOT NULL,
	"recipient_name" text NOT NULL,
	"recipient_phone" text NOT NULL,
	"province" text NOT NULL,
	"city" text NOT NULL,
	"postal_code" text NOT NULL,
	"street" text NOT NULL,
	"building" text,
	"unit" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
