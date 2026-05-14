"use client"

import RecoverPasswordForm from "./RecoverPasswordForm";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

export interface AuthFormProps {
    setTypeSelected: Dispatch<SetStateAction<"sign-up" | "sign-in" | "recover-password">>;
}

interface AuthModalProps {
    type: 'sign-up' | 'sign-in' | 'recover-password'
}

const AuthForm = ({ type }: AuthModalProps) => {

    const [typeSelected, setTypeSelected] = useState<'sign-up' | 'sign-in' | 'recover-password'>(type);

    return (
        <div className="mx-auto w-[95%] sm:w-full bg-background max-w-md sm:max-w-lg border border-border/50 sm:border-white/50 mt-8 sm:mt-10 p-6 sm:p-8 shadow-xl" style={{ borderRadius: 20 }}>
            {typeSelected === 'sign-in' && (<SignInForm setTypeSelected={setTypeSelected} />)}
            {typeSelected === 'sign-up' && (<SignUpForm setTypeSelected={setTypeSelected} />)}
            {typeSelected === 'recover-password' && (<RecoverPasswordForm setTypeSelected={setTypeSelected} />)}
        </div>
    );
}

export default AuthForm;