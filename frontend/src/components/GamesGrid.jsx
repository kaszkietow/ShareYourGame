import { Box, Container, Flex, Grid, Spinner, Text } from "@chakra-ui/react";
import Navbar from "./Navbar.jsx";
import GameCard from "./GameCard.jsx";
import { useEffect, useState } from "react";

export const BASE_URL = "http://localhost:5000"
const GamesGrid = () => {
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGames = async () => {
      const token = localStorage.getItem("token"); // Pobierz token z localStorage
      try {
        const res = await fetch(BASE_URL+"/api/games", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token do nagłówka
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch games");
        }
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getGames();
  }, []);
console.log(games);
    return (
        <Container maxW="container.xl">
            <Navbar setGames={setGames} games={games} users={users}/>
            <Flex direction="column" align="center" mt={5}>
                <Grid
                    templateColumns={{
                        sm: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    }}
                    gap={6}
                >
                    {games.map((game) => {
                        // Find the user associated with the game
                        const user = users.find(user => user.id === game.owner_id);
                        return (
                            <GameCard key={game.id} game={game} setGames={setGames} user={user} />
                        );
                    })}
                    </Grid>
                    {isLoading && (
                        <Flex justifyItems="center" alignItems={"center"}>
                            <Spinner size={"xl"} />
                        </Flex>
                    )}
                    {!isLoading && games.length === 0 && (
                        <Flex justifyContent={"center"}>
                            <Text fontsize={"xl"}>
                                <Text as={"span"} fontSize={"2xl"} fontWeight={"bold"} >
                                    Poor you! 🙁
                                </Text>
                                No game found.
                            </Text>
                            
                        </Flex>
                    ) }

            </Flex>
        </Container>
    );
};

export default GamesGrid;