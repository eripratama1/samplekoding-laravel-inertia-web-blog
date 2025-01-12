import { Notifications, User } from '@/types'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface NotifComponentProps {
    notifications?: Notifications[]
    user: User
}
export default function NotifComponent({ notifications = [], user }: NotifComponentProps) {
    console.log("Cek props notif", notifications);

    const { get, post } = useForm()
    const isAdmin = user.roles?.some(role => role.name === 'Admin');
    const isAuthor = user.roles?.some(role => role.name === 'Author');

    const handleMarkAsRead = (notifId: string) => {
        post(route('markAsRead', notifId))
    }

    const handleManageRoleRequest = () => {
        get(route('listUsers'))
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    className='rounded-full'
                >
                    <div className='relative'>
                        <Bell className='size-4.5' />
                        {notifications?.length > 0 && (
                            <span className='absolute top-0 right-0.7 inline-flex items-center justify-center
                        size-3.5 rounded-full bg-red-500 text-white text-xs'>
                                {notifications.length}
                            </span>
                        )}
                        <span className='sr-only'>Notifications</span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <React.Fragment key={notif.id}>
                            <DropdownMenuItem className='my-1'>
                                <div className='flex flex-col'>
                                    {notif.type === 'App\\Notifications\\RoleRequestNotify' && (
                                        <React.Fragment>
                                            <span>Role Request Notifications</span>
                                            <span>{notif.data.message}</span>
                                            <div className='mt-2 flex gap-2'>
                                                <Button
                                                    variant={"outline"}
                                                    size={"sm"}
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                >
                                                    Mark As Read
                                                </Button>

                                                {isAdmin && (
                                                    <Button
                                                        size={"sm"}
                                                        onClick={() => handleManageRoleRequest()}
                                                    >
                                                        Go to manage users
                                                    </Button>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    )}

                                    {notif.type === 'App\\Notifications\\CommentNotification' && (
                                        <React.Fragment>
                                            <span>Notifications</span>
                                            <span>{notif.data.message}</span>
                                            <div className='mt-2 flex gap-2'>
                                                <Button
                                                    variant={"outline"}
                                                    size={"sm"}
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                >
                                                    Mark As Read
                                                </Button>

                                                {(isAdmin || isAuthor) && (
                                                    <Button
                                                        size={"sm"}
                                                        onClick={() => get(route("article.show", notif.data.article_title.slug))}
                                                    >
                                                        Go to show article
                                                    </Button>
                                                )}

                                                {user.roles.length < 1 && (
                                                    <Button
                                                        size={"sm"}
                                                        onClick={() => get(route("read", notif.data.article_title.slug))}
                                                    >
                                                        Show article
                                                    </Button>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        </React.Fragment>
                    ))
                ) : (
                    <DropdownMenuItem>
                        No New Notification
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
