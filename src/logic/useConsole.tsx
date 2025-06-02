import { create } from 'zustand';

export interface Message {
    time: string;
    content: string;
    quantity: number;
}

interface ConsoleStore {
    messages: Message[];
    addMessage: (message: string) => void;
}

// Format time as HH:MM
const formatTime = (isoString: string): string => isoString.split("T")[1].slice(0, 5);

export const useConsole = create<ConsoleStore>((set) => {
    // Initial welcome message
    const initialMessages: Message[] = [
        {
            time: formatTime(new Date().toISOString()),
            content: "Welcome to Runeclicker.",
            quantity: 1,
        }
    ];

    return {
        messages: initialMessages,

        addMessage: (content: string) => {
            set((state) => {
                const lastMessage = state.messages[state.messages.length - 1];

                if (lastMessage && lastMessage.content === content) {
                    // Increase quantity of last message if it’s identical
                    const updatedMessages = state.messages.map((msg, index) =>
                        index === state.messages.length - 1
                            ? { ...msg, quantity: msg.quantity + 1 }
                            : msg
                    );

                    return { messages: updatedMessages.slice(-100) };
                }

                // Otherwise, add a new message
                const newMessages = [
                    ...state.messages,
                    {
                        time: formatTime(new Date().toISOString()),
                        content,
                        quantity: 1
                    }
                ];

                return { messages: newMessages.slice(-100) };
            });
        }
    };
});