export const Constraints = {
  Conclusion: {
    value: {
      min: 0,
      max: 100,
    },
    defaultValue: 50,
  },
  Therapy: {
    imgMaxLength: 5242880, // 5 MB in bytes
    titleMaxLength: 100,
    descriptionMaxLength: 1000,
    urlMaxLength: 500,
  },
  Test: {
    imgMaxLength: 5242880, // 5 MB in bytes
    titleMaxLength: 100,
    descriptionMaxLength: 1000,
  },
  Question: {
    imgMaxLength: 5242880, // 5 MB in bytes
    titleMaxLength: 200,
    descriptionMaxLength: 1000,
  },
  Answer: {
    imgMaxLength: 5242880, // 5 MB in bytes
    influenceMin: -10,
    influenceMax: 10,
    textMaxLength: 250,
  },
  User: {
    emailMaxLength: 320,
    nicknameMaxLength: 64,
    bioMaxLength: 1000,
    imgMaxLength: 5242880, // 5 MB in bytes
  },
  Role: {
    nameMaxLength: 50,
    descriptionMaxLength: 1000,
  },
};
