import React, {
  forwardRef,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "@/styles/AirportListDropdown.module.scss";
import { defaultValue } from "./SearchFlightForm";
import { IAirportListStates } from "./SearchFlightForm";

interface IAirportListDropdownProps {
  airportListDropdowntype: string;
  origin: IAirportListStates;
  destination: IAirportListStates;
  changeOrigin: (origin: IAirportListStates) => void;
  changeDestination: (destination: IAirportListStates) => void;
  hideAirportListDropDown: () => void;
  forceClose: boolean;
  airportList: IAirportListStates[];
  searchKey: string;
}

const AirportListDropdown = React.forwardRef<
  HTMLDivElement,
  IAirportListDropdownProps
>(
  (
    {
      airportListDropdowntype,
      origin,
      destination,
      changeOrigin,
      changeDestination,
      hideAirportListDropDown,
      forceClose,
      airportList,
      searchKey,
    },
    ref
  ) => {
    const [matchAirportList, setMatchAirportList] = useState(airportList);
    const [opacity, setOpacity] = useState(0);
    const [show, setShow] = useState(false);
    const [temporaryHidden, setTemporaryHidden] = useState(false);

    useEffect((): void | (() => void) => {
      fadeIn();
    }, []);

    useEffect((): void => {
      if (forceClose) {
        fadeOut();
      }
    }, [forceClose]);

    useEffect((): void => {
      let filteredAirport = airportList;
      if (airportListDropdowntype === "origin" && destination.IATA) {
        filteredAirport = airportList.filter(
          (airport) => airport.IATA !== destination.IATA
        );
      }
      if (airportListDropdowntype === "destination" && origin.IATA) {
        filteredAirport = airportList.filter(
          (airport) => airport.IATA !== origin.IATA
        );
      }
      if (searchKey.trim()) {
        const isMatch = (airport: IAirportListStates) => {
          for (const key in airport) {
            const value = airport[key];
            if (
              typeof value === "string" &&
              value.match(new RegExp(searchKey, "gi"))
            ) {
              return true;
            }
          }
          return false;
        };
        const result = filteredAirport.filter(isMatch);
        if (result.length) {
          if (temporaryHidden) {
            setTemporaryHidden(false);
            fadeIn();
          }
          setMatchAirportList(result);
        } else {
          setTemporaryHidden(true);
          fadeOut();
        }
      } else {
        setMatchAirportList(filteredAirport);
        if (temporaryHidden) {
          setTemporaryHidden(false);
          fadeIn();
        }
      }
    }, [searchKey]);

    const handleClick = (event: MouseEvent): void => {
      event.stopPropagation();
      const value = event.currentTarget.getAttribute("data-value");
      let data = airportList.find((airport) => airport.IATA === value);
      data = data?.IATA ? data : defaultValue;
      if (airportListDropdowntype === "origin") {
        changeOrigin(data);
      }
      if (airportListDropdowntype === "destination") {
        changeDestination(data);
      }
      fadeOut();
    };

    const fadeIn = (): void => {
      setShow(true);
      setOpacity(1);
    };

    const fadeOut = (): void => {
      setShow(false);
      setOpacity(0);
    };

    const onTransitionEnd = (): void => {
      if (!show && !temporaryHidden) {
        hideAirportListDropDown();
      }
    };

    const matchFormatter = (name: string, country: string): React.ReactNode => {
      let str = "";
      if (name && country) {
        str = name + ", " + country;
      }
      if (!searchKey.trim()) {
        return <div>{str}</div>;
      } else {
        const searchKeyRegex = new RegExp(searchKey, "gi");
        const splitString = str.split(searchKeyRegex);
        const result: any[] = [];
        splitString.forEach((value, index) => {
          result.push(value);
          if (index < splitString.length - 1 && splitString[index + 1] && str) {
            const match = str.match(searchKeyRegex)![index];
            result.push(<strong key={index}>{match}</strong>);
          }
        });
        return result;
      }
    };

    return (
      <div
        ref={ref}
        id={styles["AirportListDropdown"]}
        style={{
          top: show ? 67 : 46,
          opacity: opacity,
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <div className={styles["arrow"]}></div>
        <div className={styles["dropdown-wrapper"]}>
          {matchAirportList.length ? (
            matchAirportList.map((airport) => {
              return (
                <div
                  key={"IATA-" + airport.IATA}
                  className={styles["dropdown-item"]}
                  data-value={airport.IATA}
                  onClick={handleClick}
                >
                  <strong>
                    {airport.city} ({airport.IATA})
                  </strong>
                  <div>
                    {matchFormatter(airport.airportName, airport.country)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles["item-not-found"]}>
              <strong>Airpot Not Found!</strong>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default AirportListDropdown;
