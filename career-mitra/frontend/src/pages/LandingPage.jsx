import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiStar, FiCalendar, FiUsers, FiBookOpen, FiVideo, FiShield, FiTrendingUp } from 'react-icons/fi';
import { mockMentors } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }
  }
};

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-mesh min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-indigo-400/10 filter blur-[80px] -z-10" />
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-violet-400/10 filter blur-[100px] -z-10" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              className="lg:col-span-7 text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Accepting new students</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl md:text-[3.5rem] font-extrabold text-ink-900 leading-[1.12] tracking-tight mb-6">
                Find mentors who've <br />
                <span className="text-gradient font-black">been where you're going</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-base md:text-lg text-ink-600 mb-8 max-w-xl leading-relaxed">
                Connect 1:1 with software engineers, product managers, and designers from the world's leading companies. Real advice, real growth.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/mentors">
                  <button className="btn-primary w-full sm:w-auto px-7 py-3.5 text-base flex items-center justify-center gap-2.5 group">
                    Explore Mentors
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </button>
                </Link>
                {!user && (
                  <Link to="/signup">
                    <button className="btn-secondary w-full sm:w-auto px-7 py-3.5 text-base shadow-sm">
                      Sign up free
                    </button>
                  </Link>
                )}
              </motion.div>

              {/* Understated Social Proof */}
              <motion.div variants={itemVariants} className="flex items-center gap-8 pt-8 border-t border-surface-200">
                <div>
                  <div className="text-2xl font-extrabold text-ink-900 tracking-tight">340+</div>
                  <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mt-0.5">Top Mentors</div>
                </div>
                <div className="w-px h-10 bg-surface-200" />
                <div>
                  <div className="text-2xl font-extrabold text-ink-900 tracking-tight">5,200+</div>
                  <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mt-0.5">Students</div>
                </div>
                <div className="w-px h-10 bg-surface-200" />
                <div>
                  <div className="text-2xl font-extrabold text-ink-900 tracking-tight">15K+</div>
                  <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mt-0.5">Sessions</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Interactive Dashboard Card */}
            <motion.div 
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, cubicBezier: [0.16, 1, 0.3, 1] }}
            >
              {/* Decorative back element */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 rounded-2xl filter blur-xl -z-10 transform translate-x-3 translate-y-3" />
              
              {/* Premium Dashboard Preview */}
              <div className="glassmorphism rounded-2xl p-6 border border-white/60 shadow-[0_20px_50px_rgba(99,102,241,0.08)]">
                <div className="flex justify-between items-center pb-4 border-b border-surface-200/50 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-2xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">Live Session Frame</span>
                </div>
                
                {/* Mentor profile item */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="Rajesh Kumar"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-ink-950">Rajesh Kumar</h4>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500">★ 4.9</span>
                    </div>
                    <p className="text-2xs font-semibold text-indigo-600 uppercase tracking-wider">Sr. Engineer at Google</p>
                  </div>
                </div>

                {/* Video Booking Box */}
                <div className="bg-white/80 rounded-xl p-4 border border-surface-200/40 shadow-sm mb-4 space-y-3.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-ink-600">
                    <span className="flex items-center gap-1.5"><FiCalendar className="text-indigo-500" size={13} /> Date</span>
                    <span className="text-ink-900">May 26, 2026</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-ink-600">
                    <span className="flex items-center gap-1.5"><FiBookOpen className="text-indigo-500" size={13} /> Topic</span>
                    <span className="text-ink-900 truncate max-w-[150px]">System Design Review</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-ink-600">
                    <span className="flex items-center gap-1.5"><FiVideo className="text-indigo-500" size={13} /> Status</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Ready to Join</span>
                  </div>
                </div>

                {/* Call Action Button */}
                <button className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2">
                  <FiVideo size={13} />
                  Join Video Call (Jitsi Meet)
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Top Mentors Preview */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-2xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Discovery Hub</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-ink-900 tracking-tight">Meet our top-rated mentors</h2>
              <p className="text-ink-500 text-sm mt-1">High-quality guidance from verified industry leaders.</p>
            </div>
            <Link to="/mentors" className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hidden sm:flex">
              Browse all mentors <FiArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockMentors.slice(0, 3).map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white border border-surface-200 rounded-2xl p-6 shadow-sm hover:border-indigo-300 hover:shadow-[0_12px_24px_-4px_rgba(99,102,241,0.05)] transition-all duration-300"
              >
                {/* Background glow hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/10 to-violet-50/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex items-start gap-4 mb-4">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-200 group-hover:ring-indigo-500/30 transition-all duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-ink-950 truncate group-hover:text-indigo-600 transition-colors">{mentor.name}</h3>
                    <p className="text-2xs font-semibold text-ink-500 mt-0.5 truncate">{mentor.role} at {mentor.company}</p>
                  </div>
                  {mentor.badge === 'Top Mentor' && (
                    <span className="bg-amber-500/10 text-amber-700 text-3xs font-extrabold px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0 uppercase tracking-wider">
                      Top
                    </span>
                  )}
                </div>

                <div className="relative flex items-center justify-between text-2xs font-bold text-ink-600 mb-4 bg-surface-50 rounded-xl p-2.5 border border-surface-100">
                  <span className="flex items-center gap-1">
                    <FiStar className="text-amber-500 fill-amber-500" size={12} />
                    {mentor.rating}
                  </span>
                  <div className="w-1 h-3 bg-surface-200" />
                  <span>{mentor.experience}+ Yrs Exp</span>
                  <div className="w-1 h-3 bg-surface-200" />
                  <span className="text-indigo-600">₹{mentor.sessionFee} / Session</span>
                </div>

                <div className="relative flex flex-wrap gap-1.5 mb-5">
                  {mentor.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg text-3xs font-bold border border-indigo-100/50">
                      {skill}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/mentors/${mentor.id}`}
                  className="relative w-full btn-secondary py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  View Profile
                  <FiArrowRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>

          <Link to="/mentors" className="sm:hidden mt-6 block text-center text-sm font-bold text-indigo-600">
            View all mentors →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-white border-y border-surface-200/60 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-2xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Simplicity First</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink-900 tracking-tight">Four simple steps to grow</h2>
            <p className="text-ink-500 text-sm mt-1">Get started on your career journey in less than 5 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: FiUsers, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', title: 'Create Account', desc: 'Sign up as a student or mentor in under a minute.' },
              { step: '2', icon: FiBookOpen, color: 'text-violet-600 bg-violet-50 border-violet-100', title: 'Find Your Mentor', desc: 'Filter by domain, experience, budget, and real reviews.' },
              { step: '3', icon: FiCalendar, color: 'text-pink-600 bg-pink-50 border-pink-100', title: 'Book Session', desc: 'Choose a mutually convenient slot and secure booking.' },
              { step: '4', icon: FiCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', title: 'Learn & Elevate', desc: 'Collaborate via video call room, take notes, and track progress.' },
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left group relative">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${item.color} border mb-4 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  <item.icon size={22} />
                </div>
                <h3 className="text-sm font-bold text-ink-900 mb-1">{item.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-14 text-left">
            <span className="text-2xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Core Values</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink-900 tracking-tight">Why students choose Career Mitra</h2>
            <p className="text-ink-500 text-sm mt-1">Real value. Verified results. No empty marketing fluff.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FiUsers, color: 'text-indigo-500', title: 'Real Industry Mentors', desc: 'Engineers, PMs, and designers from Google, Microsoft, Adobe, and Netflix who work on real systems.' },
              { icon: FiTrendingUp, color: 'text-emerald-500', title: 'Affordable Pricing', desc: 'Sessions starting at ₹500. No subscriptions. Pay only for the specific slots you need.' },
              { icon: FiCalendar, color: 'text-violet-500', title: 'Flexible Scheduling', desc: 'Easily book or reschedule slots. Work around your busy college or work schedules.' },
              { icon: FiShield, color: 'text-rose-500', title: 'Verified Backgrounds', desc: 'We verify work history, LinkedIn presence, and background credentials for all mentors.' },
              { icon: FiBookOpen, color: 'text-amber-500', title: 'Comprehensive Dashboards', desc: 'Take notes, view completed sessions, access earnings tracking, and read review comments.' },
              { icon: FiVideo, color: 'text-sky-500', title: 'Integrated Video Rooms', desc: 'One-click Jitsi Meet calls integrated directly in the browser. Safe, secured, and zero installs.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-surface-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-[0_8px_16px_-4px_rgba(99,102,241,0.04)] transition-all duration-300">
                <div className={`${item.color} w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center mb-3 border border-surface-100`}>
                  <item.icon size={16} />
                </div>
                <h3 className="text-sm font-bold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white border-t border-surface-200/60 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/5 filter blur-[80px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-2xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Elevate Your Career</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink-900 tracking-tight mb-4">
              Ready to learn from the best?
            </h2>
            <p className="text-ink-500 text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed">
              {user 
                ? "Explore our expert mentors and book a 1:1 session today. Your dream job is waiting." 
                : "Create an account now and unlock access to top-tier mentorship. Your dream job is waiting."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4.5 justify-center">
              {!user ? (
                <>
                  <Link to="/signup" className="w-full sm:w-auto">
                    <button className="btn-primary w-full px-8 py-3.5 text-base">
                      Get Started Free
                    </button>
                  </Link>
                  <Link to="/mentors" className="w-full sm:w-auto">
                    <button className="btn-secondary w-full px-8 py-3.5 text-base bg-transparent">
                      Browse Mentors
                    </button>
                  </Link>
                </>
              ) : (
                <Link to="/mentors" className="w-full sm:w-auto">
                  <button className="btn-primary w-full px-8 py-3.5 text-base">
                    Browse Mentors
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
