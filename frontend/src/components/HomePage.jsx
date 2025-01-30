import {Box, Container, Grid, Stack} from "@chakra-ui/react";
import CardLogin from "./CardLogin.jsx";
import CardRegister from "./CardRegister.jsx";
import Navbar from "./Navbar.jsx";

const HomePage = () => {
    return (
        <Stack minH={"100vh"}>
            <Navbar />
            <Container my={4} >
                <Grid
                    templateColumns={{
                        base: "1fr",
                        md: "repeat(2, 1fr)"
                    }}
                    gap={2}
                >
                    <CardLogin/>
                    <CardRegister/>
                </Grid>

            </Container>
        </Stack>
    );
};

export default HomePage;