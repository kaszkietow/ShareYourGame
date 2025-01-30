import { Card, Stack, Text, Image } from "@chakra-ui/react";
import { Button } from "./ui/button.jsx";
import { useNavigate } from "react-router-dom";

const CardRegister = () => {
    const navigate = useNavigate();

    return (
        <Card.Root  overflow="hidden" mx={3}>
            <Image
                src="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                height={300}
                alt="RED BEAST"
                display={{ base: "none", sm: "flex" }}
            />
            <Card.Body gap="2">
                <Card.Title textStyle={"3xl"}>NIE MASZ JESZCZE SWOJEGO KONTA?</Card.Title>
                <Card.Description>
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