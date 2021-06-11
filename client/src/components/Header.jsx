import React from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Logo from "../assets/Logo.png";
import LogoH from "../assets/LogoH.png";
import { ReactComponent as LogoutIcon } from "../assets/logout_icon.svg";

import { useAuthState, useAuthDispatch } from "../context/auth";

const Header = () => {
  const history = useHistory();
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };
  return (
    <div
      className={`d-flex p-4 justify-content-${
        user ? "between" : "center"
      }  pb-0`}
    >
      <img
        src={user ? Logo : LogoH}
        alt="logo"
        style={{
          height: "4em",
        }}
      />
      {user && (
        <Button
          variant="danger"
          style={{ borderRadius: "50%", width: "3em", height: "3em" }}
          onClick={logout}
        >
          <LogoutIcon height="100%" />
        </Button>
      )}
    </div>
  );
};

export default Header;
