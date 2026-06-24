import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    const { data } = await supabase.from('pedidos').select('*, vendedores(nombre), detalle_pedidos(cantidad, precio_unitario, productos(nombre))').order('created_at', { ascending: false })
    setPedidos(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const toggleEstado = async (p) => {
    const nuevo = p.estado === 'pendiente' ? 'entregado' : 'pendiente'
    await supabase.from('pedidos').update({ estado: nuevo }).eq('id', p.id)
    cargar()
  }

  if (loading) return <div className="text-center mt-20 text-gray-500">Cargando pedidos...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Pedidos</h1>
      <p className="text-gray-500 mb-8">Historial y estado de pedidos.</p>
      {pedidos.length === 0 && <div className="text-center text-gray-400 mt-20">Aún no hay pedidos.</div>}
      <div className="flex flex-col gap-4">
        {pedidos.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-gray-800 text-lg">{p.cliente_nombre}</p>
                <p className="text-sm text-gray-400">Vendedor: {p.vendedores?.nombre}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${p.estado === 'entregado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {p.estado}
              </span>
            </div>
            {p.detalle_pedidos?.map((d, i) => (
              <p key={i} className="text-sm text-gray-600">{d.cantidad}× {d.productos?.nombre} — S/ {(d.cantidad * d.precio_unitario).toFixed(2)}</p>
            ))}
            <div className="flex justify-between items-center mt-3">
              <p className="font-bold text-blue-700">Total: S/ {parseFloat(p.total).toFixed(2)}</p>
              <button onClick={() => toggleEstado(p)} className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full transition">
                {p.estado === 'pendiente' ? 'Marcar entregado' : 'Marcar pendiente'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
