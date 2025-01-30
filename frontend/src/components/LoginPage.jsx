import { Button, Card, Input, Stack, Flex, Text } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "./ui/password-input";
import { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState(""); // Stan dla nazwy użytkownika
  const [password, setPassword] = useState(""); // Stan dla hasła
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
        navigate("/cars");
      } else {
        alert("Nieprawidłowe dane logowania");
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
      alert("Wystąpił błąd podczas logowania");
    }
  };

  return (
    <Flex
      height="95vh"
      justifyContent="center"
      alignItems="center"
    >
      <Card.Root width={{ base: "80vw", md: "70vw" }}>
        {/* Główna karta logowania */}
        <Card.Header>
          <Text
            textStyle={{ base: "2xl", md: "4xl" }}
            color={"teal.500"}
            fontWeight={"bold"}
          >
            Login
          </Text>
          <Card.Description>
            Uzupełnij formularz, aby się zalogować.
          </Card.Description>
        </Card.Header>
        {/* Formularz logowania */}
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
  );
};

export default LoginPage;
