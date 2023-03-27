import React, { MouseEvent, useEffect, useRef, useState } from "react";
import SearchFlightForm from "./SearchFlightForm";

const ServicesSearchBox: React.FC = () => {
  return (
    <>
      <div style={{ backgroundColor: "#fff", marginTop: 400 }}>
        <div style={{ padding: 12 }}>
          <SearchFlightForm />
        </div>
      </div>
    </>
  );
};

export default ServicesSearchBox;
