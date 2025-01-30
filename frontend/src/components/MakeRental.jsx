import {
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader, DialogRoot,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog.jsx";
import {Button, Input, Stack} from "@chakra-ui/react";
import {Field} from "./ui/field.jsx";
import {useState} from "react";
import {toaster} from "./ui/toaster.jsx";
import {BASE_URL} from "./GamesGrid.jsx";

const MakeRental = ({ game, currentUser }) => {
    const [rental, setRental] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState({
        game_id: game.id,
        renter_id: currentUser.id,
        start_date: "",
        end_date: "",
    });

    const handleRental = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const gameData = { ...inputs };

    try {
        const response = await fetch(BASE_URL + "/rental", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(gameData),
        });

        const data = await response.json();
        if (response.ok) {
            toaster.success({
                title: "Rental successful!",
                description: `Rental ID: ${data.rental.id}`,
                duration: 4000,
                isClosable: true,
            });
            setRental((prevRental) => [...prevRental, data]);
            setIsOpen(false);
            setInputs({
                game_id: "",
                start_date: "",
                end_date: "",
            });
        } else {
            toaster.error({
                title: "Error",
                description: data.error || "Failed to make a reservation",
                duration: 4000,
                isClosable: true,
            });
        }
    } catch (error) {
        console.error("Error during reservation:", error);
        toaster.error({
            title: "Error",
            description: "An unexpected error occurred.",
            duration: 4000,
            isClosable: true,
        });
    } finally {
        setIsLoading(false);
    }
};
const gameBooked = game.available === "false";
    return (
        <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
            {!gameBooked &&
            <DialogTrigger asChild>
                 <Button variant="solid">Book now</Button>
            </DialogTrigger>
            }
            <DialogContent>
                <form onSubmit={handleRental}>
                    <DialogHeader>
                        <DialogTitle>Book a {game.title} 🔥🌟</DialogTitle>
                    </DialogHeader>
                    <DialogBody pb="4">
                        <Stack gap="4">
                            <Field label="Reservation Date">
                                <Input
                                    type="datetime-local"
                                    value={inputs.start_date}
                                    onChange={(e) =>
                                        setInputs({...inputs, start_date: e.target.value})
                                    }
                                />
                            </Field>
                            <Field label="Return Date">
                                <Input
                                    type="datetime-local"
                                    value={inputs.end_date}
                                    onChange={(e) =>
                                        setInputs({...inputs, end_date: e.target.value})
                                    }
                                />
                            </Field>
                        </Stack>
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button isLoading={isLoading} type="submit">
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </DialogRoot>
    );
};

export default MakeRental;
