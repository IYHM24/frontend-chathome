import React from 'react'
import SideBar from '../shared/sideBar'
import ChatArea from '../shared/chatArea'

import { useEffect } from 'react'
import { ConfigToken } from '@/services/instance'
import { getUser } from '@/utils/AuthConfig'
import { useContext } from 'react'
import { ConfigContext } from '@/context/configContext'
import { connectToHub } from '@/services/UsuariosHub/UsuariosHub.service'
import { UsuariosOperation } from '@/services/UsuariosController/UsuariosController.service'
import { useState } from 'react'
import { useRef } from 'react'
import { ref, onValue, get, set } from "firebase/database";
import { FirebaseContext } from '@/context/firebaseContext'
import { MensajesOperations } from '@/services/MensajesController/MensajesController.service'

const Chatlayout = () => {

  const { db } = useContext(FirebaseContext)
  const { remember } = useContext(ConfigContext)
  const [usuariosObject, setUsuariosObject] = useState([])
  const [usuarioChat, setUsuarioChat] = useState()
  const [chatsDelUsuario, setChatsDelUsuario] = useState([]);
  const [id_chat, setid_chat] = useState(0) //Colocar en null luego;
  const hubConnectionRef = useRef(null);
  const usuarioChatRef = useRef();


  const establecer_usuarios = (usuariosBDPrevio, user) => {
    const usuariosBD = usuariosBDPrevio && usuariosBDPrevio.map(
      chat => {
        return {
          ...chat,
          isMe: user.user.uid === chat.ui_usuario_remitente,
        }
      }
    ) || [];
    const establecedor_usuarios = usuariosBD || [];
    setUsuariosObject(establecedor_usuarios)
  }

  //Al desconectar un usuario
  const usuarioConectado = (user) => {
    fetchUsuarios();
  }

  //Al conectar un usuario
  const usuarioDesconectado = (user) => {
    fetchUsuarios();
  }

  const fetchUsuarios = async () => {
    try {
      const user = getUser();
      if (user != null) {
        const usuariosBDPrevio = await UsuariosOperation({
          proceso: "obtener chat usuario",
          uuid_google: user.user.uid,
        })
        establecer_usuarios(usuariosBDPrevio.data?.msj, user)
        debugger
        if(usuarioChatRef.current){
          console.log("usuarioChat", usuarioChatRef.current);
          const usuarioSelecionado = usuariosBDPrevio.data?.msj.find(
            chat => chat.uuid_google === usuarioChatRef.current.uuid_google
          )
          setUsuarioChat(usuarioSelecionado)
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    //Configuracion del token backend y conexion HUB
    const user = getUser(remember);
    //Configuraciones
    if (user != null) {
      //Configuraciones - Token
      ConfigToken(user.user.stsTokenManager.accessToken);
      //Configuraciones - Conexion websocket
      if (!hubConnectionRef.current) {
        hubConnectionRef.current = connectToHub(
          user.user.stsTokenManager.accessToken,
          usuarioConectado,
          usuarioDesconectado,
          fetchUsuarios,
        );
      }
    }
    //Obtener usuarios
    fetchUsuarios();
  }, [])

  const chatClick = (chat) => {
    setUsuarioChat(chat);
    usuarioChatRef.current = chat;
    setid_chat(chat.chat_id)
  }
  

  return (
    <div className='flex'>
      <div className='w-1/4'>
        <SideBar
          usuariosObject={usuariosObject}
          chatClick={chatClick}
          usuarioChat={usuarioChat}
        />
      </div>
      <div className='w-full'>
        <ChatArea
          id_chat={id_chat}
          usuarioChat={usuarioChat}
        />
      </div>
      {/*  <Outlet /> */}
    </div>
  )
}

export default Chatlayout


