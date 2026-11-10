// Auto-generated complete authentic dataset from CSV export
import { DogProfile, AlertLog, JointCycle, HealthRecord, DietItem, WeeklySupplement, WetFood, ConfigBase, RegistroMedicion, LogAjuste, PreparacionItem } from './types';

export const INITIAL_DOG_PROFILE: DogProfile = {
  "id": "20fae792-d366-4fa7-8cb8-8b342c15fac7",
  "name": "Aquiles",
  "birth_date": "2016-10-03",
  "ideal_weight": 12,
  "created_at": "2026-02-15T15:38:20.58818+00:00",
  "updated_at": "2026-11-03T11:29:49.621374+00:00"
};

export const INITIAL_ALERT_LOGS: AlertLog[] = [
  {
    "id": "a09bd6de-3780-4a47-94a5-0d8d04cb9c6e",
    "alert_type": "condrovet",
    "completed_date": "2026-02-16",
    "year": 2026,
    "created_at": "2026-02-16T22:28:46.823278+00:00"
  },
  {
    "id": "a10e1b84-c45c-4ca2-8226-e14ad4536d45",
    "alert_type": "desparasitacion",
    "completed_date": "2026-04-01",
    "year": 2026,
    "next_date": "2026-07-01",
    "created_at": "2026-04-01T10:40:57.12633+00:00"
  },
  {
    "id": "906d2b3e-6e31-4cab-a73c-c6cffccabef7",
    "alert_type": "collar_bayer",
    "completed_date": "2026-05-14",
    "year": 2026,
    "next_date": "2026-11-14",
    "created_at": "2026-05-14T18:18:14.134442+00:00"
  },
  {
    "id": "33f26496-79ea-4f38-96d6-98ddd27bb97f",
    "alert_type": "vacuna_tos_perrera",
    "completed_date": "2026-06-01",
    "year": 2026,
    "next_date": "2027-06-01",
    "created_at": "2026-06-01T16:10:06.82203+00:00"
  },
  {
    "id": "25d48591-b39a-40bc-81eb-45f0d1c9bf63",
    "alert_type": "desparasitacion",
    "completed_date": "2026-07-03",
    "year": 2026,
    "next_date": "2026-10-03",
    "created_at": "2026-07-03T20:20:23.832874+00:00"
  },
  {
    "id": "43b095eb-dd4b-4c84-85aa-753ee175c71c",
    "alert_type": "control_corazon",
    "completed_date": "2026-08-03",
    "year": 2026,
    "next_date": "2026-11-07",
    "created_at": "2026-08-03T06:17:14.716359+00:00"
  },
  {
    "id": "37ebb4a4-4e3f-49f5-baf0-406f8edfb830",
    "alert_type": "desparasitacion",
    "completed_date": "2026-10-02",
    "year": 2026,
    "next_date": "2027-01-02",
    "created_at": "2026-10-02T05:25:21.507002+00:00"
  },
  {
    "id": "18e91f2b-1c91-455f-bc93-5da71a2faa8e",
    "alert_type": "control_corazon",
    "completed_date": "2026-11-04",
    "year": 2026,
    "next_date": "2027-07-27",
    "created_at": "2026-11-04T06:52:21.988097+00:00"
  }
];

export const INITIAL_JOINT_CYCLES: JointCycle[] = [
  {
    "id": "7f476f44-cd61-4493-943d-afb30c592792",
    "start_date": "2026-05-04",
    "cycle_month": 5,
    "active": false,
    "created_at": "2026-05-04T18:49:03.149953+00:00",
    "updated_at": "2026-06-14T10:13:20.834248+00:00"
  },
  {
    "id": "1b7bebe5-c575-4c5c-b4e2-23adcbca4f3b",
    "start_date": "2026-08-01",
    "cycle_month": 8,
    "active": false,
    "created_at": "2026-08-01T12:26:46.91719+00:00",
    "updated_at": "2026-09-10T20:41:01.592603+00:00"
  },
  {
    "id": "72f4bb46-e297-45a9-9b10-a07f0951b378",
    "start_date": "2026-10-16",
    "cycle_month": 11,
    "active": false,
    "created_at": "2026-10-16T09:18:10.026626+00:00",
    "updated_at": "2026-10-17T20:06:17.495754+00:00"
  },
  {
    "id": "023d008e-2a39-4d71-9fa2-54daebb88f33",
    "start_date": "2026-11-01",
    "cycle_month": 11,
    "active": true,
    "created_at": "2026-11-01T07:42:43.164297+00:00",
    "updated_at": "2026-11-02T08:24:48.646712+00:00"
  }
];

