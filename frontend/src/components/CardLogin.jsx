import {Card, Image, Stack, Text} from "@chakra-ui/react";
import { Button } from "./ui/button.jsx";
import { useNavigate } from "react-router-dom";

const CardLogin = () => {
    const navigate = useNavigate();

    return (
        <Card.Root overflow="hidden" mx={3}>
            <Image
                src="https://images.pexels.com/photos/6704269/pexels-photo-6704269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                height={300}
                alt="RED BEAST"
                display={{ base: "none", sm: "flex" }}
            />
            <Card.Body gap="2">
                <Card.Title textStyle={"3xl"}>POSIADASZ JUZ KONTO W NASZEJ SPOŁECZNOŚCI?</Card.Title>
                <Card.Description>
                    SUPER. Możesz zalogować się klikając przycisk LOGIN poniżej.
                </Card.Description>
            </Card.Body>
            <Card.Footer gap="2">
                <Button variant="solid" onClick={() => navigate("/login")}>
                    LOGIN
                </Button>
            </Card.Footer>
        </Card.Root>
    );
};

export default CardLogin;