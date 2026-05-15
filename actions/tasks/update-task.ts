'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateTask(taskId: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('No estás autenticado')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string
    const priority = formData.get('priority') as string
    const image = formData.get('image') as File | null
    const existingImage = formData.get('existingImage') as string | null
    const removeImage = formData.get('removeImage') === 'true'

    let imageUrl = existingImage

    // Helper to extract path from public URL
    const getStoragePathFromUrl = (url: string) => {
        const parts = url.split('/task-images/')
        return parts.length > 1 ? parts[1] : null
    }

    if (removeImage && existingImage) {
        const pathToDelete = getStoragePathFromUrl(existingImage)
        if (pathToDelete) {
            await supabase.storage.from('task-images').remove([pathToDelete])
        }
        imageUrl = null
    }

    if (image && image.size > 0) {
        // Upload new image
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('task-images')
            .upload(filePath, image)

        if (uploadError) {
            console.error('Error uploading image:', uploadError)
            throw new Error('Error al subir la imagen')
        }

        const { data: { publicUrl } } = supabase.storage
            .from('task-images')
            .getPublicUrl(filePath)
            
        imageUrl = publicUrl

        // Delete old image if it existed and we are replacing it
        if (existingImage && !removeImage) {
            const pathToDelete = getStoragePathFromUrl(existingImage)
            if (pathToDelete) {
                await supabase.storage.from('task-images').remove([pathToDelete])
            }
        }
    }

    const { error: updateError } = await supabase.from('tasks').update({
        title,
        description,
        status,
        priority,
        image: imageUrl,
        updated_at: new Date().toISOString()
    }).eq('id', taskId).eq('user_id', user.id)

    if (updateError) {
        console.error('Error updating task:', updateError)
        throw new Error('Error al actualizar la tarea')
    }

    revalidatePath('/dashboard')
    return { success: true }
}