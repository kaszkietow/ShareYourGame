import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar.jsx";
import { Container, Heading, Highlight, Table } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./GamesGrid.jsx";
import { toaster } from "./ui/toaster.jsx";
import {useColorModeValue} from "./ui/color-mode.jsx";

const Rentals = () => {
    const [rentals, setRentals] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(BASE_URL + "/getrental", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch rentals");
                }

                const data = await response.json();
                setRentals(data.rentals);
                setCurrentUser(data.user); // Ustawienie danych bieżącego użytkownika
                toaster.success({
                    title: "Yeas🚀",
                    description: "Udało się pobrać twoje dane.",
                    duration: 4000,
                });
            } catch (err) {
                setError(err.message);
                toaster.error({
                    title: "Error",
                    description: "Nie udało się pobrać danych.",
                    duration: 4000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, [navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Navbar />
            <Container mt={4} pt={2} bg={useColorModeValue("teal.950", "gray.950")} color={"white"} shadow={"xl"} borderRadius={4}>
                <Heading size="xl" letterSpacing="tight">
                    <Highlight query="Rentals" styles={{ color: "teal.600" }}>
                      All Rentals
                    </Highlight>
                </Heading>
                <Table.Root variant="simple">
                    <Table.Header >
                        <Table.Row>
                            <Table.ColumnHeader color={"white"}>Game Title</Table.ColumnHeader>
                            {currentUser?.username === 'admin' && (
                                <Table.ColumnHeader color={"white"}>Renter</Table.ColumnHeader>
                            )}
                            <Table.ColumnHeader color={"white"}>Start Date</Table.ColumnHeader>
                            <Table.ColumnHeader color={"white"}>End Date</Table.ColumnHeader>
                            <Table.ColumnHeader color={"white"}>Total Price</Table.ColumnHeader>
                            <Table.ColumnHeader color={"white"}>Status</Table.ColumnHeader>

                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rentals.map((rental) => (
                            <Table.Row key={rental.id}>
                                <Table.Cell>{rental.game.title}</Table.Cell>
                                {currentUser?.username === 'admin' && (
                                    <Table.Cell>{rental.renter.username}</Table.Cell>
                                )}
                                <Table.Cell>{new Date(rental.start_date).toLocaleString()}</Table.Cell>
                                <Table.Cell>{new Date(rental.end_date).toLocaleString()}</Table.Cell>
                                <Table.Cell>{rental.total_price}</Table.Cell>
                                <Table.Cell>{rental.status}</Table.Cell>

                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Container>
        </>
    );
};

export default Rentals;
