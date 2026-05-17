export enum HeadphonesStatus {
  DOSTĘPNE = 'DOSTĘPNE',
  PRZYPISANE = 'PRZYPISANE',
  ZEPSUTE = 'ZEPSUTE',
  ZGUBIONE = 'ZGUBIONE',
}

export interface HeadphonesDto {
  id: number;
  headphonesId: number;
  status: HeadphonesStatus;
}
