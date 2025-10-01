export const Department = {
  CS: "Computer Science",
  IT: "Information Technology",
  ENG: "Engineering",
  MATH: "Mathematics",
} as const;

export type Department = keyof typeof Department;
