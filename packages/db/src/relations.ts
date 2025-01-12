import { relations } from "drizzle-orm/relations";

import {
  callOrigins,
  calls,
  callTypes,
  emergencies,
  emergencyReasons,
  emergencyTypes,
  patientPartialAssessments,
  patients,
  protocolAudits,
  protocols,
  protocolVehicles,
  sessions,
  users,
  vehicles,
  vehicleTypes,
} from "./schema";

export const callsRelations = relations(calls, ({ one }) => ({
  callOrigin: one(callOrigins, {
    fields: [calls.originId],
    references: [callOrigins.id],
  }),
  protocol: one(protocols, {
    fields: [calls.protocolId],
    references: [protocols.id],
  }),
  callType: one(callTypes, {
    fields: [calls.typeId],
    references: [callTypes.id],
  }),
}));

export const callOriginsRelations = relations(callOrigins, ({ many }) => ({
  calls: many(calls),
}));

export const protocolsRelations = relations(protocols, ({ one, many }) => ({
  call: one(calls),
  emergency: one(emergencies),
  owner: one(users, {
    fields: [protocols.ownerId],
    references: [users.id],
    relationName: "protocols_ownerId_users_id",
  }),
  user: one(users, {
    fields: [protocols.userId],
    references: [users.id],
    relationName: "protocols_userId_users_id",
  }),
  protocolAudits: many(protocolAudits),
  patients: many(patients),
  protocolVehicles: many(protocolVehicles),
}));

export const callTypesRelations = relations(callTypes, ({ many }) => ({
  calls: many(calls),
}));

export const emergenciesRelations = relations(emergencies, ({ one }) => ({
  protocol: one(protocols, {
    fields: [emergencies.protocolId],
    references: [protocols.id],
  }),
  emergencyReason: one(emergencyReasons, {
    fields: [emergencies.reasonId],
    references: [emergencyReasons.id],
  }),
  emergencyType: one(emergencyTypes, {
    fields: [emergencies.typeId],
    references: [emergencyTypes.id],
  }),
}));

export const emergencyReasonsRelations = relations(
  emergencyReasons,
  ({ one, many }) => ({
    emergencies: many(emergencies),
    emergencyType: one(emergencyTypes, {
      fields: [emergencyReasons.typeId],
      references: [emergencyTypes.id],
    }),
  }),
);

export const emergencyTypesRelations = relations(
  emergencyTypes,
  ({ many }) => ({
    emergencies: many(emergencies),
    emergencyReasons: many(emergencyReasons),
  }),
);

export const usersRelations = relations(users, ({ many, one }) => ({
  protocolAsOwner: one(protocols, {
    fields: [users.id],
    references: [protocols.ownerId],
    relationName: "protocol_owner",
  }),
  protocolAsUser: one(protocols, {
    fields: [users.id],
    references: [protocols.userId],
    relationName: "protocol_user",
  }),
  protocolAudits: many(protocolAudits),
  patients: many(patients),
  patientPartialAssessments: many(patientPartialAssessments),
  protocolVehiclesAsDoctor: many(protocolVehicles, {
    relationName: "protocolVehicles_doctorId_users_id",
  }),
  protocolVehiclesAsFleetManager: many(protocolVehicles, {
    relationName: "protocolVehicles_fleetManagerId_users_id",
  }),
  protocolVehiclesAsOwner: many(protocolVehicles, {
    relationName: "protocolVehicles_userId_users_id",
  }),
  sessions: many(sessions),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const protocolAuditsRelations = relations(protocolAudits, ({ one }) => ({
  protocol: one(protocols, {
    fields: [protocolAudits.protocolId],
    references: [protocols.id],
  }),
  user: one(users, {
    fields: [protocolAudits.userId],
    references: [users.id],
  }),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, {
    fields: [patients.createdById],
    references: [users.id],
  }),
  protocol: one(protocols, {
    fields: [patients.protocolId],
    references: [protocols.id],
  }),
  patientPartialAssessments: many(patientPartialAssessments),
}));

export const patientPartialAssessmentsRelations = relations(
  patientPartialAssessments,
  ({ one }) => ({
    user: one(users, {
      fields: [patientPartialAssessments.authorId],
      references: [users.id],
    }),
    patient: one(patients, {
      fields: [patientPartialAssessments.patientId],
      references: [patients.id],
    }),
  }),
);

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  vehicleType: one(vehicleTypes, {
    fields: [vehicles.typeId],
    references: [vehicleTypes.id],
  }),
  protocolVehicles: many(protocolVehicles),
}));

export const vehicleTypesRelations = relations(vehicleTypes, ({ many }) => ({
  vehicles: many(vehicles),
  protocolVehicles: many(protocolVehicles),
}));

export const protocolVehiclesRelations = relations(
  protocolVehicles,
  ({ one }) => ({
    doctor: one(users, {
      fields: [protocolVehicles.doctorId],
      references: [users.id],
      relationName: "protocolVehicles_doctorId_users_id",
    }),
    fleetManager: one(users, {
      fields: [protocolVehicles.fleetManagerId],
      references: [users.id],
      relationName: "protocolVehicles_fleetManagerId_users_id",
    }),
    protocol: one(protocols, {
      fields: [protocolVehicles.protocolId],
      references: [protocols.id],
    }),
    vehicleType: one(vehicleTypes, {
      fields: [protocolVehicles.requestedVehicleTypeId],
      references: [vehicleTypes.id],
    }),
    owner: one(users, {
      fields: [protocolVehicles.userId],
      references: [users.id],
      relationName: "protocolVehicles_userId_users_id",
    }),
    vehicle: one(vehicles, {
      fields: [protocolVehicles.vehicleId],
      references: [vehicles.id],
    }),
  }),
);
