import { ref, push, update, get, child } from "firebase/database";

// Función para obtener todos los mensajes de un chat
const obtenerMensajes = async (db, chatId) => {
    const mensajesRef = ref(db, `chats/${chatId}/mensajes`);
    const snapshot = await get(mensajesRef);

    if (!snapshot.exists()) {
        throw new Error(`El chat con ID ${chatId} no existe o no tiene mensajes.`);
    }

    return snapshot.val();
};

// Función para crear un mensaje
const crearMensaje = async (db, chatId, data) => {
    const mensajesRef = ref(db, `chats/${chatId}/mensajes`);
    const nuevoMensaje = {
        id: push(mensajesRef).key, // Genera un ID único
        ...data,
    };
    await push(mensajesRef, nuevoMensaje);
    return nuevoMensaje;
};

// Función para actualizar un mensaje
const actualizarMensaje = async (db, chatId, mensajeId, nuevoContenido, type) => {
    const mensajesRef = ref(db, `chats/${chatId}/mensajes`);
    const snapshot = await get(mensajesRef);

    if (!snapshot.exists()) {
        throw new Error(`El chat con ID ${chatId} no existe o no tiene mensajes.`);
    }

    const mensajes = snapshot.val();
    const mensajeKey = Object.keys(mensajes).find(key => mensajes[key].id === mensajeId);

    if (!mensajeKey) {
        throw new Error(`El mensaje con ID ${mensajeId} no fue encontrado en el chat ${chatId}.`);
    }

    const mensajeRef = child(mensajesRef, mensajeKey);
    await update(mensajeRef, {
        content: nuevoContenido,
        type: type,
        time: Date.now(),
    });

    return { id: mensajeId, content: nuevoContenido, time: Date.now() };
};

module.exports = {
    crearMensaje,
    actualizarMensaje,
    obtenerMensajes,
};
