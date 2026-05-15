'use client'
import { AvatarBadge } from "@/components/AvatarBadge";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/utils";
import { LayoutGridIcon } from "lucide-react";
import Link from "next/link";


export default function DashboardPage() {

    const { user } = useAuth();

    return (
        <>
            <nav className="flex justify-between items-center px-4 md:px-8 lg:px-12 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2 font-extrabold">
                    <LayoutGridIcon />
                    Gestor de tareas
                </div>

                <div className="flex items-center gap-2">
                    {user && (
                        <Link href="/profile">
                            <AvatarBadge
                                name={user?.name}
                                avatar_url={getImageUrl(user?.avatar_url!)}
                            />
                        </Link>
                    )}
                </div>
            </nav>
        </>
    )
}
