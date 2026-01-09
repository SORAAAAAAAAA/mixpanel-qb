'use client';

import { useSearchParams } from 'next/navigation';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { ProfileHeader } from "@/components/user-profile/ProfileHeader";
import { UserIdentityCard, UserPropertiesCard, UserProperty } from "@/components/user-profile/UserCard";
import { ProfileSidebar, ProfileContent, ActivityFeed } from "@/components/user-profile/UserGrid";

export default function UserProfilePage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('id');
    const { allUsers } = useAnalyticsStore();

    // Find the user by distinctId from URL params
    const user = allUsers.find(u => u.distinctId === userId);

    // If user not found, show a fallback
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-foreground mb-2">User Not Found</h1>
                    <p className="text-muted-foreground">The requested user profile could not be found.</p>
                    <a href="/" className="text-[#4f44e0] hover:underline mt-4 inline-block">
                        ← Back to Users
                    </a>
                </div>
            </div>
        );
    }

    // Build user data from the MixpanelProfile
    const userName = user.$name || 'Unknown User';
    const userEmail = user.$email || '';
    const userLocation = [user.$city, user.$region, user.$country_code].filter(Boolean).join(', ') || 'Unknown';
    const userUpdatedAt = user.$created ? new Date(user.$created).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Unknown';

    // Build all user properties for the properties card
    const userProperties: UserProperty[] = [
        { label: "# connected accounts", value: String(user.customAttributes?.connected_accounts || 0) },
        { label: "age", value: String(user.customAttributes?.age || 'Unknown') },
        { label: "Avatar URL", value: user.$avatar || 'Not set' },
        { label: "City", value: user.$city || 'Unknown' },
        { label: "Country Code", value: user.$country_code || 'Unknown' },
        { label: "Created", value: user.$created ? new Date(user.$created).toLocaleString() : 'Unknown' },
        { label: "credit score", value: String(user.customAttributes?.credit_score || 'Unknown') },
        { label: "Distinct ID", value: user.distinctId },
        { label: "Email", value: user.$email || 'Not set' },
        { label: "Name", value: user.$name || 'Unknown' },
        { label: "Region", value: user.$region || 'Unknown' },
        { label: "geo source", value: user.customAttributes?.geo_source || 'Unknown' },
        { label: "net worth usd", value: String(user.customAttributes?.net_worth_usd || 'Unknown') },
        { label: "OS", value: user.$os || 'Unknown' },
    ];

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const handleMoreOptions = () => {
        console.log('More options clicked');
    };

    const handleDeleteProfile = () => {
        console.log('Delete profile clicked');
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Profile Header - Breadcrumb style */}
            <ProfileHeader
                userName={userName}
                onCopyLink={handleCopyLink}
                onMoreOptions={handleMoreOptions}
            />

            {/* Main Layout - Two columns */}
            <div className="flex flex-1 min-h-0">
                {/* Left Sidebar - Only 2 cards now */}
                <ProfileSidebar>
                    <UserIdentityCard
                        name={userName}
                        email={userEmail}
                        avatarUrl={user.$avatar}
                        distinctId={user.distinctId}
                        location={userLocation}
                        updatedAt={userUpdatedAt}
                        onDelete={handleDeleteProfile}
                    />
                    <UserPropertiesCard properties={userProperties} />
                </ProfileSidebar>

                {/* Right - Activity Feed */}
                <ProfileContent>
                    <ActivityFeed />
                </ProfileContent>
            </div>
        </div>
    );
}
