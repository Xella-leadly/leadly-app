import { Brand } from './Navbar';
export function Footer() {
  return <footer className="site-footer"><div className="site-width footer-inner">
    <Brand /><nav aria-label="Footer navigation"><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a><a href="/sign-in">Seller sign-in</a></nav>
    <small>© {new Date().getFullYear()} LEADLY</small>
  </div></footer>;
}
