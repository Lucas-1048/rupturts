// hookd
import { useState } from "react";

// components
import {
    Box,
    Input,
    VStack,
    HStack,
    Text,
    Avatar,
    Flex,
    Icon,
    CloseButton,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { FaComments } from "react-icons/fa";

// icons
import { HiMiniPaperAirplane } from "react-icons/hi2";

async function enviarMensagemParaAPI(mensagem) {
    const url = "http://127.0.0.1:5000/process"; // URL da sua API

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: mensagem }),
        });

        if (!response.ok) {
            throw new Error`Erro: ${response.statusText}`();
        }

        const data = await response.json();
        return [data.response, false];
    } catch (error) {
        console.error("Erro ao enviar a mensagem:", error);
        return ["Erro ao realizar pergunta, tente novamente mais tarde", true];
    }
}

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false); // Controla se o chat está aberto ou não

    const handleSendMessage = async () => {
        if (inputValue.trim()) {
            setMessages([
                ...messages,
                {
                    text: inputValue,
                    sender: "user",
                    color: "customColors.orange",
                },
            ]);
            setInputValue("");

            const [answer, error] = await enviarMensagemParaAPI(inputValue);
            let botColor = "whiteAlpha.900";

            if (error) {
                botColor = "red.400";
            }

            setMessages([
                ...messages,
                { text: answer, sender: "bot", color: botColor },
            ]);

            console.log(botColor);
        }
    };

    const toggleChat = () => {
        setIsChatOpen((prevState) => !prevState); // Alterna o estado do chat (abrir/fechar)
    };

    return (
        <div>
            {/* Exibe o pop-up se o chat estiver fechado */}
            {!isChatOpen && (
                <Box
                    as="button"
                    position="fixed"
                    bottom="20px"
                    right="20px"
                    w="60px"
                    h="60px"
                    bg="customColors.orange"
                    borderRadius="full"
                    boxShadow="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "customColors.orange" }}
                    onClick={toggleChat} // Abre o chat ao clicar no pop-up
                >
                    <Icon as={FaComments} boxSize="24px" color="white" />
                </Box>
            )}

            {/* Exibe o chat se ele estiver aberto */}
            {isChatOpen && (
                <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="28px"
                    overflow="hidden"
                    position="fixed"
                    bottom="20px"
                    right="20px"
                    bg="customColors.lightGray"
                >
                    {/* Chat Header */}
                    <Flex
                        bg="customColors.lightGray"
                        p="4"
                        color="white"
                        align="center"
                        justify="space-between"
                    >
                        <Avatar size="sm" name="Chatbot" />
                        <Text fontSize="lg" color="customColors.darkGray">
                            Chatbot
                        </Text>
                        <CloseButton
                            size="sm"
                            color="customColors.darkGray"
                            onClick={toggleChat}
                        />
                        {/* Fecha o chat */}
                    </Flex>

                    {/* Chat Messages */}
                    <VStack
                        p="4"
                        spacing="3"
                        overflowY="scroll"
                        align="flex-start"
                        w="22rem"
                        h="24rem"
                    >
                        {messages.map((message, index) => (
                            <HStack
                                key={index}
                                w="full"
                                justify={
                                    message.sender === "user"
                                        ? "flex-end"
                                        : "flex-start"
                                }
                            >
                                <Box
                                    bg={message.color}
                                    color={
                                        message.sender === "user" ||
                                        message.color === "red.400"
                                            ? "whiteAlpha.900"
                                            : "customColors.darkGray"
                                    }
                                    px="4"
                                    py="2"
                                    borderTopLeftRadius="3xl"
                                    borderTopRightRadius={
                                        message.sender === "user"
                                            ? "none"
                                            : "3xl"
                                    }
                                    borderBottomLeftRadius={
                                        message.sender === "user"
                                            ? "3xl"
                                            : "none"
                                    }
                                    borderBottomRightRadius="3xl"
                                    maxW="80%"
                                >
                                    <Text>{message.text}</Text>
                                </Box>
                            </HStack>
                        ))}
                    </VStack>

                    {/* Input and Send Button */}
                    <HStack p="3">
                        <InputGroup marginBottom="0.5rem">
                            <Input
                                placeholder="Olá, chat!"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSendMessage()
                                }
                                bg="whiteAlpha.900"
                                borderRadius="3xl"
                                focusBorderColor="transparent"
                                border="none"
                                _hover={{ boxShadow: "none" }}
                                boxShadow="lg"
                            />
                            <InputRightElement>
                                <Box
                                    as={HiMiniPaperAirplane}
                                    color="customColors.orange"
                                    size="1.25rem"
                                    marginRight="4px"
                                />
                            </InputRightElement>
                        </InputGroup>
                    </HStack>
                </Box>
            )}
        </div>
    );
}

export default ChatApp;
