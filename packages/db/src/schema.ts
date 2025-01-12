import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const patientsAgeInEnum = pgEnum("patients_age_in_enum", [
  "years",
  "months",
  "days",
]);
export const patientsGenderEnum = pgEnum("patients_gender_enum", [
  "male",
  "female",
]);
export const protocolAuditsActionEnum = pgEnum("protocol_audits_action_enum", [
  "create",
  "open",
  "stand_by",
  "queue",
  "doctor_check",
  "send",
  "finish",
]);
export const vehiclesStatusEnum = pgEnum("vehicles_status_enum", [
  "busy",
  "free",
  "base",
]);

export const calls = pgTable(
  "calls",
  {
    id: serial().primaryKey().notNull(),
    protocolId: integer("protocol_id").notNull(),
    typeId: integer("type_id").notNull(),
    originId: integer("origin_id").notNull(),
    requesterName: text("requester_name").notNull(),
    codeArea: text("code_area").notNull(),
    fone: text().notNull(),
    complain: text().notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      callsOriginIdCallOriginsIdFk: foreignKey({
        columns: [table.originId],
        foreignColumns: [callOrigins.id],
        name: "calls_origin_id_call_origins_id_fk",
      }),
      callsProtocolIdProtocolsIdFk: foreignKey({
        columns: [table.protocolId],
        foreignColumns: [protocols.id],
        name: "calls_protocol_id_protocols_id_fk",
      }),
      callsTypeIdCallTypesIdFk: foreignKey({
        columns: [table.typeId],
        foreignColumns: [callTypes.id],
        name: "calls_type_id_call_types_id_fk",
      }),
      callsProtocolIdUnique: unique("calls_protocol_id_unique").on(
        table.protocolId,
      ),
    };
  },
);

export const callOrigins = pgTable(
  "call_origins",
  {
    id: serial().primaryKey().notNull(),
    description: text().notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      callOriginsDescriptionUnique: unique(
        "call_origins_description_unique",
      ).on(table.description),
    };
  },
);

export const emergencies = pgTable(
  "emergencies",
  {
    id: serial().primaryKey().notNull(),
    protocolId: integer("protocol_id").notNull(),
    typeId: integer("type_id"),
    reasonId: integer("reason_id"),
    title: text().notNull(),
    street: text().notNull(),
    streetNumber: integer("street_number").notNull(),
    neighborhood: text().notNull(),
    city: text().notNull(),
    landmark: text().notNull(),
    complement: text(),
    coordinates: text(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      emergenciesProtocolIdProtocolsIdFk: foreignKey({
        columns: [table.protocolId],
        foreignColumns: [protocols.id],
        name: "emergencies_protocol_id_protocols_id_fk",
      }),
      emergenciesReasonIdEmergencyReasonsIdFk: foreignKey({
        columns: [table.reasonId],
        foreignColumns: [emergencyReasons.id],
        name: "emergencies_reason_id_emergency_reasons_id_fk",
      }),
      emergenciesTypeIdEmergencyTypesIdFk: foreignKey({
        columns: [table.typeId],
        foreignColumns: [emergencyTypes.id],
        name: "emergencies_type_id_emergency_types_id_fk",
      }),
      emergenciesProtocolIdUnique: unique("emergencies_protocol_id_unique").on(
        table.protocolId,
      ),
    };
  },
);

export const emergencyReasons = pgTable(
  "emergency_reasons",
  {
    id: serial().primaryKey().notNull(),
    typeId: integer("type_id").notNull(),
    description: text().notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      emergencyReasonsTypeIdEmergencyTypesIdFk: foreignKey({
        columns: [table.typeId],
        foreignColumns: [emergencyTypes.id],
        name: "emergency_reasons_type_id_emergency_types_id_fk",
      }),
    };
  },
);

export const emergencyTypes = pgTable("emergency_types", {
  id: serial().primaryKey().notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
});

export const callTypes = pgTable(
  "call_types",
  {
    id: serial().primaryKey().notNull(),
    description: text().notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      callTypesDescriptionUnique: unique("call_types_description_unique").on(
        table.description,
      ),
    };
  },
);

export const protocols = pgTable(
  "protocols",
  {
    id: serial().primaryKey().notNull(),
    userId: text("user_id"),
    ownerId: text("owner_id"),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      protocolsOwnerIdUsersIdFk: foreignKey({
        columns: [table.ownerId],
        foreignColumns: [users.id],
        name: "protocols_owner_id_users_id_fk",
      }),
      protocolsUserIdUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "protocols_user_id_users_id_fk",
      }),
      protocolsUserIdUnique: unique("protocols_user_id_unique").on(
        table.userId,
      ),
    };
  },
);

export const users = pgTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 254 }).notNull(),
  cpf: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
});

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const protocolAudits = pgTable(
  "protocol_audits",
  {
    id: serial().primaryKey().notNull(),
    protocolId: integer("protocol_id").notNull(),
    userId: text("user_id").notNull(),
    action: protocolAuditsActionEnum(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      protocolAuditsProtocolIdProtocolsIdFk: foreignKey({
        columns: [table.protocolId],
        foreignColumns: [protocols.id],
        name: "protocol_audits_protocol_id_protocols_id_fk",
      }),
      protocolAuditsUserIdUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "protocol_audits_user_id_users_id_fk",
      }),
    };
  },
);

