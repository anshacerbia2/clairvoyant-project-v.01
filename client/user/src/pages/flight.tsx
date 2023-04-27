import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import type { AxiosResponse } from "axios";
import type { GetServerSideProps } from "next";

type FlightPage<
  P = {
    flights: any[];
  }
> = NextPage<P> & {
  getLayout?: (page: JSX.Element) => JSX.Element;
};

const Flight: FlightPage = ({ flights }) => {
  console.log(flights);

  return (
    <div>
      {flights.length ? (
        <div>
          {flights.map((flight, index) => {
            return (
              <div key={"flighoffers-" + index}>
                <div>index {index}</div>
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
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { origin, destination, date, ps, tc, dir, tt } = context.query;

  const response: AxiosResponse = await axios.get(
    `http://localhost:4002/flight-search?origin=${origin}&destination=${destination}&date=${date}&ps=${ps}&tc=${tc}&dir=${dir}&tt=${tt}`
  );
  console.log(response);

  return {
    props: {
      flights: response.data.data,
    },
  };
};

export default Flight;
