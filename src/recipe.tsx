// import { MagnifyingGlassIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Box, Card, Flex, Heading, HoverCard, Inset, Link, Spinner, Strong, Text, Theme } from "@radix-ui/themes";
// import { Box, Card, Flex, Heading, HoverCard, IconButton, Inset, Link, Spinner, Strong, Text, TextField, Theme } from "@radix-ui/themes";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

type Ingredient = { name: string, amount: string, description: string };
type RecipeProps = { name: string, description: string, ingredients: Ingredient[], instructions: string[] };

function useImageUrl(foodOrIngName: string) {
    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        const fetchImageUrl = async () => {
            if (!foodOrIngName) return;
            try {
                const response = await fetch(`https://recipe-explorer-api.zakieh-z.workers.dev/getImage?foodOrIngName=${foodOrIngName}`, { mode: "cors" });
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                const data = await response.json();
                if (!data.thumb)
                    setImageUrl("images/general.jpg");
                setImageUrl(data.url);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImageUrl();
    }, [foodOrIngName]);

    return imageUrl;
}

function IngredientHoverCard({ ing }: { ing: Ingredient }) {
    const imgUrl = useImageUrl(ing.name);
    return <Flex>
        <Box asChild flexShrink="0">
            <Inset side="left" pr="current">
                <img
                    src={imgUrl}
                    alt={ing.name}
                    style={{
                        display: "block",
                        objectFit: "cover",
                        height: "100%",
                        width: 150,
                        backgroundColor: "var(--gray-5)",
                    }}
                />
            </Inset>
        </Box>
        <Text size="2" as="p">
            <Strong>{ing.name}</Strong>{' '}{ing.description}
        </Text>
    </Flex>

}

function ShowIngredient({ ing }: { ing: Ingredient }) {

    return (
        <HoverCard.Root>
            <HoverCard.Trigger>
                <Link href="#">{ing.name}</Link>
            </HoverCard.Trigger>

            <HoverCard.Content width="450px">
                <IngredientHoverCard ing={ing} />
            </HoverCard.Content>
        </HoverCard.Root>
    );
}



export default function Recipe() {
    // const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const foodName = searchParams.get('foodName');
    const [recipe, setRecipe] = useState<RecipeProps | null>(null);
    const imgUrl = useImageUrl(recipe?.name ?? '');

    useEffect(() => {
        const fetchRecipe = async function () {
            if (!foodName) return;
            try {
                const response = await fetch(`https://recipe-explorer-api.zakieh-z.workers.dev/getRecipe?foodName=${foodName}`, { mode: "cors" });
                if (!response.ok) {
                    throw new Error('Failed to fetch recipe');
                }
                const data = await response.json();
                setRecipe(data);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        }

        fetchRecipe();
    }, [foodName]); // Add foodName as dependency




    return (
        <Flex direction={"column"} justify={"center"} align={"center"}>
            <Theme accentColor="blue" appearance="light">
                <Flex direction={"column"} gap={"4"} justify={"center"} align={"stretch"} maxWidth="1000px" >
                    {!recipe && (
                        <Flex direction="column" justify="center" align="center" height="100vh" gap={"4"}>
                            <Spinner />
                            <Text size="3" mt="4">Loading recipe...</Text>
                        </Flex>
                    )}
                    {/* Header */}
                    <Flex direction={"row"} align={"stretch"} justify={"between"} maxHeight={"150px"} >
                        <Flex justify="center" align="center" p="4">
                            <Heading size={"9"} wrap={"pretty"} color="gray">
                                {recipe?.name}
                            </Heading>
                        </Flex>
                        {imgUrl && (
                            <img
                                src={imgUrl}
                                style={{
                                    display: "block",
                                    objectFit: "cover",
                                    backgroundColor: "var(--gray-5)",
                                    maxWidth: "600px"
                                }}
                            />
                        )}
                    </Flex>

                    {/* Ingredients */}
                    <Card size={"2"}>
                        <Flex direction={"column"} gap={"4"} align={"start"} justify={"start"} >
                            <Heading size={"4"} wrap={"pretty"} color="gray">Ingredients</Heading>
                            {recipe?.ingredients.length && (
                                <ul>
                                    {recipe.ingredients.map((ingredient, i) => (
                                        <li key={`${i}`}>{ingredient.amount} <ShowIngredient ing={ingredient} /></li>
                                    ))}
                                </ul>
                            )}
                        </Flex>
                    </Card>

                    {/* Instructions */}
                    <Text>
                        <Heading size={"4"} wrap={"pretty"} color="gray">Instructions</Heading>
                        <ul>
                            {recipe?.instructions.map((instruction, i) => (
                                <li key={`${i}`}>{instruction}</li>
                            ))}
                        </ul>
                        {/* Fallback for instructions if not an array */}
                        {Array.isArray(recipe?.instructions) ? null : (
                            <Text size="2" color="gray">
                                {recipe?.instructions}
                            </Text>
                        )}

                    </Text>

                    {/* Search Bar
                    <Card size={"2"}>
                        <Flex direction={"column"} gap={"4"} align={"stretch"} justify={"center"}>

                            <Flex direction={"column"} gap={"4"} align={"start"} justify={"start"} flexGrow={"1"} flexBasis={"100px"}>
                                <Box>
                                    <Text as="p" size="4" color="gray" >
                                        Hi! I'm your cooking assistant. Ask me any question you may have from this recipe 😊.
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
                                <TextField.Root size={"3"} placeholder="Ask your questions here…">
                                    <TextField.Slot>
                                        <MagnifyingGlassIcon height="16" width="16" />
                                    </TextField.Slot>
                                    <TextField.Slot>
                                        <IconButton size="1" variant="ghost">
                                            <PaperPlaneIcon height="14" width="14" />
                                        </IconButton>
                                    </TextField.Slot>
                                </TextField.Root>
                            </form>
                        </Box>

                </Flex>
            </Card> */}

        </Flex>
            </Theme >
        </Flex >
    );
}