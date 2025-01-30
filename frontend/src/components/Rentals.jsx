import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar.jsx";
import {Container, Heading, Highlight, Table} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {BASE_URL} from "./GamesGrid.jsx";
import {toaster} from "./ui/toaster.jsx";

const Rentals = () => {
    const currentUser = location.state?.currentUser;
    const [rentals, setRentals] = useState([]);
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
                toaster.success({
                    title:"Yeas🚀",
                    description:"Udało się pobrać twoje dane.",
                    duration: 4000,
                })
            } catch (err) {
                setError(err.message);
                toaster.error({
                    title:"Error",
                    description:"Nie udało się pobrać danych.",
                    duration: 4000,
                })
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, [navigate]);

    return (
        <>
            <Navbar />
            <Container my={4}>
                <Heading size="xl" letterSpacing="tight">
                    <Highlight query="Rentals" styles={{ color: "teal.600" }}>
                      All Rentals
                    </Highlight>
                </Heading>
                <Table.Root variant="simple">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Car ID</Table.ColumnHeader>
                            <Table.ColumnHeader>User ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Reservation Date</Table.ColumnHeader>
                            <Table.ColumnHeader>Return Date</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rentals.map((rental) => (
                            <Table.Row key={rental.id}>
                                <Table.Cell>{rental.id}</Table.Cell>
                                <Table.Cell>{rental.game_id}</Table.Cell>
                                <Table.Cell>{rental.renter_id}</Table.Cell>
                                <Table.Cell>{new Date(rental.start_date).toLocaleString()}</Table.Cell>
                                <Table.Cell>{new Date(rental.end_date).toLocaleString()}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Container>
        </>
    );
};

export default Rentals;