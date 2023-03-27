import { useRouter } from "next/router";
import React from "react";
import { VscGlobe } from "react-icons/vsc";

const NavBar: React.FC = (props) => {
  console.log(props);
  const router = useRouter();
  const { pathname, asPath, query } = router;
  console.log(pathname);
  const en = () => {
    router.push({ pathname, query }, asPath, { locale: "en" });
  };
  const id = () => {
    router.push({ pathname, query }, asPath, { locale: "id" });
  };
  return (
    <div
      style={{
        height: 45,
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <VscGlobe />
      &nbsp;
      <button onClick={en}>en</button>&nbsp;
      <button onClick={id}>id</button>&nbsp;
    </div>
  );
};

export default NavBar;
