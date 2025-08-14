import Dashboard from "./_components/Dashboard"
import { getRole } from "@/lib/users/getRole"
import { UserRoles } from "@/lib/users/userRole"
import { Role } from "@prisma/client"

export default async function DashboardPage() {
    const role = await getRole() as Role

    return (
        <div className="w-screen md:w-[calc(100vw-280px)] p-6 space-y-6">
            <Dashboard role={role} />
        </div>
    )
}