export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    "id": "3310fda2-5234-4318-8773-863daebab352",
    "record_date": "2021-08-09",
    "weight": 18,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-23T18:30:44.250797+00:00"
  },
  {
    "id": "035a67a3-8345-4db2-8de9-38d6c2164ddd",
    "record_date": "2021-08-09",
    "weight": 18,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-23T18:30:20.107488+00:00"
  },
  {
    "id": "f943b212-d786-4111-b7d8-7a5849370094",
    "record_date": "2022-09-13",
    "weight": 17.2,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-01T08:37:41.630027+00:00"
  },
  {
    "id": "e75c3192-ecbc-4c61-9aa9-b6a944ed7e92",
    "record_date": "2022-10-02",
    "weight": 17.6,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-01T08:36:44.965985+00:00"
  },
  {
    "id": "3b94de59-c659-43e6-8903-90aeafa7e06e",
    "record_date": "2022-11-10",
    "weight": 17.8,
    "has_allergy": true,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:53:03.303174+00:00"
  },
  {
    "id": "f50af725-73b0-4178-a1e4-1ffa4f6900d8",
    "record_date": "2022-11-10",
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:53:16.902483+00:00"
  },
  {
    "id": "c5f7bea8-3f46-43a5-a44f-7c1b770239d4",
    "record_date": "2022-12-03",
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:53:44.118888+00:00"
  },
  {
    "id": "6fb9be2b-1323-44a0-a818-377f5135fe65",
    "record_date": "2022-12-12",
    "weight": 17.5,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T20:47:07.438509+00:00"
  },
  {
    "id": "9ea66b32-2453-448c-97b6-9fbe0c06aa2f",
    "record_date": "2023-01-01",
    "weight": 17.5,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T20:47:46.88258+00:00"
  },
  {
    "id": "f8cada07-f172-47f4-ab50-464ebc387cdb",
    "record_date": "2023-01-09",
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:52:09.789086+00:00"
  },
  {
    "id": "cb32ebb8-408e-43b8-9be4-97a1776e03d5",
    "record_date": "2023-02-10",
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:51:56.825431+00:00"
  },
  {
    "id": "33c3e1bd-be4e-482c-bbdf-b98e547338b3",
    "record_date": "2023-03-05",
    "weight": 17.2,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-01T08:36:24.220767+00:00"
  },
  {
    "id": "e0e79474-8c4b-4f38-b511-b7ab13b0e017",
    "record_date": "2023-03-14",
    "has_allergy": true,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:51:44.557865+00:00"
  },
  {
    "id": "fcdf75da-0676-4c32-838e-96adfd12a0e1",
    "record_date": "2023-04-04",
    "has_allergy": true,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:51:27.721046+00:00"
  },
  {
    "id": "3dd480fc-9d47-49ce-9526-7b3b5618db7a",
    "record_date": "2023-05-16",
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:51:13.423349+00:00"
  },
  {
    "id": "248a0105-1b25-430e-a0d5-308084dc77b2",
    "record_date": "2023-06-14",
    "has_allergy": true,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:50:56.766177+00:00"
  },
  {
    "id": "98492d07-813e-4847-be3d-651558ad54df",
    "record_date": "2023-07-18",
    "weight": 17,
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T07:47:34.124283+00:00"
  },
  {
    "id": "0f5282a7-7c40-4778-a2c7-d450e82fc077",
    "record_date": "2023-08-15",
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-03-08T19:45:21.625542+00:00"
  },
  {
    "id": "45491db4-f634-4e52-a3ed-3a12bf9a70fb",
    "record_date": "2023-09-11",
    "has_allergy": false,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-03-08T19:45:03.562834+00:00"
  },
  {
    "id": "0dd288b4-9729-4890-b096-0cfc1baa3adc",
    "record_date": "2023-10-10",
    "weight": 17,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:44:10.948007+00:00"
  },
  {
    "id": "f4b07813-00ab-41db-a7bd-df3bff18adca",
    "record_date": "2023-10-17",
    "has_allergy": false,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-03-08T19:44:47.647488+00:00"
  },
  {
    "id": "3ee29fa1-bd38-482c-bff6-59fa28d3de85",
    "record_date": "2023-11-01",
    "weight": 17,
    "has_allergy": true,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-22T08:19:05.914034+00:00"
  },
  {
    "id": "261d9223-287b-499e-bfb0-ef784575255e",
    "record_date": "2023-12-30",
    "weight": 17,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-22T08:19:32.225378+00:00"
  },
  {
    "id": "e9ca5133-e8c3-45ec-9906-f00b749a672c",
    "record_date": "2024-01-31",
    "weight": 17,
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:20:20.940249+00:00"
  },
  {
    "id": "20d20302-1bc4-4b9e-bce7-033b07afa8fb",
    "record_date": "2024-01-31",
    "weight": 17,
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:19:58.482238+00:00"
  },
  {
    "id": "af22a8c4-37bf-4242-a37f-94ca56306a3a",
    "record_date": "2024-02-12",
    "weight": 17.1,
    "has_allergy": true,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:43:17.112498+00:00"
  },
  {
    "id": "36f1d5cf-6c4d-4dc0-a7c0-e535a0d66ad7",
    "record_date": "2024-03-30",
    "weight": 17,
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:20:40.914967+00:00"
  },
  {
    "id": "eb3c94e1-0403-42ef-aa6f-b14c09f3336c",
    "record_date": "2024-04-30",
    "weight": 17,
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:25:11.576349+00:00"
  },
  {
    "id": "48692a2b-5d99-49b5-b77b-b70ce5b9b092",
    "record_date": "2024-05-30",
    "weight": 17,
    "has_allergy": false,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:25:36.106263+00:00"
  },
  {
    "id": "c0c0a444-c0cb-4e4c-b1d7-4311ed129afd",
    "record_date": "2024-06-28",
    "weight": 17,
    "has_allergy": false,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:25:52.105171+00:00"
  },
  {
    "id": "c82c718e-ccaf-4660-a36a-0e2aa45b9627",
    "record_date": "2024-07-31",
    "weight": 17,
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:26:10.438805+00:00"
  },
  {
    "id": "156d49f9-6914-42d9-86b2-a60573fd58f6",
    "record_date": "2024-08-30",
    "weight": 17,
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:26:28.824929+00:00"
  },
  {
    "id": "58143ca9-d1e7-4e85-89e0-af7fb8a3b9d6",
    "record_date": "2024-08-30",
    "weight": 17.1,
    "has_allergy": false,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:26:52.154477+00:00"
  },
  {
    "id": "f6603bb9-2725-4798-84eb-efc3a3150044",
    "record_date": "2024-09-10",
    "weight": 17,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-08T19:42:37.413069+00:00"
  },
  {
    "id": "df507877-86b9-4bca-9275-6561c555e0d3",
    "record_date": "2024-10-31",
    "weight": 17.1,
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:27:06.0126+00:00"
  },
  {
    "id": "0af67b1c-7e97-46b3-99db-8408650a1960",
    "record_date": "2024-11-29",
    "weight": 17.1,
    "has_allergy": false,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:27:21.712255+00:00"
  },
  {
    "id": "55f93ce4-27f3-4bfa-83e7-794c79451ffc",
    "record_date": "2024-12-31",
    "weight": 17.1,
    "has_allergy": true,
    "medication": "Apoquel",
    "is_mock": false,
    "created_at": "2026-02-22T08:27:37.561498+00:00"
  },
  {
    "id": "6fa9db03-af6a-4f9c-a059-0cbffd7c71ae",
    "record_date": "2025-01-30",
    "weight": 17,
    "has_allergy": false,
    "medication": "Histamin",
    "is_mock": false,
    "created_at": "2026-02-22T08:28:14.861611+00:00"
  },
  {
    "id": "b28749c4-8577-494c-a813-a011694f6b49",
    "record_date": "2025-02-28",
    "weight": 16.9,
    "has_allergy": false,
    "medication": "Histamin",
    "is_mock": false,
    "created_at": "2026-02-22T08:28:30.272241+00:00"
  },
  {
    "id": "83faa08f-2e24-4ebc-bf9a-c5f8fad9ec08",
    "record_date": "2025-03-31",
    "weight": 16.9,
    "has_allergy": false,
    "medication": "Histamin",
    "is_mock": false,
    "created_at": "2026-02-22T08:28:47.323913+00:00"
  },
  {
    "id": "43b2fd47-ec89-4f2f-abac-889240d54bf0",
    "record_date": "2025-04-30",
    "weight": 16.5,
    "has_allergy": true,
    "medication": "Histamin",
    "is_mock": false,
    "created_at": "2026-02-22T08:29:08.157662+00:00"
  },
  {
    "id": "079568c2-43d1-44b9-ac5a-f191c739790c",
    "record_date": "2025-05-30",
    "weight": 16.5,
    "has_allergy": true,
    "medication": "Histamin",
    "is_mock": false,
    "created_at": "2026-02-22T08:29:24.094904+00:00"
  },
  {
    "id": "a2ecf39c-e3da-44ac-b00c-2c6be569341c",
    "record_date": "2025-06-26",
    "weight": 16.5,
    "has_allergy": false,
    "medication": "Histamin",
    "is_mock": false,
    "created_at": "2026-02-22T08:29:40.250211+00:00"
  },
  {
    "id": "b5d3fb0d-e7c6-4d93-b996-84ee613af191",
    "record_date": "2025-07-31",
    "weight": 16.3,
    "has_allergy": true,
    "medication": "Histamin",
    "is_mock": false,
    "created_at": "2026-02-22T08:29:59.878721+00:00"
  },
  {
    "id": "836af2c3-ccff-4940-9c7f-8c95fd3f7f2a",
    "record_date": "2025-08-28",
    "weight": 16.3,
    "has_allergy": false,
    "medication": "MSM",
    "is_mock": false,
    "created_at": "2026-02-22T08:30:40.025331+00:00"
  },
  {
    "id": "bccc9e61-5edc-4fdc-affe-0f7e86bda1b7",
    "record_date": "2025-09-30",
    "weight": 16.3,
    "has_allergy": false,
    "medication": "MSM",
    "is_mock": false,
    "created_at": "2026-02-22T08:31:03.816219+00:00"
  },
  {
    "id": "01efa48e-c978-469a-869f-2cebd212d5ff",
    "record_date": "2025-10-30",
    "weight": 16.5,
    "has_allergy": true,
    "medication": "Antibiótico",
    "is_mock": false,
    "created_at": "2026-02-22T08:31:26.327674+00:00"
  },
  {
    "id": "8c0f8278-a74c-4983-92b6-87b7b3be8218",
    "record_date": "2025-11-28",
    "weight": 16.2,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-22T08:32:14.67934+00:00"
  },
  {
    "id": "b9e06358-7c2c-4e58-997d-5fbb8d721bd4",
    "record_date": "2025-12-31",
    "weight": 16,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-22T08:32:42.489912+00:00"
  },
  {
    "id": "7ed03da1-b368-4ad2-8198-9663a9717cb3",
    "record_date": "2026-01-03",
    "weight": 15.7,
    "has_allergy": true,
    "medication": "Antialérgico",
    "is_mock": false,
    "created_at": "2026-02-22T08:33:26.685938+00:00"
  },
  {
    "id": "6b604c03-3e31-4c5d-8d28-19986660dd46",
    "record_date": "2026-01-16",
    "weight": 15.1,
    "has_allergy": true,
    "medication": "Antibiótico",
    "is_mock": false,
    "created_at": "2026-02-22T08:33:47.047095+00:00"
  },
  {
    "id": "ecda6881-e44a-408d-b0d9-a80261dd6b74",
    "record_date": "2026-01-20",
    "weight": 14.8,
    "has_allergy": true,
    "medication": "Antibiótico",
    "is_mock": false,
    "created_at": "2026-02-22T08:34:04.125775+00:00"
  },
  {
    "id": "50397fb2-e1a0-4ea8-b6aa-b645ddbfa59a",
    "record_date": "2026-02-04",
    "weight": 14.6,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-22T08:35:01.672244+00:00"
  },
  {
    "id": "bdcd6e77-40b8-4028-b08f-00c7b15c820e",
    "record_date": "2026-02-06",
    "weight": 14.3,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-26T13:09:08.177237+00:00"
  },
  {
    "id": "859d1239-a58e-4697-af68-518b51b4f842",
    "record_date": "2026-02-14",
    "weight": 14.2,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-22T08:35:19.50537+00:00"
  },
  {
    "id": "e1c1b1fb-a3e0-4192-bc4b-0345c54b48ab",
    "record_date": "2026-02-19",
    "weight": 14,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-26T13:10:54.680487+00:00"
  },
  {
    "id": "eb157769-c33c-48dc-b2d6-efd4b24937d2",
    "record_date": "2026-02-20",
    "weight": 14.1,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-26T13:07:37.964588+00:00"
  },
  {
    "id": "e9fe8dce-a11f-4e11-a587-8667f30f8f5c",
    "record_date": "2026-02-20",
    "weight": 14.5,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-22T08:35:28.820691+00:00"
  },
  {
    "id": "5523cfa5-3937-4e40-ad05-cd86a4825979",
    "record_date": "2026-02-26",
    "weight": 14.2,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-02-26T13:05:31.811804+00:00"
  },
  {
    "id": "49f3de59-f5af-400b-bf75-4a38c22d0296",
    "record_date": "2026-03-04",
    "weight": 14.3,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-04T12:30:56.576818+00:00"
  },
  {
    "id": "9a38b204-6a90-4a91-9eec-5b45bc35a6d9",
    "record_date": "2026-03-09",
    "weight": 13.9,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-18T19:01:58.08968+00:00"
  },
  {
    "id": "830e19ea-3e66-491b-99e6-fc1216912c7f",
    "record_date": "2026-03-13",
    "weight": 14.1,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-13T16:25:18.672613+00:00"
  },
  {
    "id": "726e645b-48ea-4fba-9b54-a13c9bcea1c4",
    "record_date": "2026-03-18",
    "weight": 14,
    "has_allergy": true,
    "medication": "Pinchazo",
    "is_mock": false,
    "created_at": "2026-03-18T19:02:09.919511+00:00"
  },
  {
    "id": "cc79c004-058d-4a33-b919-d453d7de72a7",
    "record_date": "2026-03-19",
    "weight": 13.9,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-19T12:31:27.494757+00:00"
  },
  {
    "id": "3085e04b-2308-42e7-9789-d75729f4671e",
    "record_date": "2026-03-20",
    "weight": 14,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-20T16:19:33.377353+00:00"
  },
  {
    "id": "c7b23cb9-ea5e-4bbc-8f6d-28a340e63ea6",
    "record_date": "2026-03-23",
    "weight": 13.8,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-23T13:14:59.411406+00:00"
  },
  {
    "id": "5d5d6e66-3a97-4539-911b-5fa36ca0d2df",
    "record_date": "2026-03-26",
    "weight": 14,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-03-26T12:30:47.913125+00:00"
  },
  {
    "id": "50d24909-c97c-45cf-aa0f-33d0e40db840",
    "record_date": "2026-04-04",
    "weight": 13.9,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-04-04T10:06:44.609231+00:00"
  },
  {
    "id": "06b16f86-bb48-4b9d-b7f6-c08978149e48",
    "record_date": "2026-04-05",
    "weight": 14,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-04-05T13:50:25.644931+00:00"
  },
  {
    "id": "bebd3a72-160b-474d-8917-e35602b6b516",
    "record_date": "2026-04-13",
    "weight": 13.7,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-04-13T14:46:29.188508+00:00"
  },
  {
    "id": "768434c0-904f-42a7-abd6-39019e55d2cd",
    "record_date": "2026-04-15",
    "weight": 13.8,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-04-15T09:42:32.358947+00:00"
  },
  {
    "id": "ef1af7b5-0911-4614-ba22-c8fd18d08fbf",
    "record_date": "2026-04-18",
    "weight": 14.6,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-04-22T09:52:56.186306+00:00"
  },
  {
    "id": "d58b8a40-ae70-4710-a11a-0803bdb38301",
    "record_date": "2026-04-22",
    "weight": 14,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-04-22T09:53:04.274222+00:00"
  },
  {
    "id": "c7394119-daad-43de-88ee-59b81be35007",
    "record_date": "2026-05-05",
    "weight": 11.9,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-05-05T08:53:46.89647+00:00"
  },
  {
    "id": "8ee8e574-8102-4c16-bfb1-259972345712",
    "record_date": "2026-05-11",
    "weight": 12.1,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-05-11T16:25:03.206858+00:00"
  },
  {
    "id": "fd4c78e3-77f4-4133-839d-85a37eb82cb5",
    "record_date": "2026-05-18",
    "weight": 12.3,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-05-18T11:24:21.940937+00:00"
  },
  {
    "id": "a32759e0-437b-4181-9d50-20a1531b031f",
    "record_date": "2026-05-21",
    "weight": 12.5,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-05-21T11:02:55.034937+00:00"
  },
  {
    "id": "86b4cd4a-bc1d-4651-91b0-dc80d88f6b57",
    "record_date": "2026-05-30",
    "weight": 12.4,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-05-30T08:13:23.835624+00:00"
  },
  {
    "id": "66582ee4-3270-4422-b4e8-67aeff3f266f",
    "record_date": "2026-06-06",
    "weight": 12.5,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-06-06T08:31:24.074298+00:00"
  },
  {
    "id": "03ce085e-756f-4eec-a012-82c3b76e9192",
    "record_date": "2026-06-13",
    "weight": 12.3,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-06-13T09:53:35.789954+00:00"
  },
  {
    "id": "ed2655f6-f284-42e3-987f-12dba574220e",
    "record_date": "2026-06-29",
    "weight": 11.6,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-06-29T17:48:03.852234+00:00"
  },
  {
    "id": "ef8121b0-f087-4657-99f1-ac7f59f86f31",
    "record_date": "2026-07-01",
    "weight": 11.8,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-07-01T06:25:04.982712+00:00"
  },
  {
    "id": "87191a62-aafe-452f-a806-b646361776f4",
    "record_date": "2026-07-20",
    "weight": 12,
    "has_allergy": true,
    "medication": "Pinchazo",
    "is_mock": false,
    "created_at": "2026-07-20T17:03:54.942528+00:00"
  },
  {
    "id": "917ee3c5-2a68-47c7-b16e-8c1c1e20e8ff",
    "record_date": "2026-07-27",
    "weight": 12.2,
    "has_allergy": true,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-07-27T20:22:41.147884+00:00"
  },
  {
    "id": "46f48e03-4566-4f5d-8fe1-bd4f800a424b",
    "record_date": "2026-08-05",
    "weight": 11.8,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-08-05T15:51:52.984765+00:00"
  },
  {
    "id": "e869f5e2-01d6-48d1-b2e4-38596b2eb912",
    "record_date": "2026-08-17",
    "weight": 12,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-08-17T14:00:56.157948+00:00"
  },
  {
    "id": "31cb3d96-7813-4c78-af9e-9ed6a236f688",
    "record_date": "2026-08-20",
    "weight": 12,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-08-20T16:52:02.737665+00:00"
  },
  {
    "id": "4f4ecb59-4d82-454c-b2a4-42afa8013d56",
    "record_date": "2026-08-31",
    "weight": 12,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-08-31T16:55:24.065307+00:00"
  },
  {
    "id": "49668988-0d66-4e1e-99dd-5f75568a631c",
    "record_date": "2026-09-07",
    "weight": 12.2,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-09-07T11:08:22.931664+00:00"
  },
  {
    "id": "7f772310-1db2-45f4-b9a4-de4f92ae168e",
    "record_date": "2026-09-14",
    "weight": 12,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-09-14T15:52:11.85382+00:00"
  },
  {
    "id": "11c7087f-ac43-4e79-9b5e-8d8bd27eeb21",
    "record_date": "2026-10-14",
    "weight": 12,
    "has_allergy": true,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-10-14T18:12:05.776026+00:00"
  },
  {
    "id": "542515b2-ce73-4b75-bc92-036aef533ed0",
    "record_date": "2026-11-03",
    "weight": 11.7,
    "has_allergy": false,
    "medication": "Ninguno",
    "is_mock": false,
    "created_at": "2026-11-03T11:29:33.336662+00:00"
  }
];

