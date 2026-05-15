'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTask(formData: FormData) {
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

    let imageUrl = null

    if (image && image.size > 0) {
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
    }

    const now = new Date().toISOString()
    const { error: insertError } = await supabase.from('tasks').insert({
        title,
        description,
        status,
        priority,
        image: imageUrl,
        user_id: user.id,
        created_at: now,
        updated_at: now
    })

    if (insertError) {
        console.error('Error inserting task:', insertError)
        throw new Error('Error al crear la tarea')
    }

    revalidatePath('/dashboard')
    return { success: true }
}