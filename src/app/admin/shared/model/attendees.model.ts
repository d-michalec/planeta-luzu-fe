export interface AttendeesDto {
  firstName: string;
  lastName: string;
  headphonesId: number;
  assignmentStatus: string;
}

export enum ReturnCondition {
  OK = 'OK',
  DAMAGED = 'DAMAGED',
  LOST = 'LOST'
}

export interface ReturnHeadphonesRequest {
  headphonesId: number;
  status: ReturnCondition;
}

export interface AttendeesFilter {
  firstName?: string;
  lastName?: string;
  headphonesId?: string;
}
