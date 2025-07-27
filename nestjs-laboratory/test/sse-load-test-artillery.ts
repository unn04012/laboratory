export const config = {
  target: 'http://localhost:3000',
  phases: [
    {
      duration: 60,
      arrivalRate: 10,
    },
  ],
};

export const scenarios = [
  {
    flow: [
      {
        get: {
          url: '/api/users',
        },
      },
    ],
  },
];