export const INITIAL_DIET_ITEMS: DietItem[] = [
  {
    "id": "4f9a7855-323c-4c3b-9951-046c95e9c5af",
    "season": "cold",
    "item_name": "Lomo de Merluza",
    "quantity": "1250g",
    "sort_order": 1,
    "shrinkage": 1,
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "924aa44d-ed4a-4351-ad40-dfcecca2fd8d",
    "season": "hot",
    "item_name": "Lomo de Merluza",
    "quantity": "1600g",
    "sort_order": 1,
    "shrinkage": 1,
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "3bfc0ba3-6b6b-4083-9835-f002abf26519",
    "season": "cold",
    "item_name": "Salmón",
    "quantity": "250g",
    "sort_order": 2,
    "shrinkage": 1,
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "94817c12-8a33-407d-8688-3573c0e83297",
    "season": "hot",
    "item_name": "Batata",
    "quantity": "2250g",
    "sort_order": 3,
    "shrinkage": 1,
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "998ad8a3-d6bc-49d1-b60a-ce806263ea71",
    "season": "cold",
    "item_name": "Patata",
    "quantity": "2500g",
    "sort_order": 3,
    "shrinkage": 1,
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "baa35aa5-9c5c-4fc6-bef1-4b8b7761bf48",
    "season": "hot",
    "item_name": "Calabacín",
    "quantity": "900g",
    "sort_order": 4,
    "shrinkage": 1,
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "d47939bd-09a6-47e8-bbc8-8a5f6e2bca79",
    "season": "cold",
    "item_name": "Calabacín",
    "quantity": "700g",
    "sort_order": 4,
    "shrinkage": 1,
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "71ad02b9-dd7b-4953-a046-1c816628927b",
    "season": "cold",
    "item_name": "Zanahoria",
    "quantity": "200g",
    "sort_order": 5,
    "shrinkage": 1,
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "38daccc1-4e6d-4505-8e5e-acefaadbe36b",
    "season": "hot",
    "item_name": "Calabaza",
    "quantity": "300g",
    "sort_order": 5,
    "shrinkage": 1,
    "created_at": "2026-04-01T03:13:22.236178+00:00"
  },
  {
    "id": "36417fd1-fca0-46d7-92b2-498e3798b81c",
    "season": "cold",
    "item_name": "Calabaza",
    "quantity": "200g",
    "sort_order": 6,
    "shrinkage": 1,
    "created_at": "2026-04-01T03:13:22.236178+00:00"
  },
  {
    "id": "aed32246-dd22-4c28-b629-862d1d5223fc",
    "season": "cold",
    "item_name": "Sardina",
    "quantity": "40g",
    "sort_order": 10,
    "shrinkage": 1,
    "created_at": "2026-05-01T10:07:44.149442+00:00"
  },
  {
    "id": "eda5b26c-fd87-47ed-adc8-ee0aede5a257",
    "season": "hot",
    "item_name": "Sardina",
    "quantity": "40g",
    "sort_order": 10,
    "shrinkage": 1,
    "created_at": "2026-05-01T10:07:44.149442+00:00"
  },
  {
    "id": "52fd891c-a73d-4847-83f6-c428afbc5a09",
    "season": "cold",
    "item_name": "Cáscara de huevo molida",
    "quantity": "1.5g",
    "sort_order": 11,
    "shrinkage": 1,
    "created_at": "2026-05-01T10:07:44.149442+00:00"
  },
  {
    "id": "1d635ab4-0446-4229-80c1-110860df4deb",
    "season": "hot",
    "item_name": "Cáscara de huevo molida",
    "quantity": "11g",
    "sort_order": 11,
    "shrinkage": 1,
    "created_at": "2026-05-01T10:07:44.149442+00:00"
  },
  {
    "id": "2b4eaddf-6ba3-47bc-9d85-1cb36b228af3",
    "season": "cold",
    "item_name": "Arándanos",
    "quantity": "20 unidades",
    "sort_order": 12,
    "shrinkage": 1,
    "created_at": "2026-05-01T10:07:44.149442+00:00"
  },
  {
    "id": "30895ebe-6657-43b0-b092-43e63f72b1e3",
    "season": "hot",
    "item_name": "Arándanos",
    "quantity": "20 unidades",
    "sort_order": 12,
    "shrinkage": 1,
    "created_at": "2026-05-01T10:07:44.149442+00:00"
  }
];

