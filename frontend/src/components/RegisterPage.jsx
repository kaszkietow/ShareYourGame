import {
    Button,
    Card,
    Input,
    Stack,
    Flex,
    Text,
    HStack,
} from "@chakra-ui/react";
import {
  RadioCardItem,
  RadioCardLabel,
  RadioCardRoot,
} from "./ui/radio-card.jsx"

import { Field } from "./ui/field";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "./ui/password-input"
import {useState} from "react";
import {BASE_URL} from "./GamesGrid.jsx";
import {useColorModeValue} from "./ui/color-mode.jsx";
import {
    NativeSelectField,
    NativeSelectRoot
} from "./ui/native-select.jsx";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(""); // Stan dla nazwy użytkownika
    const [password, setPassword] = useState(""); // Stan dla hasła
    const [gender, setGender] = useState("");
    const [location, setLocation] = useState("");

    const handleCreateUser = async (e) => {
    e.preventDefault();

    // Walidacja po stronie klienta
    if (!username.trim()) {
        alert("Username is required.");
        return;
    }

    if (!password.trim() || password.length < 6) {
        alert("Password is required and must be at least 6 characters long.");
        return;
    }

    if (!gender) {
        alert("Gender is required.");
        return;
    }

    try {
        const response = await fetch(BASE_URL + "/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, gender, location }), // Wysyłamy dane użytkownika

        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }
        alert("Account successfully created 🎉");
        navigate("/");

    } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registration: " + error.message);
    }
    console.log(data)
};


    return (
        <Flex
            height="95vh"
            justifyContent="center"
            alignItems="center"
        >
            <Card.Root width={{ base: "80vw", md: "70vw" }} bg={useColorModeValue("gray.700", "gray.750")} color={"white"}> {/* Ustawienie szerokości na 50% widoku */}
                <Card.Header>
                    <Text
                        textStyle={{ base: "2xl", md: "4xl" }}
                        color={"teal.500"}
                        fontWeight={"bold"}
                    >
                        Sign Up
                    </Text>
                    <Card.Description color={"white"}>
                        Uzupełnij formularz teraz, aby utworzyć konto.
                    </Card.Description>
                </Card.Header>
                <form onSubmit={handleCreateUser}>
                    <Card.Body>
                        <Stack gap="4" w="full">
                            <Field
                                label="Username"
                            >
                                <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}/>
                            </Field>

                            <Field
                                label="Password"
                            >
                                <PasswordInput
                                    value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                            </Field>

                            <RadioCardRoot>
                                <RadioCardLabel>Select gender</RadioCardLabel>
                                    <HStack align="stretch">
                                        <RadioCardItem
                                            label={"Female"}
                                          key={"Female"}
                                          value={'female'}
                                          onChange={(e) => setGender(e.target.value)}>
                                        </RadioCardItem>
                                        <RadioCardItem
                                            label={"Male"}
                                          key={"Male"}
                                          value={'male'}
                                          onChange={(e) => setGender(e.target.value)}>
                                        </RadioCardItem>
                                    </HStack>
                            </RadioCardRoot>
                            <NativeSelectRoot size="md" >
                              <NativeSelectField
                                placeholder="Select localization"
                                bg={useColorModeValue("gray.700", "gray.950")}
                                value={location}
                                onChange={(e) => setLocation(e.currentTarget.value)}
                              >
                                <option value="Nowy Sącz">Nowy Sącz</option>
                                <option value="Kraków">Kraków</option>
                                <option value="Bochnia">Bochnia</option>
                                <option value="Katowice">Katowice</option>
                              </NativeSelectField>
                            </NativeSelectRoot>
                        </Stack>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button colorScheme={"gray"} onClick={() => navigate("/")}>CANCEL</Button>
                        <Button  variant="surface" colorPalette={"teal"} type={'submit'}>SIGN UP</Button>
                    </Card.Footer>
                    </form>
            </Card.Root>
        </Flex>
    );
};
export default RegisterPage;
