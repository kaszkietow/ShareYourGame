import React from 'react';
import Navbar1 from "./Navbar1.jsx";
import {Container, Flex, Stack, Table, Image, Box} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import {Avatar} from "./ui/avatar.jsx";

const MyProfile = () => {
    const location = useLocation();
    const currentUser = location.state?.currentUser;

    console.log("Received currentUser in MyProfile:", currentUser);

    if (!currentUser) {
        return <div>Loading user data...</div>;
    }

    if (!Array.isArray(currentUser.cars) || currentUser.cars.length === 0) {
        return <div>No cars available for this user.</div>;
    }

    // Renderowanie tabeli samochodów
    return (
        <Container maxW="container.xl">
            <Navbar1/>
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
                            <Table.ColumnHeader>Model</Table.ColumnHeader>
                            <Table.ColumnHeader>Available</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {currentUser.cars.map((car) => (
                            <Table.Row key={car.id}>
                                <Table.Cell><Avatar src={car.imgUrl}/></Table.Cell>
                                <Table.Cell>{car.model}</Table.Cell>
                                <Table.Cell>{car.available === "true" ? "Yes" : "No"}</Table.Cell>
                                <Table.Cell textAlign="end">{car.price + "PLN"} </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Flex>
        </Container>
    );
};
export default MyProfile