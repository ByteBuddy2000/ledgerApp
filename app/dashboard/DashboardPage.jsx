import ActionButtons from "./components/ActionButtons/ActionButtons";
import CoinGeckoWidget from "./components/CoinGeckoWidget/CoinGeckoWidget";
import NavHeader from "./components/NavHeader/NavHeader";
import CardCarousel from "./components/CardCarousel/CardCarousel";
import AssetSection from "./components/AssestSection/AssetsSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  await connectToDB();
  const user = userEmail ? await User.findOne({ email: userEmail }).lean() : null;

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-bl from-[#05011aff] via-[ #000000] to-[#001F3F] text-white relative overflow-hidden">
      {/* Premium Blue Glow & Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft aurora-style gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,122,255,0.12),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(0,255,204,0.1),transparent_60%)]" />
        
        {/* Top left glow */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-sky-400/10 to-transparent rounded-full blur-3xl" />

        {/* Bottom right glow */}
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full blur-2xl" />

        {/* Soft horizontal light streak */}
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 relative z-10">
        {/* Navigation */}
        <NavHeader />

        {/* Welcome */}
        <div className="mt-6 mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Welcome back{user ? `, ${user.username || ""}` : ""} 👋
          </h1>
          <p className="text-gray-300 mt-3 max-w-xl text-lg">
            Manage your crypto, stocks, and investments in one sleek dashboard.
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left Content */}
          <div className="order-1 lg:col-span-2 space-y-10">
            {/* Carousel */}
            <div className="glass-card">
              <CardCarousel userIdOrEmail={userEmail} />
            </div>

            {/* Quick Actions */}
            <div className="glass-card">
              <h2 className="text-xl font-bold mb-4">⚡ Quick Actions</h2>
              <ActionButtons userId={user?._id?.toString() || ""} />
            </div>

            {/* Assets */}
            <div className="glass-card">
              <h2 className="text-xl font-bold mb-4">💰 Your Assets</h2>
              <AssetSection />
            </div>
          </div>

          {/* Market Overview */}
          <div className="order-2 lg:sticky lg:top-12 h-fit">
            <div className="glass-card">
              <h2 className="text-xl font-bold mb-4">📈 Market Overview</h2>
              <CoinGeckoWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
