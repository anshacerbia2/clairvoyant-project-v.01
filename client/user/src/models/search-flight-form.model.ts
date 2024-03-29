export interface ISearchFlightFormChildrenRef {
  airportListDropdownRef: React.RefObject<HTMLDivElement>;
  datePickerRef: React.RefObject<HTMLDivElement>;
  dropdownTransitionRef: React.RefObject<HTMLDivElement>;
}

export interface ISearchFlightFormInputStates {
  tripType: {
    [key: string]: boolean;
    oneWay: boolean;
    roundTrip: boolean;
    multiCity: boolean;
  };
  segments: {
    origin: IAirportList;
    destination: IAirportList;
    departureDate: Date;
  }[];
  returnDate: Date;
  passenger: {
    [key: string]: string | number;
    adults: number;
    children: number;
    infants: number;
  };
  travelClass: ITravelClass;
  nonStop: boolean;
  promoCode: string;
}

export interface ISearchFlightFormDropdown {
  [key: string]: boolean;
  airportDropdown: boolean;
  datePicker: boolean;
  passengerDropdown: boolean;
  travelClassDropdown: boolean;
}

export interface IAirportList {
  [key: string]: string | number | null;
  id: number | null;
  city: string;
  country: string;
  name: string;
  code: string;
}

export const defaultAirport: Readonly<IAirportList> = {
  id: null,
  city: "",
  country: "",
  name: "",
  code: "",
};

export interface ITravelClass {
  [key: string]: string;
  value: string;
  display: string;
}

export const defaultTravelClass: Readonly<ITravelClass[]> = [
  { value: "ECONOMY", display: "Economy" },
  { value: "PREMIUM_ECONOMY", display: "Premium Economy" },
  { value: "BUSINESS", display: "Business Class" },
  { value: "FIRST", display: "First Class" },
];

export interface IPassengerDropdownProps {
  inputPassenger: ISearchFlightFormInputStates["passenger"];
  changePassenger: (
    passenger: ISearchFlightFormInputStates["passenger"]
  ) => void;
}

export interface ITravelClassDropdownProps {
  travelClass: ITravelClass;
  changeTravelClass: (index: number) => void;
}
