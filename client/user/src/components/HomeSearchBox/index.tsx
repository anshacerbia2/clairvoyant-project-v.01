import React, { MouseEvent, useEffect, useRef, useState } from "react";
import FlightForm from "./form/SearchFlightForm";

const HomeSearchBox: React.FC = () => {
  return (
    <>
      <div style={{ marginTop: 300 }}>
        <div style={{ padding: 20, borderRadius: 8, backgroundColor: "#fff" }}>
          <FlightForm />
        </div>
      </div>
    </>
  );
};

export default HomeSearchBox;
