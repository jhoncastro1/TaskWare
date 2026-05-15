'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteTask(taskId: string, imageUrl: string | null) {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('No estás autenticado')
    }

    if (imageUrl) {
        const parts = imageUrl.split('/task-images/')
        const pathToDelete = parts.length > 1 ? parts[1] : null

        if (pathToDelete) {
            const { error: storageError } = await supabase.storage
                .from('task-images')
                .remove([pathToDelete])

            if (storageError) {
                console.error('Error deleting image from storage:', storageError)
            }
        }
    }

    const { error: deleteError } = await supabase.from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id)

    if (deleteError) {
        console.error('Error deleting task:', deleteError)
        throw new Error('Error al eliminar la tarea')
    }

    revalidatePath('/dashboard')
    return { success: true }
}