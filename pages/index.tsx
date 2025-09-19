import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

type Row = {
  id: number
  nama: string
  minggu: string | null
  senin: string | null
  selasa: string | null
  rabu: string | null
  kamis: string | null
  jumat: string | null
  sabtu: string | null
}

export default function Home() {
  const [data, setData] = useState<Row[]>([])

  useEffect(() => {
    fetchData()
    // realtime update
    const channel = supabase
      .channel('realtime:absensi')
      .on('postgres_changes',{ event:'*', schema:'public', table:'absensi' },
        () => fetchData()
      ).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('absensi').select('*').order('id')
    setData(data || [])
  }

  async function updateCell(id:number, field:string, value:string) {
    await supabase.from('absensi').update({ [field]: value }).eq('id', id)
  }

  function hitungTotal(row:Row) {
    const kolom = [row.minggu,row.senin,row.selasa,row.rabu,row.kamis,row.jumat,row.sabtu]
    let hari=0, jam=0
    kolom.forEach(v=>{
      if(!v) return
      const val = v.toLowerCase()
      if(val.includes('0.5')) hari+=0.5
      else if(val.includes('1.5')) hari+=1.5
      else if(val.includes('2 hari')) hari+=2
      else if(val.includes('1 hari 2 jam')){ hari+=1; jam+=2 }
      else if(val.includes('1 hari')) hari+=1
    })
    return `${hari % 1 === 0 ? hari.toFixed(0) : hari} hari${jam>0?` ${jam} jam`:''}`
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Absensi Proyek</h1>
      <table className="border-collapse border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nama</th>
            {['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d=>
              <th key={d} className="border p-2">{d}</th>)}
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row=>(
            <tr key={row.id}>
              <td className="border p-2">{row.nama}</td>
              {['minggu','senin','selasa','rabu','kamis','jumat','sabtu'].map(col=>(
                <td key={col} className="border p-1">
                  <select
                    className="border p-1 text-sm"
                    value={(row as any)[col] || ''}
                    onChange={e=>updateCell(row.id,col,e.target.value)}
                  >
                    <option value="">x</option>
                    <option value="0.5 hari">0,5 hari</option>
                    <option value="1 hari">1 hari</option>
                    <option value="1.5 hari">1,5 hari</option>
                    <option value="2 hari">2 hari</option>
                    <option value="1 hari 2 jam">1 hari 2 jam</option>
                  </select>
                </td>
              ))}
              <td className="border p-2">{hitungTotal(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}