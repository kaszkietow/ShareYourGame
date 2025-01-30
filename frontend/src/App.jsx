import { Button } from "./components/ui/button.jsx";
import { Card, Container, Grid, Stack } from "@chakra-ui/react";
import Navbar from "./components/Navbar.jsx";
import CardLogin from "./components/CardLogin.jsx";
import CardRegister from "./components/CardRegister.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import HomePage from "./components/HomePage.jsx";
import CarsGrid from "./components/CarsGrid.jsx";
import MyProfile from "./components/MyProfile.jsx";
import Reservations from "./components/Reservations.jsx";
import UsersList from "./components/UsersList.jsx";


function App() {
    return (
        <Router>
            <Stack minH={"100vh"}>
                <Container my={4}>
                    <Routes>
                        <Route
                            path="/"
                            element={

                                    <HomePage />
                            }
                        />
                        <Route
                            path="/login"
                            element={

                                    <LoginPage />

                            }
                        />
                        <Route
                            path="/register"
                            element={

                                    <RegisterPage />

                            }
                        />
                        <Route
                            path="/cars"
                            element={

                                    <CarsGrid />
                            }
                        />
                        <Route
                            path={"/myprofile"}
                            element={
                                <MyProfile />
                            }
                        />
                        <Route
                            path={"/reservations"}
                            element={
                                <Reservations/>
                            }
                        />
                        <Route
                            path={"/userslist"}
                            element={
                                <UsersList/>
                            }
                        />
                    </Routes>
                </Container>
            </Stack>
        </Router>
    );
}

export default App;