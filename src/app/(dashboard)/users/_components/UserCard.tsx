"use client"

import { Calendar, Mail, ShieldCheck, Crown, EditIcon, User2 } from "lucide-react";
import UserFunctions from "@/components/users/UserFunctions";
import { Card, CardContent } from "@/components/ui/card";
import { TypeGetAllUsersData } from "@/lib/types";
import { UserRoles } from "@/lib/users/userRole";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Image } from "@imagekit/next";
import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  user: TypeGetAllUsersData[number]
  viewMode: "grid" | "list"
}

const UserCard = ({ user, viewMode }: Props) => {
  const formattedDate = formatDate(user.createdAt, "dd MMM yyyy")

  const getRoleIcon = (role: string) => {
    switch (role) {
      case UserRoles.ADMIN:
        return <Crown className="h-3 w-3" />
      case UserRoles.MODERATOR:
        return <ShieldCheck className="h-3 w-3" />
      case UserRoles.EDITOR:
        return <EditIcon className="h-3 w-3" />
      default:
        return <User2 className="h-3 w-3" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case UserRoles.ADMIN:
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      case UserRoles.MODERATOR:
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      case UserRoles.EDITOR:
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white">
                <Image
                  width={144}
                  height={144}
                  alt={user?.firstName.charAt(0) || "U"}
                  src={user?.imageUrl || "/defaultProfilePic.svg"}
                  className="aspect-square size-full object-cover"
                />
              </Avatar>

              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {user.fullname}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn("rounded-full text-xs pb-[3px] flex sm:hidden", getRoleColor(user.role))}
                  >
                    {getRoleIcon(user.role)}
                    {user.role}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">@{user.username}</p>
                <p className="text-sm text-muted-foreground flex lg:hidden">{user.email}</p>
              </div>
            </div>

            <div className="hidden lg:flex text-sm text-muted-foreground">{user.email}</div>

            <div className="hidden lg:flex text-sm text-muted-foreground">Joined: {formattedDate}</div>

            <Badge
              variant="outline"
              className={cn("rounded-full text-xs pb-[3px] hidden sm:flex", getRoleColor(user.role))}
            >
              {getRoleIcon(user.role)}
              {user.role}
            </Badge>

            <UserFunctions username={user.username} userId={user.id} />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 !p-0">
      <CardContent className="!p-6">
        <div className="relative flex flex-col items-center text-center space-y-4">
          {/* Actions */}
          <div className="absolute top-0 right-0">
            <UserFunctions username={user.username} userId={user.id} />
          </div>

          {/* Avatar */}
          <Avatar className="h-12 w-12 border-2 border-white">
            <Image
              width={144}
              height={144}
              alt={user?.firstName.charAt(0) || "U"}
              src={user?.imageUrl || "/defaultProfilePic.svg"}
              className="aspect-square size-full object-cover"
            />
          </Avatar>

          {/* User Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {user.fullname}
            </h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>

            <Badge variant="outline" className={cn("rounded-full text-xs", getRoleColor(user.role))}>
              {getRoleIcon(user.role)}
              {user.role}
            </Badge>
          </div>

          {/* Meta Info */}
          <div className="space-y-2 text-sm text-muted-foreground w-full">
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-3 w-3" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Joined {formattedDate}</span>
            </div>
          </div>

          {/* Status */}
          {/* <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
            {user.isActive ? "Active" : "Inactive"}
          </Badge> */}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserCard
