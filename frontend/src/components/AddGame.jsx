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
import {BASE_URL} from "./CarsGrid.jsx";
import {NumberInputField, NumberInputRoot} from "./ui/number-input.jsx";

const AddCar = ( { setCars }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Fixed initial state
  const [price, setPrice] = useState("100")
  const [inputs, setInputs] = useState({
    model: "",
    description: "",
    available: "",
    img_url: "",
  });

  const handleAddCar = async (e) => {
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
  const carData = { ...inputs, owner_id, price };

  // Dodanie logowania do konsoli, aby sprawdzić, co wysyłasz
  console.log('Sending car data to server:', carData);

  try {
    const res = await fetch(BASE_URL+"/api/cars", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carData),  // Wysyłanie połączonych danych
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

    setCars((prevCars) => [...prevCars, data]);

    setIsOpen(false);
    setInputs({
      model: "",
      description: "",
      available: "",
      img_url: "",
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
      <DialogContent>
        <form onSubmit={handleAddCar}>
          <DialogHeader>
            <DialogTitle>Add a new car 🚗</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Stack gap="4">
              <Field label="Model">
                <Input
                    placeholder="BMW M3 CS"
                    value={inputs.model}
                    onChange={(e) =>
                        setInputs({...inputs, model: e.target.value})
                    }
                />
              </Field>
              <Field label="Description">
                <Input
                    placeholder="Description of the car"
                    value={inputs.description}
                    onChange={(e) =>
                        setInputs({...inputs, description: e.target.value})
                    }
                />
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
              <Field label="Price" >
                <NumberInputRoot
                    value={price}
                    onValueChange={(e) => setPrice(e.value)}>
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

export default AddCar;
