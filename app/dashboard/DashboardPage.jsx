import ActionButtons from "./components/ActionButtons/ActionButtons";
import CoinGeckoWidget from "./components/CoinGeckoWidget/CoinGeckoWidget";
import NavHeader from "./components/NavHeader/NavHeader";
import CardCarousel from "./components/CardCarousel/CardCarousel";
import AssetSection from "./components/AssestSection/AssetsSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { LogoutButton } from "@/components/Logout-button/logout-button";
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";

export default async function DashboardPage() {
  // Get current user session
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  // Fetch user from DB using email
  await connectToDB();
  const user = userEmail ? await User.findOne({ email: userEmail }).lean() : null;

  return (
    <div className="min-h-screen pb-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 relative z-10">
        {/* Top Navigation */}
        <NavHeader />

        {/* Welcome */}
        <div className="mb-8 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-gray-400 text-sm max-w-md">
              Manage your assets, monitor the market, and take control of your finances.
            </p>
            {/* <LogoutButton /> */}
          </div>
        </div>

        {/* Mobile-first: Stack sections vertically, reorder for mobile */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3">
          {/* Main content: Carousel, Quick Actions, Assets */}
          <div className="order-1 lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
              <CardCarousel userIdOrEmail={userEmail} />
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
              <ActionButtons userId={user?._id?.toString() || ""} />
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Your Assets</h2>
              <AssetSection />
            </div>
          </div>

          {/* CoinGeckoWidget LAST on all screens */}
          <div className="order-2">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg h-full">
              <h2 className="text-lg font-semibold mb-3">Market Overview</h2>
              <CoinGeckoWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}