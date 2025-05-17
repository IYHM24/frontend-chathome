import { ref, set, update } from "firebase/database";
import { ref } from "firebase/database";


// Funcion para crear un nuevo chat
// Esta función toma el ID del chat y los datos del chat como parámetros y los guarda en la base de datos
export const createChat = async (db, chatId, chatData) => {
    try {
        const chatRef = ref(db, `chats/${chatId}`);
        await set(chatRef, chatData);
        console.log("Chat created successfully");
    } catch (error) {
        console.error("Error creating chat:", error);
    }
};

// Funcion para actualizar el contador de mensajes no leídos
// Esta función toma el ID del chat y el nuevo conteo de mensajes no leídos como parámetros y actualiza la base de datos
export const setUnreadMessageCount = async (db, chatId, count) => {
    try {
        const chatRef = ref(db, `chats/${chatId}/unreadMessages`);
        await update(chatRef, { count });
        console.log("Unread message count updated successfully");
    } catch (error) {
        console.error("Error updating unread message count:", error);
    }
};