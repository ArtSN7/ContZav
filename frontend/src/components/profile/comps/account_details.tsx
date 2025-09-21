import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Camera, Save, User} from "lucide-react";
import {getAuthToken} from "@/utils/auth";

interface ProfileData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar_url?: string;
    badges: { variant: "default" | "secondary"; label: string }[];
}

export function AccountDetails() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch("http://localhost:5090/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch profile");

            const data = await response.json();
            if (data.success) {
                setProfileData(transformBackendToFrontend(data.data.user));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const transformBackendToFrontend = (backendUser: any): ProfileData => ({
        id: backendUser.id,
        firstName: backendUser.name?.split(" ")[0] || "",
        lastName: backendUser.name?.split(" ")[1] || "",
        email: backendUser.email,
        phone: backendUser.phone || "",
        avatar_url: backendUser.avatar_url,
        badges: [
            {variant: "default" as const, label: "Pro Plan"},
            {variant: "secondary" as const, label: "Верифицирован"},
        ],
    });

    const transformFrontendToBackend = (frontendData: ProfileData) => ({
        name: `${frontendData.firstName} ${frontendData.lastName}`.trim(),
        email: frontendData.email,
        phone: frontendData.phone,
    });

    const handleSave = async () => {
        if (!profileData) return;

        try {
            const token = getAuthToken();
            const backendData = transformFrontendToBackend(profileData);

            const response = await fetch("http://localhost:5090/api/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(backendData),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setProfileData((prev) => (prev ? {...prev, [field]: value} : null));
    };

    if (loading) return <div>Loading...</div>;
    if (!profileData) return <div>Error loading profile</div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Основная информация</CardTitle>
                    <CardDescription>
                        Управляйте своими личными данными и настройками профиля
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={profileData.avatar_url}/>
                                <AvatarFallback className="text-lg">
                                    {profileData.firstName[0]}
                                    {profileData.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="outline"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-transparent"
                            >
                                <Camera className="h-4 w-4"/>
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">
                                {profileData.firstName} {profileData.lastName}
                            </h3>
                            <p className="text-muted-foreground">{profileData.email}</p>
                            <div className="flex space-x-2">
                                {profileData.badges.map((badge, index) => (
                                    <Badge key={index} variant={badge.variant}>
                                        {badge.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Имя</Label>
                            <Input
                                id="firstName"
                                value={profileData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Фамилия</Label>
                            <Input
                                id="lastName"
                                value={profileData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                disabled={true} // Email нельзя менять
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Телефон</Label>
                            <Input
                                id="phone"
                                value={profileData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>


                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Отмена
                                </Button>
                                <Button onClick={handleSave}>
                                    <Save className="mr-2 h-4 w-4"/>
                                    Сохранить
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                <User className="mr-2 h-4 w-4"/>
                                Редактировать
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
