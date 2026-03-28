import Link from 'next/link';
import { ArrowRight, Film, Sparkles, Clock, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">ScriptAI</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">AI-Powered Script Generation</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Viral YouTube Scripts
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              in Seconds
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Script Your Videos Faster and Cheaper
          </p>

          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">
              Generate professional scripts in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-600/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center mb-6">
                <Film className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Match Your Style</h3>
              <p className="text-gray-400 leading-relaxed">
                Paste a YouTube URL from your favorite creator. Our AI analyzes their pacing,
                hooks, and storytelling structure to match their proven style.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-600/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-purple-600/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Choose AI Models</h3>
              <p className="text-gray-400 leading-relaxed">
                Powered by advanced AI technology that understands viral content patterns
                and engagement techniques used by top creators.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-600/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-green-600/10 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Select Script Length</h3>
              <p className="text-gray-400 leading-relaxed">
                Choose your target video length. Our AI adapts the pacing and content
                density to perfectly fit your desired duration.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-600/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-orange-600/10 flex items-center justify-center mb-6">
                <Video className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Add Inspiration Videos</h3>
              <p className="text-gray-400 leading-relaxed">
                Provide context about your topic. The AI combines the inspiration style
                with your unique message to create compelling scripts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-4">Ready to Create Viral Content?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Start generating professional scripts today
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Film className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-semibold text-white">ScriptAI</span>
          </div>
          <p>Create viral YouTube scripts powered by AI</p>
        </div>
      </footer>
    </div>
  );
}
