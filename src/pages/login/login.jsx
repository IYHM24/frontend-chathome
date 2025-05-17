import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import * as z from "zod";
import { useContext } from "react";
import { FirebaseContext } from "@/context/firebaseContext";
import { setUser } from "@/utils/AuthConfig";
import { ConfigToken } from "@/services/instance";

const Login = () => {

  const {
    auth, signInWithEmailAndPassword,
    signInWithPopup , GoogleAuthProvider,
  } = useContext(FirebaseContext)

  // Definir los inputs y validaciones con Zod
  const inputs = [
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

  const click_google = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider)
      const user = result;
      await setUser(user, false)
    } catch (error) {
      console.error(error.toString());
    }
  }

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      // Usuario ingresado
      const user = userCredential;
      await setUser(user, false);
    }
    catch (error) {
      if (error.toString().includes("FirebaseError: Firebase: Error (auth/invalid-credential)")) {
        alert("Credenciales erroneas")
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
            <h2 className="mb-6 text-4xl font-bold">Welcome Back</h2>
            <p className="mb-12 text-lg">Log in to your account to continue your journey.</p>

            <div className="w-full max-w-sm space-y-4">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">1</span>
                  <span className="text-lg">Log in to your account</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">2</span>
                  <span className="text-lg">Access your workspace</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">3</span>
                  <span className="text-lg">Continue your projects</span>
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
            <h2 className="mb-2 text-3xl font-bold text-white">Log In</h2>
            <p className="mb-8 text-gray-400">Enter your credentials to access your account.</p>

            <div className="mb-8 grid gap-4">
              <Button variant="outline" className="h-12" onClick={ click_google }>
                <FcGoogle />
                Google
              </Button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-black px-2 text-gray-400">Or</span>
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
                <div className="flex gap-2 justify-center flex-col w-50 mx-auto">
                  <p className="text-white text-center">¿No tienes cuenta? </p><Link className="text-white text-center" to={"/registro"} > <h6>Registro</h6>  </Link>
                </div>
                <Button type="submit" className=" text-white w-full h-12"><strong>Login</strong></Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
