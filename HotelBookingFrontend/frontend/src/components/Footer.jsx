export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black w-full pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-screen-2xl mx-auto">
        <div className="space-y-6">
          <div className="text-xl font-noto-serif text-white">LUXE</div>
          <p className="text-slate-300 dark:text-slate-500 text-sm leading-relaxed">Crafting bespoke travel experiences through an editorial lens since 2012.</p>
          <div className="flex space-x-4">
            <span className="material-symbols-outlined text-amber-500 cursor-pointer hover:text-amber-200 transition-colors">social_leaderboard</span>
            <span className="material-symbols-outlined text-amber-500 cursor-pointer hover:text-amber-200 transition-colors">photo_camera</span>
            <span className="material-symbols-outlined text-amber-500 cursor-pointer hover:text-amber-200 transition-colors">alternate_email</span>
          </div>
        </div>
        <div>
          <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h5>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Careers</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Press</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Partners</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h5>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Cookie Settings</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Luxury Guides</h5>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Europe 2024</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Asian Retreats</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Americas Collection</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Island Paradises</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-slate-800 px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-inter text-slate-300 dark:text-slate-500 text-sm">© 2024 LUXE Editorial Travel. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="text-slate-500 text-xs">Sustainability Commit</span>
            <span className="text-slate-500 text-xs">Luxury Travel Bonded</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
