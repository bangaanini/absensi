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
    const channel = supabase
      .channel('realtime:absensi')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'absensi' },
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
      else if(val.includes('1 hari 2 jam')) { hari+=1; jam+=2 }
      else if(val.includes('1 hari')) hari+=1
    })
    const hariText = (hari % 1 === 0 ? hari.toFixed(0) : hari) + ' hari'
    return jam > 0 ? `${hariText} ${jam} jam` : hariText
  }

  return (
    <div style={{padding:'1rem'}}>
      <h1 style={{fontWeight:'bold',fontSize:'1.2rem',marginBottom:'1rem'}}>Absensi Proyek</h1>
      <table style={{borderCollapse:'collapse',width:'100%'}}>
        <thead>
          <tr style={{background:'#eee'}}>
            <th style={{border:'1px solid #ccc',padding:'0.5rem'}}>Nama</th>
            {['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d=>
              <th key={d} style={{border:'1px solid #ccc',padding:'0.5rem'}}>{d}</th>)}
            <th style={{border:'1px solid #ccc',padding:'0.5rem'}}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row=>(
            <tr key={row.id}>
              <td style={{border:'1px solid #ccc',padding:'0.5rem'}}>{row.nama}</td>
              {['minggu','senin','selasa','rabu','kamis','jumat','sabtu'].map(col=>(
                <td key={col} style={{border:'1px solid #ccc',padding:'0.2rem'}}>
                  <select
                    style={{width:'100%'}}
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
              <td style={{border:'1px solid #ccc',padding:'0.5rem'}}>
                {hitungTotal(row)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
