import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Home() {
  const [vendedores, setVendedores] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('vendedores').select('*').then(({ data }) => {
      setVendedores(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center mt-20 text-gray-500">Cargando vendedores...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Vendedores de Pota</h1>
      <p className="text-gray-500 mb-8">Encuentra pota fresca y verificada cerca de ti.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {vendedores.map(v => (
          <div
            key={v.id}
            onClick={() => navigate(`/vendedor/${v.id}`)}
            className="bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer transition p-5 border border-gray-100"
          >
            <img
              src={v.foto_url || 'https://placehold.co/300x200?text=Vendedor'}
              alt={v.nombre}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-semibold text-gray-800">{v.nombre}</h2>
              {v.tiene_licencia
                ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">✓ Licencia Verificada</span>
                : <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">✗ Sin Licencia</span>
              }
            </div>
            <p className="text-sm text-gray-500">📍 {v.ubicacion}</p>
            {v.registro_sanitario && (
              <p className="text-xs text-blue-500 mt-1">🛡 Reg. Sanitario: {v.registro_sanitario}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
