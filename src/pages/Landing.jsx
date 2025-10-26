import { Link } from 'react-router-dom';
import { 
  Plus, Play, Shield, Lock, CheckCircle, 
  FileText, Users, DollarSign, ArrowRight,
  ShieldCheck, FileCheck, Coins, Scale, BarChart3, Clock
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

const Landing = () => {
  const stats = [
    { value: '$300B', label: 'Lost annually' },
    { value: '65M+', label: 'Freelancers' },
    { value: '$0', label: 'Legal fees' },
  ];
  
  const steps = [
    {
      number: '01',
      icon: FileText,
      title: 'Create & Lock Funds',
      description: 'Define your project, set milestones, and lock payment in smart contract escrow.',
      badge: 'Instant'
    },
    {
      number: '02',
      icon: Users,
      title: 'Collaborate Safely',
      description: 'Work together with IP automatically registered on Story Protocol blockchain.',
      badge: 'On-Chain'
    },
    {
      number: '03',
      icon: CheckCircle,
      title: 'Approve Milestones',
      description: 'Review deliverables and approve completed work through the platform.',
      badge: 'Automated'
    },
    {
      number: '04',
      icon: DollarSign,
      title: 'Auto-Release Payment',
      description: 'Funds release automatically upon approval. No intermediaries needed.',
      badge: 'Instant'
    }
  ];
  
  const features = [
    {
      icon: ShieldCheck,
      title: 'Smart Escrow',
      description: 'Funds locked in blockchain-secured escrow until milestones are approved. Zero risk of non-payment.',
      badge: 'Story Protocol'
    },
    {
      icon: FileCheck,
      title: 'IP Registration',
      description: 'Every collaboration automatically registers IP ownership on-chain with immutable proof.',
      badge: 'On-Chain'
    },
    {
      icon: Coins,
      title: 'Automatic Revenue Splits',
      description: 'Define revenue sharing upfront. All future earnings split automatically via smart contracts.',
      badge: 'Automated'
    },
    {
      icon: Scale,
      title: 'Dispute Resolution',
      description: 'Built-in arbitration system with transparent process and blockchain-verified outcomes.',
      badge: 'On-Chain'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track project progress, earnings, IP portfolio value, and collaboration metrics in real-time.',
      badge: 'Automated'
    },
    {
      icon: Clock,
      title: 'Immutable Timestamps',
      description: 'Every action, submission, and approval timestamped on blockchain for complete transparency.',
      badge: 'On-Chain'
    }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-linear-to-br from-gray-50 to-white min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Collaborate Without Trust Issues
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mt-6">
                Lock funds in escrow, register IP on blockchain, split revenue automatically. No lawyers needed.
              </p>
              
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex items-center gap-4 mt-10">
                <Link to="/create-project">
                  <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 shadow-lg">
                    <Plus className="w-5 h-5" />
                    Create Project
                  </Button>
                </Link>
                <Button variant="secondary" className="border-2 px-8 py-4">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-slate-500 mt-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Built on Story Protocol</span>
                </div>
                <div className="border-l border-gray-300 h-4"></div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Secured by Blockchain</span>
                </div>
                <div className="border-l border-gray-300 h-4"></div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Testnet Ready</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Mockup */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 transform rotate-2 hover:rotate-0 transition duration-300">
                <div className="space-y-4">
                  <div className="h-12 bg-linear-to-r from-cyan-100 to-emerald-100 rounded-lg"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-gray-100 rounded-lg"></div>
                    <div className="h-32 bg-gray-100 rounded-lg"></div>
                  </div>
                  <div className="h-24 bg-gray-50 rounded-lg"></div>
                  <div className="h-24 bg-gray-50 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-4"></div>
            <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mt-6">
              Four simple steps to secure collaboration and automatic IP protection
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 mt-16">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative bg-gray-50 p-8 rounded-xl hover:shadow-lg transition group cursor-pointer"
              >
                <div className="absolute top-4 left-4 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
                
                <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mb-6 mt-16">
                  <step.icon className="w-8 h-8 text-cyan-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
                
                <span className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                  {step.badge}
                </span>
                
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-6 h-6 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Platform Features</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-4"></div>
            <p className="text-lg text-slate-300 text-center max-w-2xl mx-auto mt-6">
              Everything you need for trust-free creative collaboration
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl hover:border-cyan-600 hover:shadow-xl transition group backdrop-blur-sm"
              >
                <div className="w-14 h-14 bg-cyan-600/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-600/20 transition">
                  <feature.icon className="w-7 h-7 text-cyan-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs font-medium">
                  {feature.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-linear-to-r from-cyan-600 to-emerald-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Collaborate Without Risk?
          </h2>
          
          <p className="text-xl text-white/90 mt-6">
            Join thousands of creators protecting their IP on-chain
          </p>
          
          <Link to="/create-project">
            <Button className=" text-slate-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-xl mx-auto mt-10">
              Get Started Now
              <ArrowRight className="inline ml-2" />
            </Button>
          </Link>
          
          <p className="text-white/80 text-sm mt-4">
            No credit card required • Testnet ready • Open source
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;
