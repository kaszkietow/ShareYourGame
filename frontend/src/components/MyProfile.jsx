import React from 'react';
import Navbar from "./Navbar.jsx";
import {Container, Flex, Stack, Table, Image, Box} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import {Avatar} from "./ui/avatar.jsx";
import EditGame from "./EditGame.jsx";

const MyProfile = (setGames, game) => {
    const location = useLocation();
    const currentUser = location.state?.currentUser;

    return (
        <Container maxW="container.xl">
            <Navbar/>
            <Flex direction={"row"}>
            <Image src={currentUser.imgUrl}
                   width={{base:"60px", md:"125px"}}
                   height={{base:"60px", md:"125px"}}
                    borderRadius="full"
                    fit="cover"
                    mt={"4"}/>
                <Flex flex={1} >
                    <Container bg="teal.600/90" m={4} borderRadius="md"></Container>
                </Flex>
            </Flex>
            <Flex direction="row" align="center" mt={5}>

                <Table.Root textStyle={{base:"xs", md:"xl"}} size={"sm"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>IMG</Table.ColumnHeader>
                            <Table.ColumnHeader>Title</Table.ColumnHeader>
                            <Table.ColumnHeader>Platform</Table.ColumnHeader>
                            <Table.ColumnHeader>Available</Table.ColumnHeader>
                            <Table.ColumnHeader>Genre</Table.ColumnHeader>
                            <Table.ColumnHeader>Condition</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end">PPD</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {currentUser.games.map((game) => (
                            <Table.Row key={game.id}>
                                <Table.Cell><Avatar src={game.imgUrl}/></Table.Cell>
                                <Table.Cell>{game.title}</Table.Cell>
                                <Table.Cell>{game.platform}</Table.Cell>
                                <Table.Cell>{game.available === "true" ? "Yes" : "No"}</Table.Cell>
                                <Table.Cell>{game.genre}</Table.Cell>
                                <Table.Cell>{game.condition}</Table.Cell>
                                <Table.Cell textAlign="end">{game.price_per_day + "PLN"} </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Flex>
        </Container>
    );
};
export default MyProfile