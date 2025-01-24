{/* Only showing the relevant change */}
<boltAction type="file" filePath="app/gameplay/page.tsx">
// Update the InterstitialAd usage in the game over section
return (
  <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
    <InterstitialAd onClose={() => router.push('/new-game')} />
    <div className="w-full max-w-md space-y-8 text-center">
      {/* Rest of the game over UI */}
    </div>
  </main>
);