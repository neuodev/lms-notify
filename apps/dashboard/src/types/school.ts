export type LMS_TYPES = "LERNOVIA" | "CLASSERA" | "TEAMS" | "COLIGO";

export type CreateSchoolPayload = {
  name: string;
  password: string;
  lmsType: LMS_TYPES;
};

export type UpdateSchoolPayload = {
  name: string;
  password: string;
  lmsType: LMS_TYPES;
};
