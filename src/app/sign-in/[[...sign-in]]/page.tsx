import { SignIn } from '@clerk/nextjs';

export default function Page() {
    return <div className="min-h-screen min-w-screen flex items-center justify-center m-auto">
        <SignIn />
    </div>
}