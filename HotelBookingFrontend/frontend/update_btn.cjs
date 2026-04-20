const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckoutPage.jsx', 'utf8');

code = code.replace(
  /<button className="w-full bg-primary text-on-primary py-6 rounded-lg font-headline text-xl tracking-tight flex items-center justify-center gap-3 hover:bg-on-surface transition-all group shadow-xl">[\s\S]*?<\/button>/,
  `<button onClick={handlePayment} disabled={loading} className="w-full bg-primary text-on-primary py-6 rounded-lg font-headline text-xl tracking-tight flex items-center justify-center gap-3 hover:bg-on-surface transition-all group shadow-xl disabled:opacity-50">
      {loading ? 'Processing...' : 'Proceed to Payment'}
      <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
  </button>`
);

fs.writeFileSync('src/pages/CheckoutPage.jsx', code, 'utf8');
