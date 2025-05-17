import { axionsInstanceBearer } from "../instance";

export const CreateOrUpdateUser = async (body) => {
  try {
    const response = await axionsInstanceBearer.post("/usuarios", body)
    return response
  } catch (error) {
    console.error(error)
  }
}

export const UsuariosOperation = async (body) => {
    try {
      const response = await axionsInstanceBearer.post("/usuarios/operaciones", body)
      return response
    } catch (error) {
      console.error(error)
    }
}

