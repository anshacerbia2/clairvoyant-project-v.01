import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import flightIcon from "../../public/images/icon/plane_icon.png";
import DatePicker from "./DatePicker";

export default function ServicesSearchBox() {
  const { t, lang } = useTranslation("common");

  return (
    <div>
      <div></div>
      <div>
        <form style={{ marginTop: 500 }}>
          <br />
          <div className="c-row-ssb">
            <div className="c-form-group c-fg-ssb mb-2">
              <div
                style={{
                  position: "absolute",
                  right: 8,
                  top: "calc(50% - 18px)",
                }}
              >
                <Image
                  src={flightIcon}
                  height={36}
                  alt="Depart from"
                  style={{ transform: "rotate(-45deg)", opacity: 0.85 }}
                />
              </div>
              <input className="c-form-control" />
              <div className="c-control-label-wrapper">
                <label className="c-control-label">{t("from")}</label>
              </div>
            </div>
            <div className="c-form-group c-fg-ssb mb-2">
              <div
                style={{
                  position: "absolute",
                  right: 8,
                  top: "calc(50% - 18px)",
                }}
              >
                <Image
                  src={flightIcon}
                  height={36}
                  alt="Flying to"
                  style={{ opacity: 0.85 }}
                />
              </div>
              <input className="c-form-control" />
              <div className="c-control-label-wrapper">
                <label className="c-control-label">{t("to")}</label>
              </div>
            </div>
            <div className="c-form-group c-fg-ssb mb-2">
              <div
                style={{
                  position: "absolute",
                  right: 8,
                  top: "calc(50% - 18px)",
                }}
              >
                {/* <Image
                  src={flightIcon}
                  height={36}
                  alt="Flying to"
                  style={{ opacity: 0.85 }}
                /> */}
              </div>
              <input className="c-form-control" />
              <div className="c-control-label-wrapper">
                <label className="c-control-label">{t("to")}</label>
              </div>
              <DatePicker />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
