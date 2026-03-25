import { useState, useEffect } from 'react'
import { supabase, inloggen, uitloggen, huidigeProfiel } from './supabase.js'
import KitchenRobotApp from './KitchenRobot.jsx'

export default function App() {
  const [sessie, setSessie] = useState(null)
  const [profiel, setProfiel] = useState(null)
  const [laden, setLaden] = useState(true)

  useEffect(() => {
    // Check bestaande sessie bij laden
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessie(session)
      if (session) {
        huidigeProfiel().then(p => {
          setProfiel(p)
          setLaden(false)
        }).catch(() => setLaden(false))
      } else {
        setLaden(false)
      }
    })

    // Luister naar auth wijzigingen (inloggen/uitloggen)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSessie(session)
        if (session) {
          const p = await huidigeProfiel()
          setProfiel(p)
        } else {
          setProfiel(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (laden) {
    return (
      <div style={{ minHeight: '100vh', background: '#002D41', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#1AA6B7', fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>
          Laden...
        </div>
      </div>
    )
  }

  // Geef de KitchenRobot app de Supabase inlog/uitlog functies mee
  return (
    <KitchenRobotApp
      supabaseInloggen={inloggen}
      supabaseUitloggen={uitloggen}
      supabaseSessie={sessie}
      supabaseProfiel={profiel}
    />
  )
}
