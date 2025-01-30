import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar.jsx";
import {Button, Container, Flex, Heading, Highlight, Table, Text} from "@chakra-ui/react";
import { BASE_URL } from "./GamesGrid.jsx";
import { toaster } from "./ui/toaster.jsx";
import {useColorModeValue} from "./ui/color-mode.jsx";
import {Avatar} from "./ui/avatar.jsx";
import {PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger} from "./ui/popover.jsx";
import EditUser from "./EditUser.jsx";

const UsersList = (user) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoadin, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(BASE_URL + "/api/users", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();
                setUsers(data);
                toaster.success({
                    title: "Success🚀",
                    description: "Successfully fetched user data.",
                    duration: 4000,
                });
            } catch (err) {
                setError(err.message);
                toaster.error({
                    title: "Error",
                    description: "Failed to fetch user data.",
                    duration: 4000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const handleDeleteUser = async (user) => {
    if (user.role === "admin") {
        toaster.error({
            title: "Error",
            description: "Cannot delete an admin account!",
            duration: 4000,
        });
        return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${BASE_URL}/api/users/${user.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("Failed to delete user");
        }

        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));

        toaster.success({
            title: "Success",
            description: "User and their games deleted successfully.",
            duration: 4000,
        });

    } catch (error) {
        toaster.error({
            title: "Error",
            description: error.message,
            duration: 4000,
        });
    } finally {
        setIsLoading(false);
    }
};




    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Navbar />
            <Container mt={4} pt={2} bg={useColorModeValue("teal.950", "gray.950")} color={"white"} shadow={"xl"} borderRadius={4} >
                <Flex>
                    <Heading size="xl" letterSpacing="tight">
                        <Highlight query={"Users"} styles={{ color: "teal.600" }}>
                            All Users
                        </Highlight>
                    </Heading>
                </Flex>
                <Table.Root variant="simple" fontSize={{base:"10px", md:"lg"}}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader color={"white"}>ID</Table.ColumnHeader>
                        <Table.ColumnHeader color={"white"}>Image</Table.ColumnHeader>
                        <Table.ColumnHeader color={"white"}>Username</Table.ColumnHeader>
                        <Table.ColumnHeader color={"white"}>Gender</Table.ColumnHeader>
                        <Table.ColumnHeader color={"white"}>Location</Table.ColumnHeader>
                        <Table.ColumnHeader color={"white"}>Owned Games</Table.ColumnHeader>
                        <Table.ColumnHeader color={"white"}>Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {users.map((user) => (
                        <Table.Row key={user.id}>
                            <Table.Cell>{user.id}</Table.Cell>
                            <Table.Cell><Avatar src={user.imgUrl}></Avatar></Table.Cell>
                            <Table.Cell>{user.username}</Table.Cell>
                            <Table.Cell>{user.gender}</Table.Cell>
                            <Table.Cell>{user.location}</Table.Cell>
                            <Table.Cell> {user.games.length > 0 ? (
                                <PopoverRoot positioning={{ placement: "bottom-end" }}>
                                    <PopoverTrigger asChild>
                                        <Button size={{base:"10px", md:"sm"}} variant="outline">
                                            View Games
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverBody> {user.games.map((game) => (
                                            <Text key={game.id}> {game.title} - {game.price_per_day} zl/day </Text> ))}
                                        </PopoverBody>
                                    </PopoverContent>
                                </PopoverRoot> )
                                : ( <Text>No games</Text> )}
                            </Table.Cell>
                            <Table.Cell gap={2}>
                              <EditUser setUsers={setUsers} user={user} />

                              {user.username !== "admin" && (
                                <Button
                                  variant="outline"
                                  colorPalette={"red"}
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  Delete
                                </Button>
                              )}
                            </Table.Cell>

                        </Table.Row>
                    ))}
                </Table.Body>
               </Table.Root>
            </Container>
        </>
    );
};

export default UsersList;
