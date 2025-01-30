import React, { useState } from "react";
import {
  HStack,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Button } from "./ui/button";
import {RadioCardItem, RadioCardLabel, RadioCardRoot} from "./ui/radio-card.jsx"
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  DialogTrigger,
} from "./ui/dialog";
import { Field } from "./ui/field";
import { IoAddCircleSharp } from "react-icons/io5";
import { toaster } from "./ui/toaster.jsx";
import {jwtDecode} from "jwt-decode";
import {BASE_URL} from "./GamesGrid.jsx";
import {NumberInputField, NumberInputRoot} from "./ui/number-input.jsx";
import {NativeSelectField, NativeSelectRoot} from "./ui/native-select.jsx";
import {useColorModeValue} from "./ui/color-mode.jsx";

const AddGame = ({ setGames }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Fixed initial state
  const [price_per_day, setPrice_per_day] = useState("5")
  const [inputs, setInputs] = useState({
    title: "",
    platform: "",
    genre: "",
    condition: "",
    img_url: "",
    description: "",
    available: "",
  });

  const handleAddGame = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const token = localStorage.getItem("token");
  if (!token) {
    toaster.error({
      title: "No token found",
      description: "Please log in to continue",
      duration: 4000,
    });
    setIsLoading(false);
    return;
  }

  let owner_id;
  try {
    const decodedToken = jwtDecode(token);
    owner_id = decodedToken.sub.id;
  } catch (error) {
    toaster.error({
      title: "Token error",
      description: "Could not decode the token",
      duration: 4000,
    });
    setIsLoading(false);
    return;
  }

  // Łączenie inputs i owner_id w jeden obiekt
  const gameData = { ...inputs, owner_id, price_per_day };

  // Dodanie logowania do konsoli, aby sprawdzić, co wysyłasz
  console.log('Sending game data to server:', gameData);

  try {
    const res = await fetch(BASE_URL+"/api/games", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),  // Wysyłanie połączonych danych
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }

    toaster.success({
      title: "Sukcess 🎉",
      description: "Samochód został pomyślnie dodany!",
      duration: 4000,
    });

    setGames((prevGames) => [...prevGames, data]);

    setIsOpen(false);
    setInputs({
        title: "",
        platform: "",
        genre: "",
        condition: "",
        img_url: "",
        description: "",
        available: "",
    });
  } catch (error) {
    toaster.error({
      title: "An error occurred",
      description: error.message,
      duration: 4000,
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} colorPalette={"teal"}>
          <IoAddCircleSharp />
        </Button>
      </DialogTrigger>
      <DialogContent bg={useColorModeValue("teal.900", "gray.950")} color={"white"}>
        <form onSubmit={handleAddGame}>
          <DialogHeader>
            <DialogTitle>Add a new game 🎮</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Stack gap="4">
              <Field label="Title">
                <Input
                    placeholder="Uncharted 3"
                    value={inputs.title}
                    onChange={(e) =>
                        setInputs({...inputs, title: e.target.value})
                    }
                />
              </Field>
              <Stack>
              <RadioCardRoot >
                <RadioCardLabel>Platform</RadioCardLabel>
                        <HStack align="stretch">
                        <RadioCardItem
                          label={"PS3"}
                          value={'PS3'}
                          onChange={(e) =>
                            setInputs({...inputs, platform: e.target.value})
                          }/>
                        <RadioCardItem
                          label={"PS4"}
                          value={'PS4'}
                          onChange={(e) =>
                            setInputs({...inputs, platform: e.target.value})
                          }/>
                        <RadioCardItem
                          label={"PS5"}
                          value={'PS5'}
                          onChange={(e) =>
                            setInputs({...inputs, platform: e.target.value})
                          }/>
                          <RadioCardItem
                          label={"PC"}
                          value={'PC'}
                          onChange={(e) =>
                            setInputs({...inputs, platform: e.target.value})
                          }/>
                </HStack>
              </RadioCardRoot>
              </Stack>
              <Field label={"Genre"}>
                <NativeSelectRoot size="md" >
                  <NativeSelectField
                      placeholder="Select genre"
                      bg={useColorModeValue("teal.900", "gray.950")}
                      value={inputs.genre}
                      onChange={(e) => setInputs({...inputs, genre: e.currentTarget.value})}
                  >
                    <option value="action">Action</option>
                    <option value="adventure">Adventure</option>
                    <option value="role-playing">Role-playing</option>
                    <option value="simulation">Simulation</option>
                    <option value="strategy">Strategy</option>
                    <option value="sports">Sports</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>
              <Field label={"Condition"}>
                <NativeSelectRoot size="md" >
                  <NativeSelectField
                      placeholder="Select genre"
                      bg={useColorModeValue("teal.900", "gray.950")}
                      value={inputs.condition}
                      onChange={(e) => setInputs({...inputs, condition: e.currentTarget.value})}
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="damaged">Damaged</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>
              <Stack>
              <RadioCardRoot >
                <RadioCardLabel>Avability</RadioCardLabel>
                        <HStack align="stretch">
                        <RadioCardItem
                          label={"Not Available"}
                          value={'false'}
                          onChange={(e) =>
                            setInputs({...inputs, available: e.target.value})
                          }>
                        </RadioCardItem>

                        <RadioCardItem
                          label={"Available"}
                          value={'true'}
                          onChange={(e) =>
                            setInputs({...inputs, available: e.target.value})
                          }>
                        </RadioCardItem>
                </HStack>
              </RadioCardRoot>
              </Stack>
              <Field label="Price per day" >
                <NumberInputRoot
                    value={price_per_day}
                    onValueChange={(e) => setPrice_per_day(e.value)}>
                  <NumberInputField/>
                </NumberInputRoot>
              </Field>
              <Field label="Image URL" >
                <Textarea
                    overflow={"hidden"}
                    resize={"none"}
                    placeholder="Image link"
                    value={inputs.img_url}
                    onChange={(e) =>
                        setInputs({...inputs, img_url: e.target.value})
                    }
                />
              </Field>
              <Field label="Description">
                <Textarea
                    placeholder="Great and beautifull game."
                    overflow={"hidden"}
                    resize={"none"}
                    value={inputs.description}
                    onChange={(e) =>
                        setInputs({...inputs, description: e.target.value})
                    }
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button
                variant="outline"
                colorPalette={"teal"}
                type='submit'
                isLoading={isLoading}
            >
              ADD
            </Button>
            <Button onClick={() => setIsOpen(false)}>CANCEL</Button>
          </DialogFooter>
          </form>
      </DialogContent>
</DialogRoot>
  );
};

export default AddGame;
