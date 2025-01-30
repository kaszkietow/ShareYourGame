import {Card, Image, Stack, Text} from "@chakra-ui/react";
import { Button } from "./ui/button.jsx";
import { useNavigate } from "react-router-dom";
import {useColorModeValue} from "./ui/color-mode.jsx";

const CardLogin = () => {
    const navigate = useNavigate();

    return (
        <Card.Root overflow="hidden" mx={3} bg={useColorModeValue("gray.700", "gray.750")} color={"white"} shadow={"xl"}>
            <Image
                src="https://media.istockphoto.com/id/1069815226/pl/wektor/gra-nad-tekstem-usterka-gry-wideo-zniekszta%C5%82cenia-kolor%C3%B3w-i-szum-pikseli-cyfrowy-szablon.jpg?s=612x612&w=0&k=20&c=zgzIYm5P3u-HcSNmDqate1GU0XRcZ_pqiKc92wUjSLU="
                height={300}
                alt="RED BEAST"
                display={{ base: "none", sm: "flex" }}
            />
            <Card.Body gap="2">
                <Card.Title textStyle={"3xl"}>JESTEŚ JEDNYM Z NAS?</Card.Title>
                <Card.Description color={"white"}>
                    SUPER. Możesz zalogować się klikając przycisk LOGIN poniżej.
                </Card.Description>
            </Card.Body>
            <Card.Footer gap="2" >
                <Button variant="solid" onClick={() => navigate("/login")}>
                    LOGIN
                </Button>
            </Card.Footer>
        </Card.Root>
    );
};

export default CardLogin;