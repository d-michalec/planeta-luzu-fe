export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
};

export type RegisterResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  reservationId: number;
};
