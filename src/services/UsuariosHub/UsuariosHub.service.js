// signalRService.js
import * as signalR from '@microsoft/signalr';

let connection = null;
const API_URL = import.meta.env.VITE_BACK_URL || "http://localhost:5069";

export const connectToHub =
  async (
    accessToken, processConected,
    processDisconected, processUpdateSidebar,
  ) => {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(API_URL + "/hubs/user", {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      //.configureLogging(signalR.LogLevel.Information)
      .build();

    //usuario desconectado
    connection.on("UserConnected", (user) => {
      //console.log("Usuario conectado:", userId);
      processConected(JSON.parse(user));
    });

    //Usuario conectado
    connection.on("UserDisconnected", (user) => {
      //console.log("Usuario desconectado:", userId);
      processDisconected(JSON.parse(user));
    });

    //actualizar sidebar
    connection.on("updateSidebar", (message) => {
      debugger
      processUpdateSidebar();
    });

    try {

      await connection.start();
      //console.log("Conectado a SignalR");
    } catch (err) {
      console.error("Error al conectar:", err);
    }

    return connection;
  };

export const getConnection = () => connection;