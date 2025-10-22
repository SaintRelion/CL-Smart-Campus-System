export const Department = {
  CCS: "College of Computer Science",
  CBA: "College of Bussiness Admin",
  CED: "College of Education",
};

export type Department = keyof typeof Department;
