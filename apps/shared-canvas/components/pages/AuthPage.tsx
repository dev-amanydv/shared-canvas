import { Card } from "@repo/ui/card";
import { Input } from "@repo/ui/input";

export default function AuthPage ({authType}: {
    authType: "signup" | "signin"
}) {

    return <div>
        { authType === "signin" ? (
            <div>Sign In Page</div>
        ) : (
            <div className="w-screen h-screen flex justify-center items-center">
                <div>
                    <Card className="md:max-w-4xl w-full">
                        <div className="flex flex-col gap-4">
                            <Input placeholder="Email" className="rounded"  type="text"  />
                            <Input placeholder="Password" className="rounded"  type="text"  />

                        </div>
                        <div>

                        </div>
                        <div>

                        </div>
                    </Card>
                </div>
            </div>
        )}
    </div>

}