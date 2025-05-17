import React, { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { FaArrowCircleLeft, FaGithub } from "react-icons/fa";
import { Input } from '@/components/ui/input';
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseContext } from '@/context/firebaseContext';
import * as z from "zod";
import { setUser } from '@/utils/AuthConfig';
import { useNavigate } from "react-router-dom";

const Register = () => {

  const { 
    auth, createUserWithEmailAndPassword,
    signInWithPopup , GoogleAuthProvider, 
  } = useContext(FirebaseContext)

  const navigate = useNavigate();

  // Definir los inputs y validaciones con Zod
  const inputs = [
    {
      label: "Nombre",
      nombre: "nombre",
      type: "text",
      required: true,
      value: "",
      placeholder: "Nombre",
      descripcion: "",
      validation: z
        .string()
        .nonempty("El nombre es obligatorio"),
    },
    {
      label: "Segundo nombre",
      nombre: "segundo_nombre",
      type: "text",
      required: true,
      value: "",
      placeholder: "Segundo nombre",
      descripcion: "",
      validation: z
        .string()
        .nonempty("El email es obligatorio"),
    },
    {
      label: "Correo electrónico",
      nombre: "email",
      type: "text",
      required: true,
      value: "",
      placeholder: "correo@dominio.com",
      descripcion: "",
      validation: z
        .string()
        .email("Introduce un correo válido")
        .nonempty("El email es obligatorio"),
    },
    {
      label: "Contraseña",
      nombre: "password",
      type: "password",
      required: true,
      value: "",
      placeholder: "Contraseña",
      descripcion: "",
      validation: z.string().nonempty("Debe digitar una contraseña"),
    },
  ];

  // Crear el esquema con Zod
  const schema = z.object(
    inputs.reduce((acc, input) => {
      acc[input.nombre] = input.validation;
      return acc;
    }, {})
  );

  // Usar useForm con resolver de Zod
  const form = useForm({
    defaultValues: inputs.reduce((acc, input) => {
      acc[input.nombre] = input.value;
      return acc;
    }, {}),
    resolver: zodResolver(schema),
  });

  const { handleSubmit, control, formState: { errors } } = form;

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      // Usuario creado
      const user = userCredential;
      user.user.displayName = data.nombre + data.segundo_nombre,
      await setUser(user,false);
    } 
    catch (error) {
      if(error.toString() === "FirebaseError: Firebase: Error (auth/email-already-in-use)."){
        alert("El correo ya esta en uso")
      }
      console.error(error)
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-purple-400 via-purple-600 to-black">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold">Chat Home</h1>
            </div>
            <h2 className="mb-6 text-4xl font-bold">Get Started with Us</h2>
            <p className="mb-12 text-lg">Complete these easy steps to register your account.</p>

            <div className="w-full max-w-sm space-y-4">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">1</span>
                  <span className="text-lg">Sign up your account</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    2
                  </span>
                  <span className="text-lg">Set up your workspace</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    3
                  </span>
                  <span className="text-lg">Set up your profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center bg-black p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-[40px] p-12">
          <div className="mx-auto max-w-sm">
            <div className='flex gap-2 justify-between'> 
              <h2 className="mb-2 text-3xl font-bold text-white">Registrarme</h2> 
              <button
                onClick={()=>{navigate("/")}}
              ><FaArrowCircleLeft className='text-white text-4xl' /></button>
            </div>
            <p className="mb-8 text-gray-400">Ingresa estos datos para poder crear una cuenta.</p>
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
            </div>

            <Form {...form}>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {inputs.map((input, index) => (
                  <FormField
                    key={index}
                    control={control}
                    name={input.nombre}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type={input.type}
                            aria-invalid={errors[input.nombre] ? "true" : "false"}
                            placeholder={input.placeholder}
                          />
                        </FormControl>
                        <FormDescription>
                          {input.descripcion}
                        </FormDescription>
                        {errors[input.nombre] && (
                          <FormMessage>{errors[input.nombre]?.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                ))}

                <Button type="submit" className=" text-white w-full h-12"><strong>Registrarse</strong></Button>
              </form>
            </Form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
