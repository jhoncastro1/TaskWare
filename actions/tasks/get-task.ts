'use server'

import { createClient } from "@/lib/supabase/server"
import { Task } from "@/interfaces/task"

export async function getTasks({ 
    search = '', 
    status = 'all', 
    priority = 'all', 
    page = 1, 
    limit = 10 
}) {
    const supabase = await createClient()

    let query = supabase.from('tasks').select('*', { count: 'exact' })

    if (status && status !== 'all') {
        query = query.eq('status', status)
    }

    if (priority && priority !== 'all') {
        query = query.eq('priority', priority)
    }

    if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching tasks:', error)
        throw new Error('No se pudieron obtener las tareas')
    }

    return {
        tasks: data as Task[],
        count,
        hasMore: count !== null ? from + limit < count : false
    }
}