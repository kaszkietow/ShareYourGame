import React, { useState } from "react";
import {
  HStack,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Button } from "./ui/button";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field } from "./ui/field";
import { FaRegEdit } from "react-icons/fa";
import {BASE_URL} from "./GamesGrid.jsx";
import {toaster} from "./ui/toaster.jsx";
import {RadioCardItem, RadioCardLabel, RadioCardRoot} from "./ui/radio-card.jsx";
import {NumberInputField, NumberInputRoot} from "./ui/number-input.jsx";
import {NativeSelectField, NativeSelectRoot} from "./ui/native-select.jsx";
import {useColorModeValue} from "./ui/color-mode.jsx";

const EditGame = ({setGames, game}) => {
  const[isOpen, setIsOpen] = useState(false);
  const[isLoading, setIsLoading] = useState(false);
  const [price_per_day, setPrice_per_day] = useState("5")
  const[inputs, setInputs] = useState({
        title: game.title,
        description: game.description,
        available: game.available,
        img_url: game.img_url,
        genre: game.genre,
        condition: game.condition,
    });
  const handleEditGame =  async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const gameData = { ...inputs, price_per_day};
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(BASE_URL + "/api/games/" + game.id, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      })
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error)
      }
      setGames((prevGames) => prevGames.map((c) => c.id === game.id ? data : c));
      toaster.success({
        title: "Sukcess🎉",
        description: "Pomyślnie zaktualizowano dane.",
        duration: 4000,
      });
      setIsOpen(false);
    } catch (error) {
      toaster.error({
        title: "An error occured.",
        description: error.message,
        duration: 4000,
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant={"outline"} colorPalette={"teal"}>
            <FaRegEdit/>
          </Button>
        </DialogTrigger>
        <DialogContent bg={useColorModeValue("teal.900", "gray.950")} color={"white"}>
          <form onSubmit={handleEditGame}>
            <DialogHeader>
              <DialogTitle>Edytuj swoją gierkę 🎮🎮🎮</DialogTitle>
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
              <Button variant="outline" colorPalette={"teal"} type='submit' isLoading={isLoading}>UPDATE</Button>
              <Button onClick={(e) => setIsOpen(false)}>CANCEL</Button>
            </DialogFooter>
            </form>
        </DialogContent>
</DialogRoot>
  )
};
export default EditGame;