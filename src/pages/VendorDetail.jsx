import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function VendorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vendedor, setVendedor] = useState(null)
  const [productos, setProductos] = useState([])
  const [cantidades, setCantidades] = useState({})
  const [cliente, setCliente] = useState('')
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    Promise.all([
      supabase.from('vendedores').select('*').eq('id', id).single(),
      supabase.from('productos').select('*').eq('vendedor_id', id)
    ]).then(([{ data: v }, { data: p }]) => {
      setVendedor(v)
      setProductos(p || [])
      setLoading(false)
    })
  }, [id])

  const total = productos.reduce((sum, p) => sum + (cantidades[p.id] || 0) * p.precio, 0)

  const confirmar = async () => {
    if (!cliente.trim()) return alert('Ingresa tu nombre')
    if (total === 0) return alert('Selecciona al menos un producto')

    const { data: pedido } = await supabase.from('pedidos').insert({
      vendedor_id: id, cliente_nombre: cliente, total, estado: 'pendiente'
    }).select().single()

    const detalles = productos
      .filter(p => cantidades[p.id] > 0)
      .map(p => ({ pedido_id: pedido.id, producto_id: p.id, cantidad: cantidades[p.id], precio_unitario: parseFloat(p.precio) }))

    await supabase.from('detalle_pedidos').insert(detalles)
    setMensaje('✅ Pedido confirmado exitosamente')
    setCantidades({})
    setCliente('')
  }

  if (loading) return <div className="text-center mt-20 text-gray-500">Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => navigate('/')} className="text-blue-600 mb-6 text-sm hover:underline">← Volver</button>
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <img src={vendedor.foto_url || 'https://placehold.co/600x200?text=Vendedor'} alt={vendedor.nombre} className="w-full h-48 object-cover rounded-xl mb-4" />
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{vendedor.nombre}</h1>
          {vendedor.tiene_licencia
            ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Licencia Verificada</span>
            : <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">✗ Sin Licencia</span>}
        </div>
        <p className="text-gray-500 text-sm">📍 {vendedor.ubicacion}</p>
        {vendedor.registro_sanitario && <p className="text-blue-500 text-sm mt-1">🛡 Reg. Sanitario: {vendedor.registro_sanitario}</p>}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">Productos disponibles</h2>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {productos.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <img src={p.imagen_url || 'https://placehold.co/80x60?text=Pota'} alt={p.nombre} className="w-20 h-14 object-cover rounded-lg mb-2" />
              <p className="font-medium text-gray-800">{p.nombre}</p>
              <p className="text-blue-600 font-bold">S/ {parseFloat(p.precio).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCantidades(c => ({ ...c, [p.id]: Math.max(0, (c[p.id] || 0) - 1) }))} className="w-8 h-8 bg-gray-200 rounded-full font-bold text-lg hover:bg-gray-300">-</button>
              <span className="w-6 text-center font-semibold">{cantidades[p.id] || 0}</span>
              <button onClick={() => setCantidades(c => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }))} className="w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700">+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Confirmar pedido</h2>
        {mensaje && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">{mensaje}</div>}
        <input value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Tu nombre" className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Total:</span>
          <span className="text-2xl font-bold text-blue-700">S/ {total.toFixed(2)}</span>
        </div>
        <button onClick={confirmar} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">Confirmar Pedido</button>
      </div>
    </div>
  )
}
