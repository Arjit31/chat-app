export type ContactType = {
  id: string;
  createdAt: string; // or `Date` if you convert it to a Date object
  userId1: string;
  userId2: string;
  user1: {
    name: string;
  };
  user2: {
    name: string;
  };
};