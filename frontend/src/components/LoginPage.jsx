import {Button, Card, Input, Stack, Flex, Text, Box} from "@chakra-ui/react";
import { Field } from "./ui/field";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "./ui/password-input";
import { useState } from "react";
import {useColorModeValue} from "./ui/color-mode.jsx";
import bgImage from "../../digital-art-beautiful-mountains.jpg";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        console.log(data.access_token)
        navigate("/games");
      } else {
        alert("Nieprawidłowe dane logowania");
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
      alert("Wystąpił błąd podczas logowania");
    }
  };

  return (
  <Box
    bgImage={`url(${bgImage})`}
    width="100vw"
    minHeight="100vh"
    backgroundSize="cover"
    backgroundPosition="center"
    backgroundRepeat="no-repeat"
    position="fixed" // Zapewnia pełne pokrycie ekranu
    top="0"
    left="0"
  >
    <Flex
      height="95vh"
      justifyContent="center"
      alignItems="center"
    >
      <Card.Root width={{ base: "80vw", md: "70vw" }} shadow={"2lg"} bg={useColorModeValue("gray.700", "gray.750")} color={"white"}>
        {/* Główna karta logowania */}
        <Card.Header>
          <Text
            textStyle={{ base: "2xl", md: "4xl" }}
            color={"teal.500"}
            fontWeight={"bold"}
          >
            Login
          </Text>
          <Card.Description color={"white"}>
            Uzupełnij formularz, aby się zalogować.
          </Card.Description>
        </Card.Header>
        <form onSubmit={handleLogin}>
          <Card.Body>
            <Stack gap="4" w="full">
              <Field label="Username">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>
              <Field label="Password">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
            </Stack>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Button
              colorScheme="gray"
              onClick={() => navigate("/")}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              variant="surface"
              colorPalette="teal"
            >
              LOGIN
            </Button>
          </Card.Footer>
        </form>
      </Card.Root>
    </Flex>
</Box>
  );
};

export default LoginPage;
