import React, { useState, useEffect } from "react";
import {
  HStack,
  Input,
  Stack,
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
import { BASE_URL } from "./GamesGrid.jsx";
import { toaster } from "./ui/toaster.jsx";
import { useColorModeValue } from "./ui/color-mode.jsx";
import { jwtDecode } from "jwt-decode";

const EditUser = ({ setUsers, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: user.username,
    password: user.password,
    location: user.location,
  });

  const token = localStorage.getItem("token");
  let currentUser;
  try {
    if (token) {
      const decodedToken = jwtDecode(token);
      currentUser = decodedToken.sub.username; // Zalecany użytkownik (admin)
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  const isAdmin = currentUser === "admin";
  const isCurrentUser = currentUser === user.username;

  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(BASE_URL + "/api/users/" + user.id, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? data.user : u)));
      toaster.success({
        title: "Success",
        description: "User updated successfully.",
        duration: 4000,
      });
      window.location.reload(); // Przeładowanie strony po edytowaniu
      setIsOpen(false);
    } catch (error) {
      toaster.error({
        title: "Error",
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
        <Button variant={"outline"} colorPalette={"blue"}>
          <FaRegEdit />
        </Button>
      </DialogTrigger>
      <DialogContent bg={useColorModeValue("blue.900", "gray.950")} color={"white"}>
        <form onSubmit={handleEditUser}>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Stack gap="4">
              {/* Sprawdzamy, czy to admin edytuje swojego użytkownika */}
              {(isAdmin && !isCurrentUser) || !isAdmin ? (
                <Field label="Username">
                  <Input
                    value={inputs.username}
                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                    disabled={isAdmin && isCurrentUser} // Wyłączamy edytowanie "username" dla admina, który edytuje siebie
                  />
                </Field>
              ) : null}
              <Field label="Password">
                <Input
                  value={inputs.password}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                />
              </Field>
              <Field label="Location">
                <Input
                  value={inputs.location}
                  onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" colorPalette={"blue"} type="submit" isLoading={isLoading}>
              UPDATE
            </Button>
            <Button onClick={() => setIsOpen(false)}>CANCEL</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditUser;
