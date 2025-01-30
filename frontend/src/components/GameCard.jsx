import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Avatar } from "./ui/avatar.jsx";
import EditGame from "./EditGame.jsx";
import { useColorModeValue } from "./ui/color-mode.jsx";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "./GamesGrid.jsx";
import { toaster } from "./ui/toaster.jsx";
import MakeRental from "./MakeRental.jsx";
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from "./ui/dialog.jsx";
import React, { useState } from "react";

const GameCard = ({ game, user, setGames }) => {
  const token = localStorage.getItem("token");
  let currentUser;
  try {
    if (token) {
      const decodedToken = jwtDecode(token);
      currentUser = decodedToken.sub.username;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
  const isOwner = game.owner.username === currentUser;
  const isAdmin = currentUser === "admin";

  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteGame = async (event) => {
    event.stopPropagation(); // Zatrzymaj propagację zdarzenia
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(BASE_URL + "/api/games/" + game.id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }
      setGames((prevGames) => prevGames.filter((c) => c.id !== game.id));
      toaster.success({
        title: "Sukcess🎉",
        description: "Twój samochód został pomyślnie usunięty.",
        duration: 4000,
      });
    } catch (error) {
      toaster.error({
        title: "An error occurred.",
        description: error.message,
        duration: 4000,
      });
    }
  };

  const cardDisabled = (!isOwner && !isAdmin) && game.available === "false";

  const handleCardClick = (event) => {
    // Sprawdź, czy kliknięto na element z klasą prevent-dialog-click
    if (event.target.closest(".prevent-dialog-click")) {
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      {/* Klikalny Card */}
      <Box
        onClick={handleCardClick} // Otwieramy Dialog po kliknięciu na Box, ale nie na przyciski
        width="100%"
        textAlign="left"
        _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }} // Efekt hover
      >
        <Card.Root
          color={"white"}
          shadow="inner"
          shadowColor="teal"
          bg={useColorModeValue("gray.800", "gray.950")}
          opacity={cardDisabled ? 0.5 : 1}
          pointerEvents={cardDisabled ? "none" : "auto"}
        >
          <Image
            src={game.imgUrl}
            alt={game.description}
            borderRadius={5}
            aspectRatio={16 / 10}
          />
          <Card.Header>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
              <Heading>{game.title}</Heading>
              <Flex flexDirection="column" alignItems="flex-end">
                <Avatar name={game.owner.username} src={game.owner.imgUrl} />
                <Text textStyle={"xs"}>{"@" + game.owner.username}</Text>
              </Flex>
            </Flex>
          </Card.Header>
          <Card.Body minH={"100px"} display={"flex"} justifyContent={"space-between"}>
            <Text>{game.description}</Text>
            <Flex>
              <Text
                textStyle={{ base: "lg", sm: "2xl" }}
                fontWeight={{ base: "medium", lg: "bold" }}
                letterSpacing="tight"
                mt="2"
              >
                 {game.price_per_day} zl/day
              </Text>
            </Flex>
          </Card.Body>
          <Card.Footer gap="2">
            {/* Zatrzymaj propagację dla MakeRental */}
            <Box onClick={(e) => e.stopPropagation()}>
              <MakeRental game={game} currentUser={currentUser} user={user} />
            </Box>
            {(isOwner || isAdmin) && (
              <>
                {/* Zatrzymaj propagację dla EditGame */}
                <Box onClick={(e) => e.stopPropagation()}>
                  <EditGame game={game} setGames={setGames} />
                </Box>
                {/* Zatrzymaj propagację dla przycisku Delete */}
                <Button
                  variant="outline"
                  colorPalette={"red"}
                  onClick={handleDeleteGame}
                  className="prevent-dialog-click"
                >
                  Delete
                </Button>
              </>
            )}
          </Card.Footer>
        </Card.Root>
      </Box>

      {/* Dialog z dodatkowymi informacjami o grze */}
      <DialogRoot open={isOpen} onOpenChange={setIsOpen} size="xl">
        <DialogContent
          bg={useColorModeValue("teal.950", "gray.950")}
          color={"white"}
        >
          <DialogHeader>
            <Text fontSize={"xl"} fontWeight={"bold"}>{game.title}</Text>
          </DialogHeader>
          <DialogBody>
            <Text>{game.description}</Text>
            <Image
              src={game.imgUrl}
              alt={game.description}
              borderRadius={5}
              aspectRatio={16 / 10}
              mt={4}
            />
            <Flex justifyContent="space-between" mt={4}>
              <Text>Owner: @{game.owner.username}</Text>
              <Text>Price: PLN {game.price_per_day} /day</Text>
            </Flex>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>CANCEL</Button>
            <MakeRental game={game} currentUser={currentUser} user={user} />
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default GameCard;