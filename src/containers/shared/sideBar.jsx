import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfigContext } from '@/context/configContext'
import { getUser, obtener_foto_perfil, Salir } from '@/utils/AuthConfig'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { FaSearch, FaSignInAlt } from 'react-icons/fa'
import { 
    validar_dia, 
    obtenerHoraMilitar,
    esMismaSemana,
    formatearFecha
} from '@/utils/timeOperations'

const SideBar = ({ usuariosObject, usuarioChat, chatClick }) => {

    const { remember } = useContext(ConfigContext)
    const usuario = getUser(remember)
    const [foto_de_perfil, setFoto_de_perfil] = useState("")

    const configurar_foto_perfil = () => {
        const foto_response = obtener_foto_perfil(usuario);
        setFoto_de_perfil(foto_response);
    }

    const set_chat_time = (time) => {
        if (time) {
            const fechaMensaje = new Date(time)
            const fechaHoy = new Date();
            if(validar_dia(fechaMensaje, fechaHoy))
            {
                const hora_militar = obtenerHoraMilitar(fechaMensaje)
                return hora_militar;
            }
            else if(esMismaSemana(fechaMensaje, fechaHoy)){
                const dia_de_la_semana = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(fechaMensaje);
                return dia_de_la_semana;
            } else {
                const fecha_formateada = formatearFecha(fechaMensaje)
                return fecha_formateada;
            }
            

        }
        return ""
    }


    useEffect(() => {
        configurar_foto_perfil();
    }, [])

    useEffect(() => {
        if(usuariosObject.length > 0) {
            
            console.log("usuariosObject", usuariosObject);
        }
    }, [usuariosObject])
    

    const chats = [
        {
            id: 1,
            name: "Sarah Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Hey, how are you doing?",
            time: "10:42 AM",
            unread: 2,
            online: true,
        },
        {
            id: 2,
            name: "Design Team",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Meeting at 3pm today",
            time: "9:30 AM",
            unread: 0,
            online: false,
        },
        {
            id: 3,
            name: "Michael Rodriguez",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "I've sent you the files",
            time: "Yesterday",
            unread: 0,
            online: true,
        },
        {
            id: 4,
            name: "Emma Wilson",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Let's catch up soon!",
            time: "Yesterday",
            unread: 5,
            online: false,
        },
        {
            id: 5,
            name: "Project Flowers",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "New update on the project",
            time: "Monday",
            unread: 0,
            online: false,
        },
        {
            id: 6,
            name: "David Chen",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Thanks for your help!",
            time: "Monday",
            unread: 0,
            online: true,
        },
        {
            id: 7,
            name: "Marketing Team",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Campaign results are in",
            time: "Sunday",
            unread: 0,
            online: false,
        },
    ]

    const pasarDatosChat = (chat) => {
      chatClick(chat)
    }
    

    return (
        <div className="w-full max-w-sm border-r border-gray-800 bg-black !h-screen">
            {/* User profile and actions */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-purple-500">
                        <img
                            src={foto_de_perfil}
                            width={40}
                            height={40}
                            alt="Your profile"
                        />
                    </Avatar>
                </div>
                {/* Search */}
                <div>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search or start new chat"
                            className="pl-10 h-10 bg-gray-900 border-gray-800 rounded-lg"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex justify-center items-center rounded-full text-white"
                        onClick={() => { Salir(remember) }}
                    >
                        <FaSignInAlt className="h-5 w-5 " /> {/* MoreVertical */}
                    </Button>
                </div>
            </div>

            {/* Chat list */}
            <div className="overflow-y-auto h-[calc(100vh-132px)]">
                {usuariosObject.map((chat, index) => (
                    <div
                        onClick={() => { pasarDatosChat(chat) }}
                        key={"chat-item-" + index}
                        className={`flex items-center gap-3 p-3 hover:bg-gray-900 cursor-pointer ${usuarioChat && chat.id === usuarioChat.id ? "bg-gray-900" : ""}`}
                    >
                        <div className="relative">
                            <Avatar className="h-12 w-12">
                                <img src={chat.foto_perfil || ""} alt={chat.name} />
                            </Avatar>
                            {chat.online && (
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-black"></span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-medium truncate">{chat.nombre_usuario}</h3>
                                <span className="text-xs text-gray-400">{set_chat_time(chat.time) || ""}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-400 truncate">{chat.isMe && chat.ultimo_mensaje && chat.isMe? "Tú: "+chat.ultimo_mensaje : chat.ultimo_mensaje || ""}</p>
                                {chat.unread > 0 && (
                                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-600 text-xs">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar
