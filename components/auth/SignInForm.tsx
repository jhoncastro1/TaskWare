"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { AuthFormProps } from "./AuthForm";


const SignInForm = ({ setTypeSelected }: AuthFormProps) => {

    const [isLoading, setisLoading] = useState<boolean>(false)

    // ============ Form ============
    const formSchema = z.object({
        email: z.email('Por favor ingresa un correo válido. Ejemplo: user@mail.com').min(1, {
            message: 'Este campo es requerido'
        }),
        password: z.string().min(6, {
            message: 'La contraseña debe tener al menos 6 caracteres'
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const { handleSubmit, control } = form;

    // ============ Sign In ===========
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setisLoading(true);

        try {

            console.log(data);

        } catch (e) {
            const error = e as Error;
            toast.error(error.message, { duration: 2500 });
        } finally {
            setisLoading(false);
        }
    }

    const githubSignIn = async () => {

    }

    const googleSignIn = async () => {

    }

    return (
        <div>
            <div className="w-full backdrop-blur-xl py-2 rounded-4xl">
                <div className="text-center">
                    <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-center my-4">Iniciar Sesión</h1>
                    <p className="text-sm text-muted-foreground mb-8">
                        Ingresa para acceder a todo el contenido
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="mx-4">
                        <div className="grid gap-2">
                            {/* ========== Email ========= */}
                            <FormField
                                control={control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="mb-3">
                                        <FormLabel>Correo</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="email"
                                                placeholder="name@example.com"
                                                type="email"
                                                autoComplete="email"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ========== Password ========= */}
                            <FormField
                                control={control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="mb-3">
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="password"
                                                placeholder="*****"
                                                type="password"
                                                autoComplete="current-password"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div
                                onClick={() => setTypeSelected('recover-password')}
                                className="underline text-blue-500 underline-offset-4 hover:text-blue-800 mb-6 text-sm text-end cursor-pointer"
                            >
                                ¿Olvidaste tu contraseña?
                            </div>

                            {/* ========== Submit ========= */}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Ingresar
                            </Button>

                        </div>
                    </form>
                </Form>

                {/* ========== Sign Up ========= */}
                <p className="text-center text-sm text-black mt-4">
                    {"¿No tienes cuenta?  "}
                    <span
                        onClick={() => setTypeSelected('sign-up')}
                        className="underline text-blue-500 underline-offset-4 hover:text-blue-800 cursor-pointer"
                    >
                        Regístrate
                    </span>
                </p>
            </div>
        </div>
    );
}

export default SignInForm;