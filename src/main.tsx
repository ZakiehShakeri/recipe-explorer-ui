import { MagnifyingGlassIcon, PaperPlaneIcon } from "@radix-ui/react-icons";

import { Box, Card, Flex, Heading, IconButton, Inset, Strong, Text, TextField, Theme } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect} from 'react';

type SampleFoodProps = { imageUrl: string, foodName: string, description: string };

function SampleFood(sampleFood: SampleFoodProps) {
    return (<Box maxWidth={"300px"} height={"250px"}>
        <Card size="2">
            <Inset clip="padding-box" side="top" pb="current">
                {sampleFood.imageUrl !== "" &&
                    <img
                        src={sampleFood.imageUrl}
                        alt="Bold typography"
                        style={{
                            display: "block",
                            objectFit: "cover",
                            width: "100%",
                            height: 140,
                            backgroundColor: "var(--gray-5)",
                        }}
                        crossOrigin="anonymous"
                    />}
            </Inset>
            <Text as="p" size="3">
                <Strong><Link to={`/recipe?foodName=${encodeURIComponent(sampleFood.foodName)}`}>{sampleFood.foodName}</Link></Strong> {sampleFood.description}
            </Text>
        </Card>
    </Box>);
}

function SampleFoodRow({ sf }: { sf: SampleFoodProps[] }) {
    return (<Flex justify={"between"} align={"center"} gap={"8"} >
        {sf.map(n => <SampleFood key={n.foodName} imageUrl={n.imageUrl} foodName={n.foodName} description={n.description} />)}
    </Flex>)
}

function Root() {
    const navigate = useNavigate();
    const [sampleFoods, setSampleFoods] = useState([
        { foodName: "Fesenjoon", description: "A beloved Persian dish, celebrated for its sweet, tangy, and nutty flavors.", imageUrl: "images/fesenjoon.jpeg" },
        { foodName: "Ghormeh Sabzi", description: "A Persian herb stew with kidney beans and dried limes.", imageUrl: "images/ghormeh sabzi.jpeg" },
        { foodName: "Kebab", description: "A delicious Persian dish made with ground meat, onions, and spices.", imageUrl: "images/kebab.jpeg" },
        { foodName: "Zereshk Polo", description: "A Persian rice dish with barberries, saffron, and pistachios.", imageUrl: "images/zereshk polo.jpeg" },
        { foodName: "Abgoosht", description: "A traditional Persian soup made with lamb, chickpeas, and potatoes.", imageUrl: "images/abgoosht.jpeg" },
        { foodName: "Ghalieh Mahi", description: "A spicy Persian fish stew made with herbs, garlic, and tamarind.", imageUrl: "images/ghalieh mahi.jpeg" },
    ]);

    useEffect(() => {
        const fetchImages = async () => {
            const updatedFoods = await Promise.all(sampleFoods.map(async (food) => {
                if (food.imageUrl && food.imageUrl !== "")
                    return food;
                // Fetch the image URL from the API
                const response = await fetch(`https://recipe-explorer-api.zakieh-z.workers.dev/getImage?foodOrIngName=${food.foodName}`, { mode: "cors" });
                const imageJson = await response.json();
                if (!imageJson.thumb)
                    return { ...food, imageUrl: "images/general.jpg" };
                return { ...food, imageUrl: imageJson.thumb };
            }));
            setSampleFoods(updatedFoods);
        };

        fetchImages();
    }, []);

    return (
        <Flex direction={"column"} justify={"center"} align={"center"}>
            <Theme accentColor="blue" appearance="light">
                <Flex direction={"column"} gap={"4"} justify={"center"} align={"stretch"} maxWidth="1000px">
                    {/* Header */}
                    <Flex direction={"row"} justify={"center"}>
                        <Flex justify="center" align="center" p="4"><Heading size={"9"} wrap={"pretty"} color="gray">Recipe Explorer</Heading></Flex>
                        {/* <img
                            src="images/fesenjoon2.jpg"
                            style={{
                                display: "block",
                                objectFit: "cover",
                                flexBasis: "2000px",
                                flexGrow: 1,
                                flexShrink: 1,
                                backgroundColor: "var(--gray-5)",
                                height: 250
                            }

                            }
                        /> */}
                    </Flex>

                    {/* Search Bar */}
                    <Card size={"2"}>
                        <Flex direction={"column"} gap={"4"} align={"stretch"} justify={"center"}>

                            <Flex direction={"column"} gap={"4"} align={"start"} justify={"start"} flexGrow={"1"} flexBasis={"200px"}>
                                <Box>
                                    <Text as="p" size="4" color="gray" >
                                        Hi! I'm your cooking assistant. Enter the name of a dish you'd like to explore... 😊
                                    </Text>
                                    <br />
                                </Box>

                            </Flex>
                            <Box>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const question = (e.target as HTMLFormElement).question.value;
                                    navigate(`/recipe?foodName=${encodeURIComponent(question)}`);
                                }}>
                                    <TextField.Root size={"3"} name="question" placeholder="Ask your questions here…">
                                        <TextField.Slot>
                                            <MagnifyingGlassIcon height="16" width="16" />
                                        </TextField.Slot>
                                        <TextField.Slot>
                                            <IconButton type="submit" size="1" variant="ghost">
                                                <PaperPlaneIcon height="14" width="14" />
                                            </IconButton>
                                        </TextField.Slot>
                                    </TextField.Root>
                                </form>
                            </Box>

                        </Flex>
                    </Card>
                    {/* Sample Foods */}
                    {[0].map(i => <SampleFoodRow key={`${i}`} sf={sampleFoods.slice(0, 3)} />)}
                    {[1].map(i => <SampleFoodRow key={`${i}`} sf={sampleFoods.slice(3, 6)} />)}
                </Flex>
            </Theme>
        </Flex>
    );
}

export default function Main() {
    return <Root />
}