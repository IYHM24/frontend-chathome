import { axionsInstanceBearer } from "../instance";

// Función para realizar operaciones relacionadas con mensajes
export const MensajesOperations = async (data) => {
    try {
        if (!data) {
            throw new Error("El mensaje no puede ser nulo.");
        }
        const response = await axionsInstanceBearer.post("/mensajes/operaciones", data);
        return response.data; // Retorna solo los datos de la respuesta
    } catch (error) {
        console.error("Error en MensajesOperations:", error.message);
        throw error; // Lanza el error para que pueda ser manejado por el llamador
    }
};