export const INITIAL_WEEKLY_SUPPLEMENTS: WeeklySupplement[] = [
  {
    "id": "d6e94e7d-c6de-4de0-81b9-d3d14e50967e",
    "day_of_week": 0,
    "content": "🐟 Sardina (40g) + 🫐 (3) + 🥛 Kéfir",
    "morning": "🐟35g",
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "🫐 5,🥛Kéfir",
    "day_of_week": 0,
    "content": "",
    "created_at": ""
  },
  {
    "id": "1709bc41-3689-48f1-974f-e080a9e36f26",
    "day_of_week": 1,
    "content": "🥚 Huevo (1/2) + 🫐 (4) + 🦴 Cáscara (0.25g)",
    "morning": "🥚1/2",
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "🦴Cáscara 0.25g,🦴Cáscara 0.25g",
    "day_of_week": 0,
    "content": "",
    "created_at": ""
  },
  {
    "id": "🥛Kéfir",
    "day_of_week": 0,
    "content": "",
    "created_at": ""
  },
  {
    "id": "f8bc5f2d-e2b8-4028-b78c-c3cd1edece3c",
    "day_of_week": 2,
    "content": "🥚 Huevo (1/2) + 🥛 Kéfir",
    "morning": "🫐 5",
    "afternoon": "🥥1/2 cdta +🥛Kéfir",
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "b4972d95-f79e-48a8-a91d-f693343480f7",
    "day_of_week": 3,
    "content": "🫐 (4) +🥥 Coco (½ cdta) + 🦴 Cáscara (0.25g)",
    "morning": "🦴Cáscara 0.25g",
    "afternoon": "🦴Cáscara 0.25g +🥛Kéfir",
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "b83afe6f-3c73-490e-b537-2200790ca328",
    "day_of_week": 4,
    "content": "🐟 Sardina (45g) + 🥛 Kéfir",
    "morning": "🫐 5",
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "0183e4e1-08a7-44a3-a758-6269613e297a",
    "day_of_week": 5,
    "content": "🥚 Huevo (1/2) + 🥥 Coco (½ cdta)",
    "morning": "🥚1/2",
    "afternoon": "🥥1/2 cdta",
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  },
  {
    "id": "a800b9c6-3085-4af7-9664-fb8a4c5ba8bc",
    "day_of_week": 6,
    "content": "🥚 Huevo (1/2) + 🫐 (3) + 🦴 Cáscara (0.25g)",
    "morning": "🦴Cáscara 0.25g",
    "afternoon": "🦴Cáscara 0.25g",
    "created_at": "2026-02-17T06:28:41.675861+00:00"
  }
];

