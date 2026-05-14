import React from 'react'

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <form action="api/auth/signout" method="post">
                <button className="button block" type="submit">
                    Cerrar Sesión
                </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Content will go here */}
                <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Bienvenido</h2>
                    <p className="text-muted-foreground">Tu panel de control está listo.</p>
                </div>
            </div>
        </div>
    )
}
