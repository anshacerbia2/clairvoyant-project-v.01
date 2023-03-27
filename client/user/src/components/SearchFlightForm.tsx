import React, { MouseEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
// Helpers
import { createNewDate, dateToStringWithSlash } from "@/helpers/createNewDate";
// Components
import AirportListDropdown from "./AirportListDropdown";
import DatePickerV1 from "./DatePicker";
// 3rd
import useTranslation from "next-translate/useTranslation";
// Icons
import { VscCalendar } from "react-icons/vsc";
import flightIcon from "../../public/images/icon/plane_icon.png";
import axios, { AxiosResponse } from "axios";

export interface IAirportListStates {
  [key: string]: string | number | null;
  IATA: string;
  airportName: string;
  city: string;
  country: string;
  id: number | null;
}

export interface IInputStates {
  origin: IAirportListStates;
  destination: IAirportListStates;
  tripType: {
    oneWay: boolean;
    roundTrip: boolean;
    multiCity: boolean;
  };
  departureDate: Date;
  returnDate: Date;
}

export interface ISearchFlightChildrenRef {
  airportListDropdownRef: React.RefObject<HTMLDivElement>;
  datePickerRef: React.RefObject<HTMLDivElement>;
}

export const defaultValue = {
  IATA: "",
  airportName: "",
  city: "",
  country: "",
  id: null,
};

const SearchFlightForm: React.FC = () => {
  // Ref
  const inputRef = useRef({
    origin: null as HTMLInputElement | null,
    destination: null as HTMLInputElement | null,
    departure: null as HTMLDivElement | null,
    return: null as HTMLDivElement | null,
  } as Record<string, HTMLInputElement | HTMLDivElement | null>);
  const dateBorderRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<ISearchFlightChildrenRef>({
    airportListDropdownRef: useRef(null),
    datePickerRef: useRef(null),
  });

  // I18n
  const { t, lang } = useTranslation("common");

  // Helpers
  const initDate = createNewDate(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  // States
  const [input, setInput] = useState<IInputStates>({
    origin: defaultValue,
    destination: defaultValue,
    tripType: {
      oneWay: false,
      roundTrip: true,
      multiCity: false,
    },
    departureDate: initDate,
    returnDate: initDate,
  });
  const [searchKey, setSearchKey] = useState({
    origin: "",
    destination: "",
  });
  const [isInitDepartureDate, setIsInitDepartureDate] = useState(true);
  const [isInitReturnDate, setIsInitReturnDate] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState("departure");
  const [forceCloseAirportDropDown, setForceCloseAirportDropDown] =
    useState(false);
  const [forceCloseDatePicker, setForceCloseDatePicker] = useState(false);

  const [showAirportListDropdown, setShowAirportListDropdown] = useState(false);
  const [airportListDropdowntype, setAirportListDropdowntype] =
    useState("origin");
  const [airportList, setAirportList] = useState<IAirportListStates[]>([]);
  const [flighList, setFlightList] = useState<any[]>([]);
  useEffect((): void => {
    const fetchAirportList = async () => {
      const response: AxiosResponse<IAirportListStates[]> = await axios.get<
        IAirportListStates[]
      >("http://localhost:4002/airport-list");
      if (response.status === 200) {
        setAirportList(response.data);
      }
    };
    fetchAirportList();
  }, []);
  useEffect((): void | (() => void) => {
    if (showAirportListDropdown || showCalendar) {
      const handleClickOutside: EventListener = (event: Event): void => {
        const airportDropdownEleId = `#${childrenRef.current.airportListDropdownRef.current?.id}`;
        const datePickerEleId = `#${childrenRef.current.datePickerRef.current?.id}`;

        if (
          event.target instanceof HTMLElement &&
          event.target !== inputRef.current.origin &&
          event.target !== inputRef.current.destination &&
          event.target !== inputRef.current.departure &&
          event.target !== inputRef.current.return &&
          event.target.id !==
            childrenRef.current.airportListDropdownRef.current?.id &&
          event.target.id !== childrenRef.current.datePickerRef.current?.id &&
          !event.target.closest(airportDropdownEleId) &&
          !event.target.closest(datePickerEleId)
        ) {
          for (const key in inputRef.current) {
            (inputRef.current[key] as HTMLInputElement)?.classList.remove(
              "focused-input"
            );
          }
          setForceCloseAirportDropDown(true);
          setForceCloseDatePicker(true);
          normalizeDateBorder();
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showAirportListDropdown, showCalendar]);

  const onFocusCalendar =
    (prefix: string) =>
    (event: React.FocusEvent<HTMLInputElement>): void => {
      const inputElement = inputRef.current[prefix] as HTMLInputElement;
      inputElement?.classList.add("focused-input");
      dateBorderRef.current?.classList.add("active");
      inputElement.select();
      for (const key in inputRef.current) {
        if (key !== prefix) {
          inputRef.current[key]?.classList.remove("focused-input");
        }
      }
      setForceCloseAirportDropDown(true);
      setForceCloseDatePicker(false);
      setCalendarType(prefix);
      setShowCalendar(true);
    };

  const onBlurCalendar =
    (prefix: string) =>
    (event: React.FocusEvent<HTMLInputElement>): void => {};
  // const showCalendarReturn = (event: MouseEvent): void => {
  //   /*
  //    ** use setTimeout instead of event.stopPropagation() to prevent conflict on onclick event
  //    ** because document on dropdown/date picker has ben bind to the onclick event
  //    */
  //   setTimeout(() => {
  //     if (showCalendar) {
  //       setForceClose(true);
  //       if (calendarType === "departure") {
  //         onFocusCalendar("returnDate");
  //         setTimeout(() => {
  //           setCalendarType("return");
  //           setShowCalendar(true);
  //         }, 150); // timer based on #DatePickerV1 CSS transition * 2
  //       }
  //       return;
  //     } else {
  //       onFocusCalendar("returnDate");
  //       setCalendarType("return");
  //       setShowCalendar(true);
  //     }
  //   }, 1);
  // };

  const hideCalendar = (): void => {
    onBlurCalendar(
      calendarType === "departure" ? "departureDate" : "returnDate"
    );
    setShowCalendar(false);
    setForceCloseDatePicker(false);
  };

  const changeDepartureDate = (date: Date): void => {
    if (isInitDepartureDate) setIsInitDepartureDate(false);
    inputRef.current.departure?.classList.remove("focused-input");
    normalizeDateBorder();
    const isHigherThanReturn =
      date >
      new Date(
        `${input.returnDate.getFullYear()}-${
          input.returnDate.getMonth() + 1
        }-${input.returnDate.getDate()}`
      );

    setInput((prev) => {
      return {
        ...prev,
        departureDate: date,
        returnDate: isHigherThanReturn ? date : prev.returnDate,
      };
    });
    setForceCloseDatePicker(true);
  };

  const changeReturnDate = (date: Date): void => {
    if (isInitDepartureDate) setIsInitDepartureDate(false);
    if (isInitReturnDate) setIsInitReturnDate(false);
    inputRef.current.return?.classList.remove("focused-input");
    normalizeDateBorder();
    setInput({ ...input, returnDate: date });
    setForceCloseDatePicker(false);
  };

  const normalizeDateBorder = (): void => {
    dateBorderRef.current?.classList.remove("active");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "tripType") {
      setInput((prev) => {
        return {
          ...prev,
          tripType: {
            ...prev.tripType,
            oneWay: value === "oneWay" ? true : false,
            roundTrip: value === "roundTrip" ? true : false,
          },
          returnDate: value === "oneWay" ? prev.departureDate : prev.returnDate,
        };
      });
      if (value === "oneWay") {
        setIsInitReturnDate(true);
        if (isInitDepartureDate) {
          dateBorderRef.current?.classList.remove("active");
        }
      }
    }
  };

  /*
   ** Airport Departure & Arrival UI/UX (Require DOM manipulation)
   ** Since these elements binded with focus, blur and click event,
   ** and the CSS (only) cannot give the expected result, we need to manipulate the DOM
   */
  const getOriginOrDestinationValue = (value: IAirportListStates): string => {
    const { IATA, airportName, city, country, id } = value;
    return id ? `${city} (${IATA}), ${airportName}, ${country}` : "";
  };

  const onFocusAirport =
    (prefix: string) =>
    (event: React.FocusEvent<HTMLInputElement>): void => {
      const inputElement = inputRef.current[prefix] as HTMLInputElement;
      normalizeDateBorder();
      inputElement?.classList.add("focused-input");
      inputElement?.select();
      for (const key in inputRef.current) {
        if (key !== prefix) {
          inputRef.current[key]?.classList.remove("focused-input");
        }
      }
      setForceCloseDatePicker(true);
      setForceCloseAirportDropDown(false);
      setAirportListDropdowntype(prefix);
      setShowAirportListDropdown(true);
    };

  const onBlurAirport =
    (prefix: string) =>
    (event: React.FocusEvent<HTMLInputElement>): void => {
      setSearchKey({ ...searchKey, origin: "", destination: "" });
    };

  const changeOrigin = (value: IAirportListStates): void => {
    inputRef.current.origin?.classList.remove("focused-input");
    setInput({ ...input, origin: value });
    setForceCloseAirportDropDown(true);
  };

  const changeDestination = (value: IAirportListStates): void => {
    inputRef.current.destination?.classList.remove("focused-input");
    setInput({ ...input, destination: value });
    setForceCloseAirportDropDown(true);
  };

  const hideAirportListDropDown = (): void => {
    setForceCloseAirportDropDown(false);
    setShowAirportListDropdown(false);
  };

  const handleChangeSearchKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value, typeof value);

    setSearchKey({ ...searchKey, [name]: value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const response: AxiosResponse = await axios.get(
      `http://localhost:4002/flight-search?originLocationCode=${input.origin.IATA}&destinationLocationCode=${input.destination.IATA}&departureDate=2023-04-27&adults=1`
    );
    console.log(response.data);
    setFlightList(response.data.data);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <br />
        <div className="c-row-ssb" style={{ justifyContent: "flex-end" }}>
          <div
            className="c-form-group c-radio-group c-fg-ssb mb-2"
            style={{ flexGrow: 0 }}
          >
            <label htmlFor="radioOW">
              One Way
              <input
                type="radio"
                id="radioOW"
                name="tripType"
                value="oneWay"
                checked={input.tripType.oneWay}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="radioRT">
              Round Trip
              <input
                type="radio"
                id="radioRT"
                name="tripType"
                value="roundTrip"
                checked={input.tripType.roundTrip}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <div className="c-row-ssb" style={{ position: "relative" }}>
          <div
            className="c-form-group c-fg-ssb mb-2"
            style={{ width: "calc(100%/3)" }}
            // onClick={onFocusAirport("origin")}
          >
            <div
              style={{
                position: "absolute",
                right: 8,
                top: "calc(50% - 14px)",
                zIndex: 2,
              }}
            >
              <Image
                src={flightIcon}
                height={28}
                alt="Depart from"
                style={{ transform: "rotate(-45deg)", opacity: 0.85 }}
              />
            </div>
            <input
              ref={(element) => {
                inputRef.current.origin = element;
              }}
              id="SSBOrigin"
              className="c-form-control"
              placeholder="origin"
              autoComplete="off"
              name="origin"
              value={searchKey.origin}
              onChange={handleChangeSearchKey}
              onFocus={onFocusAirport("origin")}
              onBlur={onBlurAirport("origin")}
            />
            <input
              className="c-form-control-mask"
              value={getOriginOrDestinationValue(input.origin)}
              readOnly
              disabled
              placeholder="Origin"
            />
            <div className="c-control-label-wrapper">
              <label className="c-control-label">{t("from")}</label>
            </div>
            {showAirportListDropdown &&
              airportListDropdowntype === "origin" && (
                <AirportListDropdown
                  ref={childrenRef.current.airportListDropdownRef}
                  airportList={airportList}
                  airportListDropdowntype="origin"
                  origin={input.origin}
                  destination={input.destination}
                  changeOrigin={changeOrigin}
                  changeDestination={changeDestination}
                  hideAirportListDropDown={hideAirportListDropDown}
                  forceClose={forceCloseAirportDropDown}
                  searchKey={searchKey.origin}
                />
              )}
          </div>
          <div
            className="c-form-group c-fg-ssb mb-2"
            style={{ width: "calc(100%/3)" }}
            // onClick={onFocusAirport("destination")}
          >
            <div
              style={{
                position: "absolute",
                right: 8,
                top: "calc(50% - 14px)",
                zIndex: 2,
              }}
            >
              <Image
                src={flightIcon}
                height={28}
                alt="Flying to"
                style={{ opacity: 0.85 }}
              />
            </div>
            <input
              ref={(element) => {
                inputRef.current.destination = element;
              }}
              id="SSBDestination"
              className="c-form-control"
              placeholder={t("to")}
              autoComplete="off"
              name="destination"
              value={searchKey.destination}
              onChange={handleChangeSearchKey}
              onFocus={onFocusAirport("destination")}
              onBlur={onBlurAirport("destination")}
            />
            <input
              className="c-form-control-mask"
              value={getOriginOrDestinationValue(input.destination)}
              readOnly
              disabled
              placeholder="Destination"
            />
            <div className="c-control-label-wrapper">
              <label className="c-control-label">{t("to")}</label>
            </div>
            {showAirportListDropdown &&
              airportListDropdowntype === "destination" && (
                <AirportListDropdown
                  ref={childrenRef.current.airportListDropdownRef}
                  airportList={airportList}
                  airportListDropdowntype="destination"
                  origin={input.origin}
                  destination={input.destination}
                  changeOrigin={changeOrigin}
                  changeDestination={changeDestination}
                  hideAirportListDropDown={hideAirportListDropDown}
                  forceClose={forceCloseAirportDropDown}
                  searchKey={searchKey.destination}
                />
              )}
          </div>
          <div
            className="c-date-group-ssb mb-2"
            style={{ width: input.tripType.oneWay ? "calc(100%/3)" : "auto" }}
          >
            <div
              className="c-form-group c-fg-ssb mb-0"
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  right: 8,
                  top: "calc(50% - 12px)",
                  zIndex: 2,
                }}
              >
                <VscCalendar size={24} style={{ color: "#9a9c9f" }} />
              </div>
              <input
                ref={(element) => {
                  inputRef.current.departure = element;
                }}
                className={
                  "c-form-control departure-date-input" +
                  (isInitDepartureDate ? "" : " active-input")
                }
                style={{
                  borderTopRightRadius: input.tripType.oneWay ? 4 : 0,
                  borderBottomRightRadius: input.tripType.oneWay ? 4 : 0,
                  borderRight: input.tripType.oneWay ? "" : "none",
                }}
                value={
                  isInitDepartureDate
                    ? ""
                    : dateToStringWithSlash(input.departureDate)
                }
                placeholder="Departure"
                onFocus={onFocusCalendar("departure")}
                onChange={() => {}}
              />
              <div className="c-control-label-wrapper">
                <label className="c-control-label">{t("departureDate")}</label>
              </div>
              {showCalendar && calendarType === "departure" && (
                <DatePickerV1
                  ref={childrenRef.current.datePickerRef}
                  calendarType="departure"
                  departureDate={input.departureDate}
                  returnDate={input.returnDate}
                  changeDepartureDate={changeDepartureDate}
                  changeReturnDate={changeReturnDate}
                  hideCalendar={hideCalendar}
                  forceClose={forceCloseDatePicker}
                />
              )}
            </div>
            {!input.tripType.oneWay && (
              <div ref={dateBorderRef} className="date-border"></div>
            )}
            {input.tripType.roundTrip && (
              <div
                className="c-form-group c-fg-ssb mb-0"
                style={{ cursor: "pointer" }}
                // onClick={showCalendarReturn}
              >
                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: 8,
                    top: "calc(50% - 12px)",
                    zIndex: 2,
                  }}
                >
                  <VscCalendar size={24} style={{ color: "#9a9c9f" }} />
                </div>
                <input
                  ref={(element) => {
                    inputRef.current.return = element;
                  }}
                  className={
                    "c-form-control return-date-input" +
                    (isInitReturnDate ? "" : " active-input")
                  }
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  value={
                    isInitReturnDate
                      ? ""
                      : dateToStringWithSlash(input.returnDate)
                  }
                  placeholder="Return"
                  onFocus={onFocusCalendar("return")}
                  onChange={() => {}}
                />
                <div className="c-control-label-wrapper">
                  <label className="c-control-label">{t("returnDate")}</label>
                </div>
                {showCalendar && calendarType === "return" && (
                  <DatePickerV1
                    ref={childrenRef.current.datePickerRef}
                    calendarType="return"
                    departureDate={input.departureDate}
                    returnDate={input.returnDate}
                    changeDepartureDate={changeDepartureDate}
                    changeReturnDate={changeReturnDate}
                    hideCalendar={hideCalendar}
                    forceClose={forceCloseDatePicker}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <button type="submit">Search</button>
      </form>
      {flighList.length ? (
        <div>
          {flighList.map((flight, index) => {
            return (
              <div>
                <span>
                  {flight.itineraries[0].segments[0].carrierCode}-
                  {flight.itineraries[0].segments[0].number}
                </span>
                <div>
                  Aircraft
                  {flight.itineraries[0].segments[0].aircraft.code}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SearchFlightForm;

// const isoDurationToHoursMinutes = (duration) => {
//   const durationSeconds = moment.duration(duration).asSeconds();
//   const hours = Math.floor(durationSeconds / 3600);
//   const minutes = Math.floor((durationSeconds % 3600) / 60);
//   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Example usage:
// const duration = "PT17H30M";
// const durationStr = isoDurationToHoursMinutes(duration);
// console.log(durationStr); // Output: "17:30"
