export interface RegisteredUsersDto {
  id: number;
  reservationId: number;
  firstName: string;
  lastName: string;
  email: string;
  paid: boolean;
  expiresAt: string;
}

export interface RegisteredUsersViewModel {
  id: number;
  reservationId: number;
  firstName: string;
  lastName: string;
  email: string;
  paid: boolean;
  expiresAt: Date;
}

export type AdminRegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
};

export type Filters = {
  firstName: string;
  lastName: string;
  email: string;
};
