import { Button, MenuContent, MenuItem, MenuRoot, MenuTrigger} from "@chakra-ui/react";
import { Avatar } from "./ui/avatar.jsx";
import { useNavigate } from "react-router-dom"; // Użycie hooka do nawigacji
import * as React from "react";
import {BASE_URL} from "./GamesGrid.jsx";

const UserMenu = ({ currentUser, users }) => {
  const navigate = useNavigate(); // Hook do przekierowania

  // Funkcja obsługująca wylogowanie
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      // Wyślij żądanie wylogowania do backendu
      const response = await fetch(BASE_URL + "/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Usuń token z localStorage i przekieruj
        localStorage.removeItem("token");
        navigate("/"); // Przekierowanie na stronę główną
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <MenuRoot>
      <MenuTrigger>
        <Avatar
          src={currentUser.imgUrl} // Jeśli brak img_url, użyj domyślnego avatara
          size="sm"
        />
      </MenuTrigger>
      <MenuContent position={"absolute"} top={"70px"} right={"-10px"}>


        <MenuItem onClick={() => navigate("/myprofile", { state: { currentUser } })} value="myprofile" >My profile</MenuItem>
        <MenuItem onClick={() => navigate("/rentals", { state: { currentUser } })} value={"rentals"}>Rentals</MenuItem>
        {currentUser.username === "admin" && (
          <MenuItem onClick={() => navigate("/userslist")} users={users} value={"users"}>Users</MenuItem>
        )}
        <MenuItem
          value="logout"
          color="fg.error"
          _hover={{ bg: "bg.error", color: "fg.error" }}
          onClick={handleLogout} // Obsługa kliknięcia przycisku Logout
        >
          Logout
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};

export default UserMenu;
