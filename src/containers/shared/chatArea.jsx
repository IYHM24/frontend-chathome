import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import NoSelectedChat from '@/assets/ilustrations/no_chat.svg'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { FaCamera, FaFile, FaGripVertical, FaImage, FaMicrophone, FaPaperclip, FaPhone, FaSearch, FaSmile, FaVideo } from 'react-icons/fa'
import { ref, set, onValue } from "firebase/database";
import '../../style/chat.css'
import { ConfigContext } from '@/context/configContext'
import { getUser } from '@/utils/AuthConfig'
import { useState } from 'react'
import { obtenerHoraMilitarUnix } from '@/utils/timeOperations'
import { useRef } from 'react'
import { FirebaseContext } from '@/context/firebaseContext'
import { MensajesOperations } from '@/services/MensajesController/MensajesController.service'
import { UsuariosOperation } from '@/services/UsuariosController/UsuariosController.service'
import { useForm } from "react-hook-form";


const ChatArea = ({ id_chat, usuarioChat, usuarioChatRef, setid_chat, isSearchingRef, setIsSearching, isSearching, setUsuarioChat }) => {

    const { remember } = useContext(ConfigContext)
    const { register, reset } = useForm();
    const { db } = useContext(FirebaseContext)
    const [messages, setMessages] = useState([])
    const [online, setOnline] = useState(false)
    const chatRef = useRef(null);
    const chatWrapRef = useRef(null);

    // Función para hacer scroll al final
    const scrollToBottom = () => {
        if (chatWrapRef.current) {
            chatWrapRef.current.scrollTop = chatWrapRef.current.scrollHeight;
        }
    };

    // Hacer scroll al final cuando los mensajes cambien
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    //Configuracion incial
    useEffect(() => {
        if (id_chat) {
            chatRef.current = ref(db, `chats/${id_chat}/mensajes`);
            const unsubscribe = onValue(chatRef.current, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const formattedMessages = Object.values(data).map((mensaje) => ({
                        sender: mensaje.sender,
                        content: mensaje.content,
                        time: obtenerHoraMilitarUnix(mensaje.time),
                        isMe: mensaje.sender === getUser(remember).user.uid,
                    }));
                    setMessages(formattedMessages);
                }
            });

            return () => unsubscribe(); // Cleanup listener on unmount or when id_chat changes
        }
    }, [id_chat])

    useEffect(() => {
        establecer_estado();
    }, [usuarioChat])


    const establecer_estado = async () => {
        if (!usuarioChat) return;
        setOnline(usuarioChat.online);
    }

    const sendDataChat = async (newMessage, usuariosKeys) => {
        try {
            const user = getUser(remember);
            if (!user) throw new Error("Usuario no autenticado");
            delete newMessage.isMe;
            const newMessageData = {
                ...newMessage,
            };
            //validar si el chat existe
            if (id_chat === null || id_chat === undefined || id_chat === "") {
                // Crear un nuevo chat
                id_chat = `chat_${Date.now()}`;
                await crearChat(newMessageData, user, id_chat); // Crear el chat e ingresar el mensaje
            }
            else {
                //Anexar el mensaje al chat existente
                anexarMensaje(id_chat, newMessageData); // Agregar el mensaje al chat existente
            }
            await notifyBackend(usuariosKeys, newMessage, user); // Almacenar en base de datos

        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    };

    const notifyBackend =
        async (
            usuariosKeys, newMessage,
            user
        ) => {
            //Almacenar en base de datos
            const unixTime = Math.floor(Date.now() / 1000); // Obtener el tiempo en formato UNIX en segundos
            // Extraer las llaves (ui) del objeto usuarios y guardarlas en un array
            const data = {
                mensaje: {
                    id: 0,
                    chat_id: id_chat,
                    texto: newMessage.content,
                    mensajes_sin_leer: 0,
                    ui_usuario_remitente: user.user.uid,
                    id_ultimo_mensaje: unixTime.toString(),
                    proceso: 'actualizar o crear',
                    time: unixTime,
                    type: newMessage.type,
                },
                ui_usuarios: usuariosKeys,
            };
            await MensajesOperations(data)
            setIsSearching(false);
            isSearchingRef.current = false;
        }

const crearChat = async (newMessageData, user, chatId) => {
        if (!usuarioChatRef.current) {
            console.error("No hay un usuario seleccionado para el chat");
            return;
        }
        const newChatData = {
            chatId,
            unreadCount: 0,
            usuarios: {
                [user.user.uid]: {
                    correo: user.user.email,
                    usuario: user.nombre_usuario.trim(),
                },
                [usuarioChatRef.current.uuid_google]: {
                    correo: usuarioChatRef.current.correo,
                    usuario: usuarioChatRef.current.nombre_usuario.trim(),
                },
            },
            mensajes: {
                [Date.now()]: newMessageData,
            },
        };
        await set(ref(db, `chats/${chatId}`), newChatData);
        setid_chat(chatId);
    }

    const anexarMensaje = (id_chat, newMessage) => {
        //Agregar el mensaje al chat existente
        const newMessageKey = Date.now(); // Generate a unique key for the new message
        set(ref(db, `chats/${id_chat}/mensajes/${newMessageKey}`), newMessage);
    }

    const sendMessage = async () => {
        const inputElement = document.querySelector('input[placeholder="Type a message"]');
        const messageContent = inputElement.value.trim();
        const user = getUser(remember);
        if (messageContent && user) {
            const Usuarios = !id_chat ? [
                user.user.uid,
                usuarioChat.uuid_google,
            ] : [];
            const newMessage = {
                sender: user.user.uid,
                content: messageContent,
                time: Date.now(),
                read: false,
                isMe: true,
                type: "text",
            };
            sendDataChat(newMessage, Usuarios)
        }
    };

    return (
        <>
            {usuarioChat ? (
                <div className="flex-1 flex flex-col h-screen bg-gray-900">
                    {/* Chat header */}
                    <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-800 bg-black text-white">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full md:hidden"
                                onClick={() => {
                                    usuarioChatRef.current = null;
                                    setid_chat(null);
                                    setUsuarioChat(null);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            </Button>
                            <Avatar className="h-10 w-10">
                                <img src={usuarioChat.foto_perfil} />
                            </Avatar>
                            <div>
                                <h3 className="font-medium">{usuarioChat.nombre} ({usuarioChat.nombre_usuario}) </h3>
                                <p className="text-xs text-gray-400">{usuarioChat.online ? "Conectado" : "Desconectado"}</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <FaPhone className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <FaVideo className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <FaSearch className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <FaGripVertical className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        id="chat-wrap"
                        ref={chatWrapRef}
                        className="flex-1 p-4 overflow-y-hidden hover:overflow-auto"
                    >
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${message.isMe ? "bg-purple-600 text-white rounded-tr-none" : "bg-gray-800 text-white rounded-tl-none"
                                            }`}
                                    >
                                        <p>{message.content}</p>
                                        <p className="text-xs text-right mt-1 opacity-70">{message.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Message input */}
                    <div className="p-3 border-t border-gray-800 bg-black text-white md:p-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                                reset();
                            }}
                            className="flex items-center gap-2"
                        >
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <FaSmile className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full relative group">
                                    <FaPaperclip className="h-5 w-5" />
                                    <div className="absolute bottom-full left-0 hidden group-hover:flex flex-col gap-2 bg-gray-900 p-2 rounded-lg border border-gray-800 text-white">
                                        <span className="rounded-full p-2 hover:bg-white hover:text-black">
                                            <FaImage className="h-5 w-5 " />
                                        </span>
                                        <span className="rounded-full p-2  hover:bg-white hover:text-black">
                                            <FaCamera className="h-5 w-5" />
                                        </span>
                                        <span className="rounded-full p-2  hover:bg-white hover:text-black">
                                            <FaFile className="h-5 w-5" />
                                        </span>
                                    </div>
                                </Button>
                            </div>
                            <Input
                                {...register("message", { required: true })}
                                placeholder="Type a message"
                                className="h-10 bg-gray-900 border-gray-800 rounded-full w-full"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <FaMicrophone className="h-5 w-5" />
                            </Button>
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full bg-purple-600 hover:bg-purple-700"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className='hidden md:flex bg-gray-900 h-screen justify-center items-center p-4'>
                    <div className='text-white text-center flex gap-5 flex-col'>
                        <h2 className='text-5xl'>👋🏼</h2>
                        <h2 className='text-4xl'> <strong>Bienvenido a Chat Home</strong> </h2>
                        <img src={NoSelectedChat} alt="No selecionado" width={700} height={700} />
                        <h2 className='text-gray-500 text-2xl'>Seleciona un chat para empezar a hablar</h2>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatArea
