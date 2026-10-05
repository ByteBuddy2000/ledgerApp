import NavHeader from "../components/NavHeader/NavHeader";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pb-8">
      <NavHeader />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <section className="border border-red-900/60 bg-gray-900 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-white">Wallet connection disabled</h1>
          <p className="mt-4 text-gray-300">
            This site will not ask for or store recovery phrases, private keys, or keystore passwords.
            Never share those credentials with anyone.
          </p>
          <p className="mt-3 text-gray-400">
            Use your wallet provider directly to manage your wallet. A public wallet address is sufficient
            for receiving funds; secret credentials are never required.
          </p>
        </section>
      </div>
    </div>
  );
}

