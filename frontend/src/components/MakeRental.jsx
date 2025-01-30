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
import {BASE_URL} from "./CarsGrid.jsx";

const MakeReservation = ({ car, currentUser }) => {
    const [reservation, setReservation] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState({
        car_id: car.id,
        user_id: currentUser.id,
        reservation_date: "",
        return_date: "",
    });

    const handleReservation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const carData = { ...inputs };

    try {
        const response = await fetch(BASE_URL + "/reservation", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(carData),
        });

        console.log("Response status:", response.status); // Logowanie statusu odpowiedzi
        const data = await response.json();
        console.log("Response data:", data); // Logowanie danych odpowiedzi

        if (response.ok) {
            toaster.success({
                title: "Reservation successful!",
                description: `Reservation ID: ${data.reservation.id}`,
                duration: 4000,
                isClosable: true,
            });
            setReservation((prevReservation) => [...prevReservation, data]);
            setIsOpen(false);
            setInputs({
                car_id: "",
                reservation_date: "",
                return_date: "",
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
const carBooked = car.available === "false";
    return (
        <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
            {!carBooked &&
            <DialogTrigger asChild>
                 <Button variant="solid">Book now</Button>
            </DialogTrigger>
            }
            <DialogContent>
                <form onSubmit={handleReservation}>
                    <DialogHeader>
                        <DialogTitle>Book a {car.model} 🚀🚜</DialogTitle>
                    </DialogHeader>
                    <DialogBody pb="4">
                        <Stack gap="4">
                            <Field label="Reservation Date">
                                <Input
                                    type="datetime-local"
                                    value={inputs.reservation_date}
                                    onChange={(e) =>
                                        setInputs({...inputs, reservation_date: e.target.value})
                                    }
                                />
                            </Field>
                            <Field label="Return Date">
                                <Input
                                    type="datetime-local"
                                    value={inputs.return_date}
                                    onChange={(e) =>
                                        setInputs({...inputs, return_date: e.target.value})
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

export default MakeReservation;
