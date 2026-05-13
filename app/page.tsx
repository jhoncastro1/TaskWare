import AuthForm from "@/components/auth/AuthForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full bg-black py-4">
      <AuthForm type="sign-in" />
    </div>
  );
}
