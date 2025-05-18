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
import { use } from 'react'
import SideBarSkeleton from '@/components/spinners/side_bar_skeleton'
import NoEncontrado from '@/components/busqueda/no_encontrado'
import { UsuariosOperation } from '@/services/UsuariosController/UsuariosController.service'
import { set } from 'firebase/database'

const SideBar = ({
    isSearching,
    isSearchingRef,
    setIsSearching,
    usersFound,
    setUsersFound,
    loadingUsers,
    setLoadingUsers,
    usuariosObject,
    usuarioChat,
    searchValue,
    setSearchValue,
    BuscarUsuario,
    chatClick
}) => {

    const { remember } = useContext(ConfigContext)
    const usuario = getUser(remember)
    const [foto_de_perfil, setFoto_de_perfil] = useState("")

    const configurar_foto_perfil = () => {
        const foto_response = obtener_foto_perfil(usuario);
        setFoto_de_perfil(foto_response);
    }

    useEffect(() => {
        console.log(isSearching);
        if (!isSearching) {
            setLoadingUsers(false);
            setUsersFound(usuariosObject);
        }
    }, [usuariosObject])


    const set_chat_time = (time) => {
        if (time) {
            const fechaMensaje = new Date(time)
            const fechaHoy = new Date();
            if (validar_dia(fechaMensaje, fechaHoy)) {
                const hora_militar = obtenerHoraMilitar(fechaMensaje)
                return hora_militar;
            }
            else if (esMismaSemana(fechaMensaje, fechaHoy)) {
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
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            setLoadingUsers(true);
                            BuscarUsuario(e.target.search.value);
                            setLoadingUsers(false);
                            setSearchValue(e.target.search.value)
                        }}
                    >
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                onChange={e => {
                                    if (e.target.value === "") {
                                        setLoadingUsers(false);
                                        setUsersFound(usuariosObject);
                                        isSearchingRef.current = false;
                                        setIsSearching(false);
                                    }
                                }}
                                name="search"
                                placeholder="Search or start new chat"
                                className="pl-10 h-10 bg-gray-900 border-gray-800 rounded-lg"
                                autoComplete="off"
                            />
                        </div>
                        <button type="submit" className="hidden"></button>
                    </form>
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
                {!loadingUsers && usersFound.length > 0 ? usersFound.map((chat, index) => (
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
                                <p className="text-sm text-gray-400 truncate">{chat.isMe && chat.ultimo_mensaje && chat.isMe ? "Tú: " + chat.ultimo_mensaje : chat.ultimo_mensaje || ""}</p>
                                {chat.unread > 0 && (
                                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-600 text-xs">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )) : loadingUsers ? <SideBarSkeleton /> : <NoEncontrado />}
            </div>
        </div>
    )
}

export default SideBar