export const patients = pgTable(
  "patients",
  {
    id: serial().primaryKey().notNull(),
    protocolId: integer("protocol_id").notNull(),
    createdById: text("created_by_id").notNull(),
    name: varchar({ length: 255 }).notNull(),
    age: integer(),
    ageIn: patientsAgeInEnum("age_in"),
    gender: patientsGenderEnum(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      patientsCreatedByIdUsersIdFk: foreignKey({
        columns: [table.createdById],
        foreignColumns: [users.id],
        name: "patients_created_by_id_users_id_fk",
      }),
      patientsProtocolIdProtocolsIdFk: foreignKey({
        columns: [table.protocolId],
        foreignColumns: [protocols.id],
        name: "patients_protocol_id_protocols_id_fk",
      }),
    };
  },
);

export const vehicleCancellationReasons = pgTable(
  "vehicle_cancellation_reasons",
  {
    id: serial().primaryKey().notNull(),
    description: text().notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      vehicleCancellationReasonsDescriptionUnique: unique(
        "vehicle_cancellation_reasons_description_unique",
      ).on(table.description),
    };
  },
);

export const patientPartialAssessments = pgTable(
  "patient_partial_assessments",
  {
    id: serial().primaryKey().notNull(),
    patientId: integer("patient_id").notNull(),
    authorId: text("author_id").notNull(),
    description: text().notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      patientPartialAssessmentsAuthorIdUsersIdFk: foreignKey({
        columns: [table.authorId],
        foreignColumns: [users.id],
        name: "patient_partial_assessments_author_id_users_id_fk",
      }),
      patientPartialAssessmentsPatientIdPatientsIdFk: foreignKey({
        columns: [table.patientId],
        foreignColumns: [patients.id],
        name: "patient_partial_assessments_patient_id_patients_id_fk",
      }),
    };
  },
);

export const vehicleTypes = pgTable(
  "vehicle_types",
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    acronym: varchar({ length: 3 }).notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      vehicleTypesNameUnique: unique("vehicle_types_name_unique").on(
        table.name,
      ),
      vehicleTypesAcronymUnique: unique("vehicle_types_acronym_unique").on(
        table.acronym,
      ),
    };
  },
);

export const vehicles = pgTable(
  "vehicles",
  {
    id: serial().primaryKey().notNull(),
    typeId: integer("type_id").notNull(),
    name: varchar({ length: 255 }).notNull(),
    plate: varchar({ length: 255 }).notNull(),
    status: vehiclesStatusEnum().notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
  },
  (table) => {
    return {
      vehiclesTypeIdVehicleTypesIdFk: foreignKey({
        columns: [table.typeId],
        foreignColumns: [vehicleTypes.id],
        name: "vehicles_type_id_vehicle_types_id_fk",
      }),
    };
  },
);

export const protocolVehicles = pgTable(
  "protocol_vehicles",
  {
    protocolId: integer("protocol_id").notNull(),
    sequence: integer().notNull(),
    requestedVehicleTypeId: integer("requested_vehicle_type_id").notNull(),
    vehicleId: integer("vehicle_id"),
    doctorId: text("doctor_id").notNull(),
    fleetManagerId: text("fleet_manager_id"),
    userId: text("user_id"),
    cancellationId: integer("cancellation_id"),
    teamDispatchedAt: timestamp("team_dispatched_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    baseLeavingAt: timestamp("base_leaving_at", {
      withTimezone: true,
      mode: "string",
    }),
    locationArrivalAt: timestamp("location_arrival_at", {
      withTimezone: true,
      mode: "string",
    }),
    locationLeavingAt: timestamp("location_leaving_at", {
      withTimezone: true,
      mode: "string",
    }),
    destinationArrivalAt: timestamp("destination_arrival_at", {
      withTimezone: true,
      mode: "string",
    }),
    destinationLeavingAt: timestamp("destination_leaving_at", {
      withTimezone: true,
      mode: "string",
    }),
    baseArrivalAt: timestamp("base_arrival_at", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => {
    return {
      protocolVehiclesDoctorIdUsersIdFk: foreignKey({
        columns: [table.doctorId],
        foreignColumns: [users.id],
        name: "protocol_vehicles_doctor_id_users_id_fk",
      }),
      protocolVehiclesFleetManagerIdUsersIdFk: foreignKey({
        columns: [table.fleetManagerId],
        foreignColumns: [users.id],
        name: "protocol_vehicles_fleet_manager_id_users_id_fk",
      }),
      protocolVehiclesProtocolIdProtocolsIdFk: foreignKey({
        columns: [table.protocolId],
        foreignColumns: [protocols.id],
        name: "protocol_vehicles_protocol_id_protocols_id_fk",
      }),
      protocolVehiclesRequestedVehicleTypeIdVehicleTypesIdFk: foreignKey({
        columns: [table.requestedVehicleTypeId],
        foreignColumns: [vehicleTypes.id],
        name: "protocol_vehicles_requested_vehicle_type_id_vehicle_types_id_fk",
      }),
      protocolVehiclesUserIdUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "protocol_vehicles_user_id_users_id_fk",
      }),
      protocolVehiclesVehicleIdVehiclesIdFk: foreignKey({
        columns: [table.vehicleId],
        foreignColumns: [vehicles.id],
        name: "protocol_vehicles_vehicle_id_vehicles_id_fk",
      }),
      protocolVehiclesPkey: primaryKey({
        columns: [table.protocolId, table.sequence],
        name: "protocol_vehicles_pkey",
      }),
      protocolVehiclesUserIdUnique: unique(
        "protocol_vehicles_user_id_unique",
      ).on(table.userId),
    };
  },
);