export const INITIAL_WET_FOOD: WetFood[] = [
  {
    "id": "ff07ba08-4ac8-4c93-846a-3c381a713a88",
    "product_name": "Salmón",
    "image_url": "[imagen]",
    "created_at": "2026-03-08T13:19:08.053597+00:00",
    "updated_at": "2026-03-20T18:33:31.315+00:00"
  }
];

export const INITIAL_CONFIG_BASE: ConfigBase = {
  "id": "6c06d7c8-c4ba-4dad-98a7-906d44272591",
  "base_pecho": 60,
  "base_barriga": 44,
  "created_at": "2026-05-01T07:41:49.414132+00:00",
  "updated_at": "2026-05-02T08:43:21.79909+00:00"
};

export const INITIAL_REGISTROS_MEDICIONES: RegistroMedicion[] = [
  {
    "id": "05a2f595-ed72-4893-8bcf-2289b70bbe49",
    "fecha": "2026-04-22",
    "medida_pecho": 64,
    "medida_barriga": 48,
    "created_at": "2026-05-01T07:39:46.956353+00:00"
  },
  {
    "id": "99cff710-99f2-43b6-93df-ad98934aca78",
    "fecha": "2026-04-23",
    "medida_pecho": 63,
    "medida_barriga": 47,
    "created_at": "2026-05-01T07:40:13.386887+00:00"
  },
  {
    "id": "80221da2-782a-49df-84d5-b196bbe03f11",
    "fecha": "2026-04-24",
    "medida_pecho": 62,
    "medida_barriga": 46,
    "created_at": "2026-05-01T07:40:21.848151+00:00"
  },
  {
    "id": "e29c1388-b636-405b-beae-9a65bdad1f75",
    "fecha": "2026-04-25",
    "medida_pecho": 61,
    "medida_barriga": 45,
    "created_at": "2026-05-01T07:40:47.579359+00:00"
  },
  {
    "id": "e09fcd7f-b977-4ac1-b9ec-abf6fe1ca563",
    "fecha": "2026-04-27",
    "medida_pecho": 60,
    "medida_barriga": 44,
    "created_at": "2026-05-01T07:41:07.941567+00:00"
  },
  {
    "id": "3bbfa12f-a76c-417e-8686-8753bb34033f",
    "fecha": "2026-04-29",
    "medida_pecho": 60,
    "medida_barriga": 44,
    "created_at": "2026-05-01T07:41:20.918022+00:00"
  },
  {
    "id": "d4c69641-322b-4ed5-9e11-2ba18ca2f0ee",
    "fecha": "2026-04-30",
    "medida_pecho": 60,
    "medida_barriga": 44,
    "created_at": "2026-05-01T07:41:37.418957+00:00"
  },
  {
    "id": "45a939b5-93a5-49e2-92bb-e60037b107cc",
    "fecha": "2026-05-01",
    "medida_pecho": 60,
    "medida_barriga": 44,
    "created_at": "2026-05-01T07:41:43.772465+00:00"
  },
  {
    "id": "c5338d9e-cb85-4460-be0f-7b5e2d857309",
    "fecha": "2026-05-02",
    "medida_pecho": 60,
    "medida_barriga": 43,
    "created_at": "2026-05-02T08:43:26.892347+00:00"
  },
  {
    "id": "ea6bd0cc-9990-4049-8e17-e692dc39f7b2",
    "fecha": "2026-05-03",
    "medida_pecho": 60,
    "medida_barriga": 43,
    "created_at": "2026-05-03T08:58:45.121201+00:00"
  },
  {
    "id": "0ef0ced4-40e9-4761-bd24-ff6a8f807a9b",
    "fecha": "2026-05-04",
    "medida_pecho": 60,
    "medida_barriga": 44,
    "created_at": "2026-05-04T05:39:25.571518+00:00"
  },
  {
    "id": "3e5b20b7-3566-4946-844d-60bd5a9ea9db",
    "fecha": "2026-05-05",
    "medida_pecho": 60,
    "medida_barriga": 43,
    "created_at": "2026-05-05T20:13:41.59639+00:00"
  },
  {
    "id": "95cb110c-0c7e-46d2-ac78-52144e40ed1a",
    "fecha": "2026-05-06",
    "medida_pecho": 60,
    "medida_barriga": 43,
    "created_at": "2026-05-06T17:32:54.44574+00:00"
  },
  {
    "id": "1ea34757-1ac6-4bb7-970e-bfbd850dede3",
    "fecha": "2026-05-08",
    "medida_pecho": 60,
    "medida_barriga": 43,
    "created_at": "2026-05-08T14:12:06.308007+00:00"
  },
  {
    "id": "8fc78593-1850-406f-b163-c5ece859bab7",
    "fecha": "2026-05-11",
    "medida_pecho": 60,
    "medida_barriga": 43,
    "created_at": "2026-05-11T16:52:10.924872+00:00"
  },
  {
    "id": "bf7bf9ed-97ad-42d3-9578-e62f7eab4717",
    "fecha": "2026-05-14",
    "medida_pecho": 59,
    "medida_barriga": 41,
    "created_at": "2026-05-14T18:18:35.770805+00:00"
  },
  {
    "id": "fe9d5618-def6-4951-bb3b-6a082ca47a06",
    "fecha": "2026-05-20",
    "medida_pecho": 60,
    "medida_barriga": 44,
    "created_at": "2026-05-20T19:44:50.517442+00:00"
  },
  {
    "id": "6f4aa992-5129-47fc-81bd-08bbae4bf6fc",
    "fecha": "2026-05-24",
    "medida_pecho": 59,
    "medida_barriga": 43,
    "created_at": "2026-05-24T18:22:31.009565+00:00"
  },
  {
    "id": "4ebccaaf-f4f7-4f2c-accb-478a8e4753f1",
    "fecha": "2026-05-29",
    "medida_pecho": 60,
    "medida_barriga": 44,
    "created_at": "2026-05-29T14:09:40.392337+00:00"
  },
  {
    "id": "85ac1778-5078-4d48-a92c-c457a7b953f3",
    "fecha": "2026-05-30",
    "medida_pecho": 60,
    "medida_barriga": 43,
    "created_at": "2026-05-30T20:17:10.674886+00:00"
  },
  {
    "id": "6a5b44ff-963d-48dd-b351-8e7cb773b773",
    "fecha": "2026-06-05",
    "medida_pecho": 59,
    "medida_barriga": 42,
    "created_at": "2026-06-05T20:31:48.960362+00:00"
  },
  {
    "id": "310ece5d-8688-4a5c-b9ae-66c860777833",
    "fecha": "2026-06-12",
    "medida_pecho": 60,
    "medida_barriga": 43,
    "created_at": "2026-06-12T18:19:31.009742+00:00"
  },
  {
    "id": "4c70924e-61d3-44a7-b771-b5b4c2ee6cfc",
    "fecha": "2026-06-15",
    "medida_pecho": 59,
    "medida_barriga": 42,
    "created_at": "2026-06-15T17:19:35.677672+00:00"
  },
  {
    "id": "dc359ac7-3b3d-442e-9b6b-239136dfe266",
    "fecha": "2026-06-20",
    "medida_pecho": 59,
    "medida_barriga": 44,
    "created_at": "2026-06-20T17:36:29.541234+00:00"
  },
  {
    "id": "38548730-b79e-4ea0-bd0e-1147eaf75cdd",
    "fecha": "2026-06-27",
    "medida_pecho": 59,
    "medida_barriga": 42,
    "created_at": "2026-06-27T16:10:08.987198+00:00"
  },
  {
    "id": "e9779a81-2bdc-4043-aee2-1f730fd6f4b2",
    "fecha": "2026-06-29",
    "medida_pecho": 58,
    "medida_barriga": 39,
    "created_at": "2026-06-29T17:47:31.030948+00:00"
  },
  {
    "id": "d6a582b4-ad8a-4c11-9f50-11a8dbc8bc6a",
    "fecha": "2026-07-01",
    "medida_pecho": 58,
    "medida_barriga": 40,
    "created_at": "2026-07-01T17:06:30.796507+00:00"
  },
  {
    "id": "6c376243-09e3-4107-826b-a05e0103cb0c",
    "fecha": "2026-07-07",
    "medida_pecho": 58,
    "medida_barriga": 41,
    "created_at": "2026-07-07T18:55:24.814675+00:00"
  },
  {
    "id": "e0294067-50e1-4fe0-a335-abc10f26684c",
    "fecha": "2026-07-11",
    "medida_pecho": 58,
    "medida_barriga": 40,
    "created_at": "2026-07-11T07:27:44.863164+00:00"
  },
  {
    "id": "0a5b2242-9aab-4a19-adcb-64f7cd351050",
    "fecha": "2026-07-21",
    "medida_pecho": 58,
    "medida_barriga": 40,
    "created_at": "2026-07-21T18:52:19.966193+00:00"
  },
  {
    "id": "a25d435b-2463-477a-8754-e3e1cc40c7a5",
    "fecha": "2026-07-29",
    "medida_pecho": 57,
    "medida_barriga": 39,
    "created_at": "2026-07-29T07:19:19.681831+00:00"
  },
  {
    "id": "6a4da508-1ec3-4e70-8e47-21f20b3887bf",
    "fecha": "2026-08-02",
    "medida_pecho": 57,
    "medida_barriga": 40,
    "created_at": "2026-08-02T10:48:05.392323+00:00"
  },
  {
    "id": "552d966c-0856-4fb3-84d0-be12af3f3050",
    "fecha": "2026-08-09",
    "medida_pecho": 59,
    "medida_barriga": 43,
    "created_at": "2026-08-09T13:22:33.503245+00:00"
  },
  {
    "id": "2ac4d771-cae0-4a11-9087-2c125771692a",
    "fecha": "2026-08-16",
    "medida_pecho": 58,
    "medida_barriga": 42,
    "created_at": "2026-08-16T18:01:56.646591+00:00"
  },
  {
    "id": "fe77fa9f-2ef6-4185-ab89-fc93ea600aba",
    "fecha": "2026-08-23",
    "medida_pecho": 58,
    "medida_barriga": 40,
    "created_at": "2026-08-23T07:33:18.813842+00:00"
  },
  {
    "id": "bebc27fd-c86b-4107-ad01-b72be187b470",
    "fecha": "2026-08-29",
    "medida_pecho": 59,
    "medida_barriga": 40,
    "created_at": "2026-08-29T07:13:52.091062+00:00"
  },
  {
    "id": "f2dcd3ea-f572-4acd-81d9-d537310c5c3d",
    "fecha": "2026-08-30",
    "medida_pecho": 59,
    "medida_barriga": 40,
    "created_at": "2026-08-30T11:58:41.617015+00:00"
  },
  {
    "id": "0ae81242-6704-4cfd-960f-60395a57c3de",
    "fecha": "2026-09-02",
    "medida_pecho": 59,
    "medida_barriga": 43,
    "created_at": "2026-09-02T18:47:05.340764+00:00"
  },
  {
    "id": "c6536ce2-fd18-4af0-a0b9-617e8039f03f",
    "fecha": "2026-09-13",
    "medida_pecho": 59,
    "medida_barriga": 41,
    "created_at": "2026-09-13T17:23:27.10389+00:00"
  },
  {
    "id": "62dc346b-64de-4634-95e1-99f3e71d5850",
    "fecha": "2026-09-23",
    "medida_pecho": 59,
    "medida_barriga": 40,
    "created_at": "2026-09-23T11:39:04.678814+00:00"
  },
  {
    "id": "0dd5c24d-b6e6-48f2-b727-dfeaf898377d",
    "fecha": "2026-10-05",
    "medida_pecho": 59,
    "medida_barriga": 41,
    "created_at": "2026-10-05T17:49:38.763138+00:00"
  },
  {
    "id": "92131eff-b356-4312-8f5d-7cfa548b4e6a",
    "fecha": "2026-11-01",
    "medida_pecho": 59,
    "medida_barriga": 42,
    "created_at": "2026-11-01T08:30:14.284561+00:00"
  }
];

