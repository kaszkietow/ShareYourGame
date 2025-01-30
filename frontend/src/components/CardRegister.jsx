import { Card, Stack, Text, Image } from "@chakra-ui/react";
import { Button } from "./ui/button.jsx";
import { useNavigate } from "react-router-dom";
import {useColorModeValue} from "./ui/color-mode.jsx";

const CardRegister = () => {
    const navigate = useNavigate();

    return (
        <Card.Root  overflow="hidden" mx={3} bg={useColorModeValue("gray.700", "gray.750")} color={"white"} shadow={"xl"}>
            <Image
                src="https://media.istockphoto.com/id/841135994/pl/zdj%C4%99cie/professional-girl-gamer-gra-w-mmorpg-strategia-gry-wideo-na-swoim-komputerze-bierze-udzia%C5%82-w.jpg?s=612x612&w=0&k=20&c=ay8QcIyeU5HhUuKTcSBom2BRm5PlQryBaqKqASVhjno="
                height={300}
                alt="RED BEAST"
                display={{ base: "none", sm: "flex" }}
            />
            <Card.Body gap="2">
                <Card.Title textStyle={"3xl"}>NIE MASZ JESZCZE SWOJEGO KONTA?</Card.Title>
                <Card.Description color={"white"}>
                    Spokojnie ... To żaden problem. Utwórz swoje konto już teraz.
                </Card.Description>
            </Card.Body>
            <Card.Footer gap="2">
                <Button variant="solid" onClick={() => navigate("/register")}>
                    REGISTER NOW
                </Button>
            </Card.Footer>
        </Card.Root>
    );
};

export default CardRegister;