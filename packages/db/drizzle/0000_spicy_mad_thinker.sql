-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."patients_age_in_enum" AS ENUM('years', 'months', 'days');--> statement-breakpoint
CREATE TYPE "public"."patients_gender_enum" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."protocol_audits_action_enum" AS ENUM('create', 'open', 'stand_by', 'queue', 'doctor_check', 'send', 'finish');--> statement-breakpoint
CREATE TYPE "public"."vehicles_status_enum" AS ENUM('busy', 'free', 'base');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"protocol_id" integer NOT NULL,
	"type_id" integer NOT NULL,
	"origin_id" integer NOT NULL,
	"requester_name" text NOT NULL,
	"code_area" text NOT NULL,
	"fone" text NOT NULL,
	"complain" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "calls_protocol_id_unique" UNIQUE("protocol_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "call_origins" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"deleted_at" timestamp(3),
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "call_origins_description_unique" UNIQUE("description")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emergencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"protocol_id" integer NOT NULL,
	"type_id" integer,
	"reason_id" integer,
	"description" text NOT NULL,
	"street" text NOT NULL,
	"street_number" integer NOT NULL,
	"neighborhood" text NOT NULL,
	"city" text NOT NULL,
	"landmark" text NOT NULL,
	"complement" text,
	"coordinates" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "emergencies_protocol_id_unique" UNIQUE("protocol_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emergency_reasons" (
	"id" serial PRIMARY KEY NOT NULL,
	"type_id" integer NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emergency_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "call_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "call_types_description_unique" UNIQUE("description")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protocols" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"owner_id" integer,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "protocols_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(254) NOT NULL,
	"cpf" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "users_full_name_key" UNIQUE("first_name","last_name"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protocol_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"protocol_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"action" "protocol_audits_action_enum",
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"protocol_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"age" integer,
	"age_in" "patients_age_in_enum",
	"gender" "patients_gender_enum",
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_cancellation_reasons" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "vehicle_cancellation_reasons_description_unique" UNIQUE("description")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_partial_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"acronym" varchar(3) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "vehicle_types_name_unique" UNIQUE("name"),
	CONSTRAINT "vehicle_types_acronym_unique" UNIQUE("acronym")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"type_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"plate" varchar(255) NOT NULL,
	"status" "vehicles_status_enum" NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protocol_vehicles" (
	"protocol_id" integer NOT NULL,
	"sequence" integer NOT NULL,
	"requested_vehicle_type_id" integer NOT NULL,
	"vehicle_id" integer,
	"doctor_id" integer NOT NULL,
	"fleet_manager_id" integer,
	"user_id" integer,
	"cancellation_id" integer,
	"team_dispatched_at" timestamp with time zone NOT NULL,
	"base_leaving_at" timestamp with time zone,
	"location_arrival_at" timestamp with time zone,
	"location_leaving_at" timestamp with time zone,
	"destination_arrival_at" timestamp with time zone,
	"destination_leaving_at" timestamp with time zone,
	"base_arrival_at" timestamp with time zone,
	CONSTRAINT "protocol_vehicles_pkey" PRIMARY KEY("protocol_id","sequence"),
	CONSTRAINT "protocol_vehicles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calls" ADD CONSTRAINT "calls_origin_id_call_origins_id_fk" FOREIGN KEY ("origin_id") REFERENCES "public"."call_origins"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calls" ADD CONSTRAINT "calls_protocol_id_protocols_id_fk" FOREIGN KEY ("protocol_id") REFERENCES "public"."protocols"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calls" ADD CONSTRAINT "calls_type_id_call_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."call_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emergencies" ADD CONSTRAINT "emergencies_protocol_id_protocols_id_fk" FOREIGN KEY ("protocol_id") REFERENCES "public"."protocols"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emergencies" ADD CONSTRAINT "emergencies_reason_id_emergency_reasons_id_fk" FOREIGN KEY ("reason_id") REFERENCES "public"."emergency_reasons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emergencies" ADD CONSTRAINT "emergencies_type_id_emergency_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."emergency_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emergency_reasons" ADD CONSTRAINT "emergency_reasons_type_id_emergency_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."emergency_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocols" ADD CONSTRAINT "protocols_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocols" ADD CONSTRAINT "protocols_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocol_audits" ADD CONSTRAINT "protocol_audits_protocol_id_protocols_id_fk" FOREIGN KEY ("protocol_id") REFERENCES "public"."protocols"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocol_audits" ADD CONSTRAINT "protocol_audits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_protocol_id_protocols_id_fk" FOREIGN KEY ("protocol_id") REFERENCES "public"."protocols"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_partial_assessments" ADD CONSTRAINT "patient_partial_assessments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_partial_assessments" ADD CONSTRAINT "patient_partial_assessments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_type_id_vehicle_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."vehicle_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocol_vehicles" ADD CONSTRAINT "protocol_vehicles_doctor_id_users_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocol_vehicles" ADD CONSTRAINT "protocol_vehicles_fleet_manager_id_users_id_fk" FOREIGN KEY ("fleet_manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocol_vehicles" ADD CONSTRAINT "protocol_vehicles_protocol_id_protocols_id_fk" FOREIGN KEY ("protocol_id") REFERENCES "public"."protocols"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocol_vehicles" ADD CONSTRAINT "protocol_vehicles_requested_vehicle_type_id_vehicle_types_id_fk" FOREIGN KEY ("requested_vehicle_type_id") REFERENCES "public"."vehicle_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocol_vehicles" ADD CONSTRAINT "protocol_vehicles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protocol_vehicles" ADD CONSTRAINT "protocol_vehicles_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/