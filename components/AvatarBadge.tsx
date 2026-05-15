import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from './ui/badge';


interface AvatarBadgeProps {
    name: string | null;
    avatar_url?: string | null;
}

export const AvatarBadge = ({ name, avatar_url }: AvatarBadgeProps) => {

    const getInitials = (name: string | null) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (

        <Badge className='gap-2'>
            <Avatar>
                {(() => {
                    let safeUrl = avatar_url;
                    if (safeUrl && safeUrl.startsWith('{')) {
                        try {
                            safeUrl = JSON.parse(safeUrl).publicUrl || safeUrl;
                        } catch (e) {}
                    }
                    return <AvatarImage src={safeUrl || ''} />
                })()}
                <AvatarFallback className='text-neutral-500'>{getInitials(name)}</AvatarFallback>
            </Avatar>
            {name}
        </Badge>

    )
}
