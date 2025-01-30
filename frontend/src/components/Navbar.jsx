import {
    Button, chakra,
    Flex,
    Heading,
    Text,
    Image
} from "@chakra-ui/react";
import { IoMoon, IoSunny, IoCarSportSharp } from "react-icons/io5";
import * as React from "react";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode
import { useColorMode, useColorModeValue } from "./ui/color-mode.jsx";
import AddGame from "./AddGame.jsx";
import { Toaster } from "./ui/toaster.jsx";
import { Avatar } from "./ui/avatar.jsx";
import UserMenu from "./UserMenu.jsx";
import {useEffect, useState} from "react";
import {BASE_URL} from "./GamesGrid.jsx";
import {useNavigate} from "react-router-dom";

const CarIcon = chakra(IoCarSportSharp);

const Navbar = ({setGames, users}) => {
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode();
  const [currentUser, setCurrentUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const handleCurrUser = async () => {
      const token = localStorage.getItem("token"); // Pobierz token z localStorage
      if (!token) {
        setError("User not logged in");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(BASE_URL + "/current_user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token do nagłówka
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setCurrentUser(data); // Ustaw dane aktualnie zalogowanego użytkownika
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    handleCurrUser();
  }, []);
  const isLocalhostCars = window.location.href.includes("http://localhost:3000/games");
  const isMainPage = window.location.href.endsWith("http://localhost:3000/");
    return (
        <Flex
            alignItems="center"
            justifyContent={"space-between"}
            bg={useColorModeValue("gray.500", "gray.700")}
            height={"12vh"}
            borderRadius={5}
            px={4}
        >
            {/* Logo */}
            <Flex >
                <Image maxW="80px" maxH={"45px"}  onClick={() => navigate("/games")} src={"../../icon.svg"}></Image>
            </Flex>
            <Text display={{base:"none", md:"flex"}} textStyle={{base:"none", md:"2xl"}} fontWeight={"bold"}>
                ShareYourGame
            </Text>

            {/* Actions */}
            <Flex display={"inline-flex"} alignItems={"center"}>
                {/* Toggle Color Mode */}
                <Button
                    onClick={toggleColorMode}
                    variant={"outline"}
                    colorPalette={"teal"}
                >
                    {colorMode === "light" ? <IoMoon /> : <IoSunny size={20} />}
                </Button>
                <Toaster />
                {isLocalhostCars && <AddGame setGames={setGames}/>}
                {!isMainPage && <UserMenu currentUser={currentUser} users={users}/>}
            </Flex>
        </Flex>
    );
};

export default Navbar;
