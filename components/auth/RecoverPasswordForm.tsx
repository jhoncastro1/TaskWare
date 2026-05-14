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
import { LoaderCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { AuthFormProps } from "./AuthForm";


const RecoverPasswordForm = ({ setTypeSelected }: AuthFormProps) => {

    const [isLoading, setisLoading] = useState<boolean>(false)

    // ============ Form ============
    const formSchema = z.object({
        email: z.email('Por favor ingresa un correo válido. Ejemplo: user@mail.com').min(1, {
            message: 'Este campo es requerido'
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    })

    const { handleSubmit, control } = form;


    // ============ Password Recovery ===========
    const onSubmit = async (user: z.infer<typeof formSchema>) => {
        setisLoading(true);

        try {

            console.log(user);


        } catch (e) {
            const error = e as Error;
            toast.error(error.message, { duration: 2500 });
        } finally {
            setisLoading(false);
        }
    }

    return (
        <div>
            <div className="flex justify-start mb-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setTypeSelected('sign-in')}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>
            <div className="w-full backdrop-blur-xl py-6 rounded-4xl">
                <div className="rounded-xl w-full">
                    <div className="text-center">
                        <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-center my-4">
                            Recuperar Contraseña
                        </h1>
                        <p className="text-sm text-muted-foreground mb-8">
                            Te enviaremos un correo para recuperar tu contraseña
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
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

                                {/* ========== Submit ========= */}
                                <Button className="my-6 cursor-pointer" type="submit" disabled={isLoading}>
                                    {isLoading && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Recuperar
                                </Button>
                            </div>
                        </form>
                    </Form>

                    {/* ========== Volver ========= */}
                    <p className="text-center text-sm mt-3">
                        <span
                            onClick={() => setTypeSelected('sign-in')}
                            className="underline underline-offset-4 hover:text-primary cursor-pointer"
                        >{"Volver"}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RecoverPasswordForm;