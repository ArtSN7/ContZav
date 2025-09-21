"use client"
import {AccountDetails} from "./account_details"
import {SubscriptionManagement} from "./subscription_management"
import {ConnectedAccounts} from "./connected_accounts"
import {SecuritySettings} from "./security_settings"
import {AvatarManagement} from "./avatar_details"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

export function UserProfile() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Профиль пользователя</h1>
                <p className="text-muted-foreground">Управляйте своим аккаунтом, подпиской и подключенными сервисами</p>
            </div>

            {/* Profile Tabs */}
            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="account">Аккаунт</TabsTrigger>
                    <TabsTrigger value="avatars">Аватары</TabsTrigger>
                    <TabsTrigger value="subscription">Подписка</TabsTrigger>
                    <TabsTrigger value="connected">Соцсети</TabsTrigger>
                    <TabsTrigger value="security">Безопасность</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <AccountDetails/>
                </TabsContent>

                <TabsContent value="avatars">
                    <AvatarManagement/>
                </TabsContent>

                <TabsContent value="subscription">
                    <SubscriptionManagement/>
                </TabsContent>

                <TabsContent value="connected">
                    <ConnectedAccounts/>
                </TabsContent>

                <TabsContent value="security">
                    <SecuritySettings/>
                </TabsContent>
            </Tabs>
        </div>
    )
}

