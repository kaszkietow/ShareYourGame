import { Box, Container, Flex, Grid, Spinner, Text } from "@chakra-ui/react";
import Navbar from "./Navbar.jsx";
import CarCard from "./CarCard.jsx";
import { useEffect, useState } from "react";

export const BASE_URL = "http://localhost:5000"
const CarsGrid = () => {
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCars = async () => {
      const token = localStorage.getItem("token"); // Pobierz token z localStorage
      try {
        const res = await fetch(BASE_URL+"/api/cars", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token do nagłówka
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch cars");
        }
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getCars();
  }, []);
console.log(cars);
    return (
        <Container maxW="container.xl">
            <Navbar setCars={setCars} cars={cars}/>
            <Flex direction="column" align="center" mt={5}>
                <Grid
                    templateColumns={{
                        sm: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    }}
                    gap={6}
                >
                    {cars.map((car) => {
                        // Find the user associated with the car
                        const user = users.find(user => user.id === car.owner_id);
                        return (
                            <CarCard key={car.id} car={car} setCars={setCars} user={user} />
                        );
                    })}
                    </Grid>
                    {isLoading && (
                        <Flex justifyItems="center" alignItems={"center"}>
                            <Spinner size={"xl"} />
                        </Flex>
                    )}
                    {!isLoading && cars.length === 0 && (
                        <Flex justifyContent={"center"}>
                            <Text fontsize={"xl"}>
                                <Text as={"span"} fontSize={"2xl"} fontWeight={"bold"} >
                                    Poor you! 🙁
                                </Text>
                                No car found.
                            </Text>
                            
                        </Flex>
                    ) }

            </Flex>
        </Container>
    );
};

export default CarsGrid;