import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide">🦑 PotaMarket</Link>
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-blue-200">Vendedores</Link>
        <Link to="/pedidos" className="hover:text-blue-200">Pedidos</Link>
      </div>
    </nav>
  )
}
