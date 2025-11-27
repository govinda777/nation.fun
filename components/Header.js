import { usePrivy, useWallets } from '@privy-io/react-auth';
import Link from 'next/link';

export default function Header() {
  const { authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  return (
    <header className="container header-container">
      <Link href="/" className="logo-link">
        <img src="/logo.svg" alt="Nation.fun Logo" width="40" height="40" />
        <h1 className="logo-text">Nation.fun</h1>
      </Link>
      <nav>
        {authenticated ? (
          <div className="nav-authenticated">
            <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
            {wallet && (
              <div className="wallet-address">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </div>
            )}
            <button onClick={logout} className="btn-secondary">Logout</button>
          </div>
        ) : (
          <button onClick={login} className="btn">Login</button>
        )}
      </nav>
    </header>
  );
}
