'use client'
import { AvatarBadge } from "@/components/AvatarBadge";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/utils";
import { LayoutGridIcon, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { TaskFilters } from "./components/TaskFilters";
import { TaskCard } from "./components/TaskCard";
import { TaskForm } from "./components/TaskForm";
import { Task } from "@/interfaces/task";
import { getTasks } from "@/actions/tasks/get-task";
import { deleteTask } from "@/actions/tasks/delete-task";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const { user } = useAuth();

    // States
    const [tasks, setTasks] = useState<Task[]>([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [priority, setPriority] = useState("all");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Infinite scroll observer
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadTasks = async (isLoadMore = false) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const result = await getTasks({
                search,
                status,
                priority,
                page: isLoadMore ? page : 1,
                limit: 10
            });

            if (isLoadMore) {
                setTasks(prev => [...prev, ...result.tasks]);
            } else {
                setTasks(result.tasks);
                setPage(1);
            }
            setHasMore(result.hasMore);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar las tareas");
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load and filter changes
    useEffect(() => {
        loadTasks(false);
    }, [search, status, priority]);

    // Load more when page changes
    useEffect(() => {
        if (page > 1) {
            loadTasks(true);
        }
    }, [page]);

    // Infinite scroll intersection observer setup
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if (target.isIntersecting && hasMore && !isLoading) {
            setPage(prev => prev + 1);
        }
    }, [hasMore, isLoading]);

    useEffect(() => {
        const element = observerTarget.current;
        const option = { threshold: 0 };
        const observer = new IntersectionObserver(handleObserver, option);
        if (element) observer.observe(element);
        return () => {
            if (element) observer.unobserve(element);
        };
    }, [handleObserver]);

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsFormOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsFormOpen(true);
    };

    const handleDeleteTask = async (task: Task) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            try {
                await deleteTask(task.id, task.image);
                toast.success("Tarea eliminada correctamente");
                // Reset and reload
                loadTasks(false);
            } catch (error) {
                console.error(error);
                toast.error("Error al eliminar la tarea");
            }
        }
    };

    const handleFormSuccess = () => {
        toast.success(selectedTask ? "Tarea actualizada correctamente" : "Tarea creada correctamente");
        loadTasks(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="flex justify-between items-center px-4 md:px-8 lg:px-12 py-4 border-b border-border bg-card">
                <div className="flex items-center gap-2 font-extrabold text-xl text-foreground">
                    <LayoutGridIcon className="text-primary" />
                    TaskWare
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={handleCreateTask} className="hidden md:flex gap-2 shadow-sm hover:shadow transition-all">
                        <Plus size={18} />
                        Nueva Tarea
                    </Button>
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

            <main className="px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <h1 className="text-2xl font-bold text-foreground">Mis Tareas</h1>
                    <Button size="sm" onClick={handleCreateTask} className="gap-1">
                        <Plus size={16} />
                        Crear
                    </Button>
                </div>

                <TaskFilters
                    currentFilters={{ search, status, priority }}
                    onSearchChange={setSearch}
                    onStatusChange={setStatus}
                    onPriorityChange={setPriority}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task as any}
                            onEdit={() => handleEditTask(task as any)}
                            onDelete={() => handleDeleteTask(task as any)}
                        />
                    ))}
                </div>

                {/* Loading state and Infinite Scroll trigger */}
                <div ref={observerTarget} className="py-10 flex justify-center w-full">
                    {isLoading && (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <p className="text-sm font-medium">Cargando tareas...</p>
                        </div>
                    )}
                    {!isLoading && !hasMore && tasks.length > 0 && (
                        <p className="text-sm text-muted-foreground font-medium bg-muted px-4 py-2 rounded-full">
                            No hay más tareas para mostrar
                        </p>
                    )}
                    {!isLoading && tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center col-span-full w-full opacity-70">
                            <div className="bg-muted p-6 rounded-full mb-4">
                                <LayoutGridIcon size={48} className="text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron tareas</h3>
                            <p className="text-muted-foreground max-w-md">
                                Intenta cambiar los filtros de búsqueda o crea una nueva tarea para comenzar.
                            </p>
                            <Button variant="outline" className="mt-6" onClick={handleCreateTask}>
                                <Plus size={16} className="mr-2" />
                                Crear mi primera tarea
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <TaskForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                task={selectedTask as any}
                onSuccess={handleFormSuccess}
            />
        </div>
    )
}
