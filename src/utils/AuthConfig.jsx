import { ConfigToken } from "@/services/instance";
import { CreateOrUpdateUser, UsuariosOperation } from "@/services/UsuariosController/UsuariosController.service";
import Swal from "sweetalert2";
import no_account_img from "@/assets/user/no_profile_photo.png"

const validarSiExiste = async (uuid) => {
    try {
        const response = await UsuariosOperation({
            uuid_google:uuid,
            proceso: "obtener usuario",
        })
        return response.data.msj;
    } catch (error) {
        console.error(error)
    }
}

const pedirNombreUsuario = async () => {
    const { value: nombreUsuario } = await Swal.fire({
      title: 'Ingresa tu nombre de usuario',
      input: 'text',
      inputPlaceholder: 'Escribe tu nombre...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      confirmButtonText: 'Enviar',
      background: 'black',   
      customClass: {
        input: "!h-12 !border-gray-800 !bg-gray-900 !text-white placeholder:!text-gray-400 p-2",
        confirmButton: "!text-white !h-12 !bg-gray-800 !font-bold",  
        title:"!text-white"  
      },
      preConfirm: async (valor) => { 
        if (!valor) {
          Swal.showValidationMessage('Debes ingresar un nombre');
        } else {
            const usuariosExistentes = await UsuariosOperation({
                nombre_usuario : valor.trim(),
                proceso:"validar usuario"
            })
            if (usuariosExistentes.data.msj[0].numero_usuarios > 0) {
                Swal.showValidationMessage('Este nombre de usuario ya existe');
            }
        }
      }
    });
    return nombreUsuario.trim();
}

export const obtener_foto_perfil = (usuario) => {
    return usuario != null && usuario.user.photoURL ||  no_account_img;
}

export const setUser = async (user, remember) => {
    
    let username = "";
    //obtener foto de perfil
    const foto_de_perfil = obtener_foto_perfil(user);
    //1. Actualizar token
    await ConfigToken(user.user.stsTokenManager.accessToken);
    //2. Validar que el usuario exista en sistema 
    const response = await validarSiExiste(user.user.uid) || [];
    if(response.length == 0){
        //Solicitar el nombre de usuario
        username = await pedirNombreUsuario();
    }
    else {
        username = response[0].nombre_usuario.trim();
    }
    //3. Guardar usuario en la BD 
    await CreateOrUpdateUser({
        id:0,
        nombre: user.user.displayName.trim(),
        apellido: "",
        nombre_usuario: username.trim(),
        online: false,
        token_google: user.user.stsTokenManager.accessToken,
        uuid_google:user.user.uid.trim(),
        correo: user.user.email.trim(),
        foto_perfil: foto_de_perfil,
        sesion: "",
        fecha_ultima_conexion: new Date().toISOString()
    })

    const userName = { ...user, nombre_usuario: username.trim() }

    //4.Actualizar sesion/local storage
    remember ?
        localStorage.setItem("user", JSON.stringify(userName))
        :
        sessionStorage.setItem("user", JSON.stringify(userName));
    window.location.reload();
}

export const getUser = (remember) => (
    remember ?
        JSON.parse(localStorage.getItem("user"))
        :
        JSON.parse(sessionStorage.getItem("user"))
)

export const Salir = (remember, navigate) => {
    remember ?
    localStorage.clear()
    :
    sessionStorage.clear()
    window.document.location.reload();
}