export const INITIAL_LOG_AJUSTES: LogAjuste[] = [
  {
    "id": "06dbb9bd-e603-445d-9543-506dbfc7e432",
    "created_at": "2025-12-30T00:00:00+00:00",
    "peso_anterior": 16.7,
    "peso_nuevo": 16.7,
    "resumen_cambio": "Merluza 400g - Calabacín 450g - Patata 500g",
    "snapshot_dieta": {
      "patata": 500,
      "merluza": 400,
      "calabacín": 450
    }
  },
  {
    "id": "3656bc75-3f78-4d81-a13b-803a1206e031",
    "created_at": "2026-01-10T00:00:00+00:00",
    "peso_anterior": 16.5,
    "peso_nuevo": 16.5,
    "resumen_cambio": "Merluza 1.2kg - Zanahoria 175g - Calabacín 1.0kg - Patata 700g",
    "snapshot_dieta": {
      "patata": 700,
      "merluza": 1180,
      "zanahoria": 175,
      "calabacín": 1025
    }
  },
  {
    "id": "683df60e-bfec-4fd1-8e0b-f829f93d9e85",
    "created_at": "2026-01-16T00:00:00+00:00",
    "peso_anterior": 16.1,
    "peso_nuevo": 16.1,
    "resumen_cambio": "Merluza 1.2kg - Zanahoria 175g - Calabacín 1.0kg - Patata 900g",
    "snapshot_dieta": {
      "patata": 900,
      "merluza": 1200,
      "zanahoria": 175,
      "calabacín": 1025
    }
  },
  {
    "id": "af32092b-2e70-42cb-8728-5805b4dc566b",
    "created_at": "2026-01-22T00:00:00+00:00",
    "peso_anterior": 16,
    "peso_nuevo": 16,
    "resumen_cambio": "Merluza 1.2kg - Zanahoria 175g - Calabacín 1.0kg - Patata 1.0kg",
    "snapshot_dieta": {
      "patata": 1000,
      "merluza": 1200,
      "zanahoria": 175,
      "calabacín": 1025
    }
  },
  {
    "id": "98980b85-4acf-4583-a0d9-b8281fb89781",
    "created_at": "2026-02-01T00:00:00+00:00",
    "peso_anterior": 15.7,
    "peso_nuevo": 15.7,
    "resumen_cambio": "Merluza 1.2kg - Zanahoria 180g - Calabacín 1.0kg - Patata 1.0kg",
    "snapshot_dieta": {
      "patata": 1000,
      "merluza": 1200,
      "zanahoria": 180,
      "calabacín": 1025
    }
  },
  {
    "id": "1a0b0509-8100-4286-b766-5554b569d465",
    "created_at": "2026-02-06T00:00:00+00:00",
    "peso_anterior": 15.2,
    "peso_nuevo": 15.2,
    "resumen_cambio": "Merluza 1.2kg - Zanahoria 180g - Calabacín 1.0kg - Patata 1.3kg",
    "snapshot_dieta": {
      "patata": 1250,
      "merluza": 1200,
      "zanahoria": 180,
      "calabacín": 1025
    }
  },
  {
    "id": "f359a0ce-918b-45e3-b094-ba4070803197",
    "created_at": "2026-02-15T00:00:00+00:00",
    "peso_anterior": 14.8,
    "peso_nuevo": 14.8,
    "resumen_cambio": "Merluza 1.0kg - Zanahoria 200g - Calabacín 700g - Salmón 350g - Patata 1.8kg",
    "snapshot_dieta": {
      "patata": 1800,
      "merluza": 1000,
      "salmón": 350,
      "zanahoria": 200,
      "calabacín": 700
    }
  },
  {
    "id": "fc9b8982-7a89-4c61-839c-086f16abc87a",
    "created_at": "2026-02-21T00:00:00+00:00",
    "peso_anterior": 14.3,
    "peso_nuevo": 14.3,
    "resumen_cambio": "Merluza 1.0kg - Zanahoria 200g - Calabacín 700g - Salmón 350g - Patata 2.3kg",
    "snapshot_dieta": {
      "patata": 2300,
      "merluza": 1000,
      "salmón": 350,
      "zanahoria": 200,
      "calabacín": 700
    }
  },
  {
    "id": "680e1f19-1b30-4427-98ec-8309d452a96d",
    "created_at": "2026-02-25T00:00:00+00:00",
    "peso_anterior": 14.2,
    "peso_nuevo": 14.2,
    "resumen_cambio": "Merluza 1.0kg - Zanahoria 200g - Calabacín 700g - Salmón 350g - Patata 2.5kg",
    "snapshot_dieta": {
      "patata": 2500,
      "merluza": 1000,
      "salmón": 350,
      "zanahoria": 200,
      "calabacín": 700
    }
  },
  {
    "id": "899f7e52-a739-4305-970c-7b3c15ffcc52",
    "created_at": "2026-03-03T00:00:00+00:00",
    "peso_anterior": 14.3,
    "peso_nuevo": 14.3,
    "resumen_cambio": "Merluza 700g - Zanahoria 200g - Calabacín 700g - Salmón 500g - Patata 2.5kg",
    "snapshot_dieta": {
      "patata": 2500,
      "merluza": 700,
      "salmón": 500,
      "zanahoria": 200,
      "calabacín": 700
    }
  },
  {
    "id": "2d1e5dad-9620-4297-a591-3a5a1cbc0f9a",
    "created_at": "2026-03-08T00:00:00+00:00",
    "peso_anterior": 14.3,
    "peso_nuevo": 14.3,
    "resumen_cambio": "Merluza 700g - Zanahoria 200g - Calabacín 700g - Salmón 500g - Patata 2.5kg",
    "snapshot_dieta": {
      "patata": 2500,
      "merluza": 700,
      "salmón": 500,
      "zanahoria": 200,
      "calabacín": 700
    }
  },
  {
    "id": "8ad8e0d2-754a-492e-b36d-2db15aacae9c",
    "created_at": "2026-03-13T00:00:00+00:00",
    "peso_anterior": 14,
    "peso_nuevo": 14,
    "resumen_cambio": "Merluza 700g - Calabacín 900g - Salmón 500g - Batata 2.7kg",
    "snapshot_dieta": {
      "batata": 2700,
      "merluza": 700,
      "salmón": 500,
      "calabacín": 900
    }
  },
  {
    "id": "b890d495-6842-44de-94f0-71bb124d7d95",
    "created_at": "2026-03-17T00:00:00+00:00",
    "peso_anterior": 13.8,
    "peso_nuevo": 13.8,
    "resumen_cambio": "Merluza 700g - Calabacín 900g - Salmón 500g - Batata 2.7kg",
    "snapshot_dieta": {
      "batata": 2700,
      "merluza": 700,
      "salmón": 500,
      "calabacín": 900
    }
  },
  {
    "id": "a02d90f7-2730-4f2a-96cd-ffca7e05ca1d",
    "created_at": "2026-03-19T00:00:00+00:00",
    "peso_anterior": 13.9,
    "peso_nuevo": 13.9,
    "resumen_cambio": "Merluza 1.0kg - Calabaza 200g - Calabacín 900g - Salmón 500g - Batata 2.5kg",
    "snapshot_dieta": {
      "batata": 2500,
      "merluza": 1000,
      "salmón": 500,
      "calabaza": 200,
      "calabacín": 900
    }
  },
  {
    "id": "c2f17654-ff26-4e6b-b832-8e913bdfdbd3",
    "created_at": "2026-03-26T00:00:00+00:00",
    "peso_anterior": 14,
    "peso_nuevo": 14,
    "resumen_cambio": "Merluza 1.0kg - Calabaza 200g - Calabacín 900g - Salmón 500g - Batata 2.5kg",
    "snapshot_dieta": {
      "batata": 2500,
      "merluza": 1000,
      "salmón": 500,
      "calabaza": 200,
      "calabacín": 900
    }
  },
  {
    "id": "b0c9db4b-30c5-4df6-a23a-2e454bbb8c00",
    "created_at": "2026-04-04T00:00:00+00:00",
    "peso_anterior": 13.9,
    "peso_nuevo": 13.9,
    "resumen_cambio": "Merluza 1.0kg - Calabaza 200g - Calabacín 900g - Salmón 500g - Batata 2.5kg",
    "snapshot_dieta": {
      "batata": 2500,
      "merluza": 1000,
      "salmón": 500,
      "calabaza": 200,
      "calabacín": 900
    }
  },
  {
    "id": "bfeb3992-1bc3-4c9f-82b2-ad89cb4acac7",
    "created_at": "2026-05-09T00:00:00+00:00",
    "peso_anterior": 11.9,
    "peso_nuevo": 11.9,
    "resumen_cambio": "Merluza 1.4kg - Calabaza 250g - Calabacín 900g - Batata 2.5kg",
    "snapshot_dieta": {
      "batata": 2500,
      "merluza": 1400,
      "calabaza": 250,
      "calabacín": 900
    }
  },
  {
    "id": "2f4d010c-2290-4d10-bf53-ad7b0a11399c",
    "created_at": "2026-05-18T00:00:00+00:00",
    "peso_anterior": 12.3,
    "peso_nuevo": 12.3,
    "resumen_cambio": "Merluza 1.6kg - Batata 250g",
    "snapshot_dieta": {
      "batata": 250,
      "merluza": 1600
    }
  },
  {
    "id": "519f237a-c95c-443a-82af-e47b6a8bde9e",
    "created_at": "2026-05-21T00:00:00+00:00",
    "peso_anterior": 12.5,
    "peso_nuevo": 12.5,
    "resumen_cambio": "Merluza 1.6kg - Calabaza 250g - Calabacín 900g - Batata 2.1kg",
    "snapshot_dieta": {
      "batata": 2100,
      "merluza": 1600,
      "calabaza": 250,
      "calabacín": 900
    }
  },
  {
    "id": "bc1010ef-f974-4c32-8179-5aaa2f894731",
    "created_at": "2026-05-30T00:00:00+00:00",
    "peso_anterior": 12.4,
    "peso_nuevo": 12.4,
    "resumen_cambio": "Batata 2.3kg",
    "snapshot_dieta": {
      "batata": 2250
    }
  },
  {
    "id": "fb9ba259-e477-4299-935f-1239a56a24b6",
    "created_at": "2026-05-30T00:00:00+00:00",
    "peso_anterior": 12.4,
    "peso_nuevo": 12.4,
    "resumen_cambio": "Calabaza 300g",
    "snapshot_dieta": {
      "calabaza": 300
    }
  },
  {
    "id": "43fb4bb1-6140-451f-86b2-78b19b431453",
    "created_at": "2026-07-04T00:00:00+00:00",
    "peso_anterior": 10.8,
    "peso_nuevo": 10.8,
    "resumen_cambio": "Batata 2.3kg",
    "snapshot_dieta": {
      "batata": 2250
    }
  },
  {
    "id": "5ca4799c-52a5-42b5-b4c3-319c14cf61d8",
    "created_at": "2026-07-04T00:00:00+00:00",
    "peso_anterior": 11.8,
    "peso_nuevo": 11.8,
    "resumen_cambio": "Calabaza 300g - Batata 2.3kg",
    "snapshot_dieta": {
      "batata": 2250,
      "calabaza": 300
    }
  },
  {
    "id": "d6274075-f3c2-4cc3-9cbc-30b72996ef66",
    "created_at": "2026-07-24T00:00:00+00:00",
    "peso_anterior": 12,
    "peso_nuevo": 12,
    "resumen_cambio": "Merluza 1.7kg",
    "snapshot_dieta": {
      "merluza": 1700
    }
  },
  {
    "id": "86ce2305-c5b8-4566-a1e5-854d774133c6",
    "created_at": "2026-08-08T00:00:00+00:00",
    "peso_anterior": 11.8,
    "peso_nuevo": 11.8,
    "resumen_cambio": "Merluza 1.7kg - Calabaza 400g - Calabacín 800g",
    "snapshot_dieta": {
      "merluza": 1700,
      "calabaza": 400,
      "calabacín": 800
    }
  },
  {
    "id": "00437dcc-d69c-46e3-9016-2215b818edca",
    "created_at": "2026-08-14T00:00:00+00:00",
    "peso_anterior": 11.8,
    "peso_nuevo": 11.8,
    "resumen_cambio": "Merluza 1.7kg - Calabaza 500g - Zanahoria 400g - Calabacín 800g - Batata 2.5kg - Patata 2.0kg",
    "snapshot_dieta": {
      "batata": 2500,
      "patata": 2050,
      "merluza": 1700,
      "calabaza": 500,
      "zanahoria": 400,
      "calabacín": 800
    }
  },
  {
    "id": "53d03dd2-a82d-4aa8-827f-ce8c7dd16133",
    "created_at": "2026-08-14T00:00:00+00:00",
    "peso_anterior": 11.8,
    "peso_nuevo": 11.8,
    "resumen_cambio": "Calabaza 400g",
    "snapshot_dieta": {
      "calabaza": 400
    }
  },
  {
    "id": "9ea9753d-b9af-4a7c-bf1e-a6a29ca0dbbb",
    "created_at": "2026-09-25T00:00:00+00:00",
    "peso_anterior": 12,
    "peso_nuevo": 12,
    "resumen_cambio": "Merluza 1.2kg",
    "snapshot_dieta": {
      "merluza": 1200
    }
  },
  {
    "id": "d4b42eb8-dad5-4f0e-bb68-b0a1c4588700",
    "created_at": "2026-09-26T00:00:00+00:00",
    "peso_anterior": 12,
    "peso_nuevo": 12,
    "resumen_cambio": "Pavo 600g",
    "snapshot_dieta": {
      "pavo": 600
    }
  },
  {
    "id": "29b986a0-73d6-46a9-9d8b-775f23f0b774",
    "created_at": "2026-10-14T00:00:00+00:00",
    "peso_anterior": 12,
    "peso_nuevo": 12,
    "resumen_cambio": "Merluza 1.6kg - Calabaza 400g - Calabacín 800g - Batata 2.5kg",
    "snapshot_dieta": {
      "batata": 2500,
      "merluza": 1600,
      "calabaza": 400,
      "calabacín": 800
    }
  },
  {
    "id": "4c4aaa6a-aa0f-41a6-9c97-2abc7c9fee88",
    "created_at": "2026-10-17T00:00:00+00:00",
    "peso_anterior": 12,
    "peso_nuevo": 12,
    "resumen_cambio": "Merluza 1.7kg",
    "snapshot_dieta": {
      "merluza": 1700
    }
  }
];

