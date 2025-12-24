export enum TollPaymentType {
  Unknown = 0,
  IPass = 1,
  PayOnline = 2,
  Cash = 3,
  EZPass = 4,
  OutOfStateEZPass = 5,
  VideoTolls = 6,
  SunPass = 7,
  AccountToll = 8,
  NonAccountToll = 9,
  PalPass = 10,
}

export enum TollPriceTimeOfDay {
  Any = 0,
  Day = 1,
  Night = 2,
}

export enum TollPriceDayOfWeek {
  Any = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}

export enum AxelType {
  Unknown = 0,
  /** Класс 1L — легковой автомобиль / мотоцикл (2 оси). */
  _1L = 1,
  /** Класс 2L — грузовик / связка с 3 осями. */
  _2L = 2,
  /** Класс 3L — ТС с 4 осями. */
  _3L = 3,
  /** Класс 4L — ТС с 5 и более осями. */
  _4L = 4,
  /** Класс 5L. */
  _5L = 5,
  /** Класс 6L. */
  _6L = 6,
  _7L = 7,
  _8L = 8,
  _9L = 9,
}