export const INITIAL_PREPARACION_ITEMS: PreparacionItem[] = [
  {
    "ingrediente": "Lomo de Merluza",
    "neto_semanal": 1800,
    "unidad": "g",
    "merma_pct": 0,
    "total_compra": 1800,
    "exclude_from_pot": false
  },
  {
    "ingrediente": "Batata",
    "neto_semanal": 2500,
    "unidad": "g",
    "merma_pct": 20,
    "total_compra": 3000,
    "exclude_from_pot": false
  },
  {
    "ingrediente": "Calabacín",
    "neto_semanal": 800,
    "unidad": "g",
    "merma_pct": 30,
    "total_compra": 1040,
    "exclude_from_pot": false
  },
  {
    "ingrediente": "Calabaza",
    "neto_semanal": 620,
    "unidad": "g",
    "merma_pct": 30,
    "total_compra": 806,
    "exclude_from_pot": false
  },
  {
    "ingrediente": "Sardina",
    "neto_semanal": 0,
    "unidad": "g",
    "merma_pct": 0,
    "total_compra": 0,
    "exclude_from_pot": true
  },
  {
    "ingrediente": "Cáscara de huevo molida",
    "neto_semanal": 12,
    "unidad": "g",
    "merma_pct": 0,
    "total_compra": 12,
    "exclude_from_pot": true
  },
  {
    "ingrediente": "Arándanos",
    "neto_semanal": 20,
    "unidad": "unidades",
    "merma_pct": 0,
    "total_compra": 20,
    "exclude_from_pot": true
  },
  {
    "ingrediente": "Pechuga de Pavo",
    "neto_semanal": 1400,
    "unidad": "g",
    "merma_pct": 0,
    "total_compra": 1400,
    "exclude_from_pot": false
  },
  {
    "ingrediente": "Patata",
    "neto_semanal": 2250,
    "unidad": "g",
    "merma_pct": 20,
    "total_compra": 2700,
    "exclude_from_pot": false
  },
  {
    "ingrediente": "Zanahoria",
    "neto_semanal": 200,
    "unidad": "g",
    "merma_pct": 20,
    "total_compra": 240,
    "exclude_from_pot": false
  },
  {
    "ingrediente": "Pavo",
    "neto_semanal": 600,
    "unidad": "g",
    "merma_pct": 0,
    "total_compra": 600,
    "exclude_from_pot": false
  }
];
