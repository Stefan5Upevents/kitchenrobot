import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Auth helpers ──────────────────────────────────────────────

export async function inloggen(email, wachtwoord) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: wachtwoord,
  })
  if (error) throw error
  return data
}

export async function uitloggen() {
  await supabase.auth.signOut()
}

export async function huidigeProfiel() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('gebruikers_profielen')
    .select('*')
    .eq('id', user.id)
    .single()
  return data
}

// ─── Stamgegevens helpers ──────────────────────────────────────

export async function laadProductgroepen() {
  const { data, error } = await supabase
    .from('productgroepen')
    .select(`*, productsoorten(*)`)
    .order('volgorde')
  if (error) throw error
  return data
}

export async function slaProductgroepOp(groep) {
  const { data, error } = await supabase
    .from('productgroepen')
    .upsert(groep)
    .select()
  if (error) throw error
  return data[0]
}

export async function verwijderProductgroep(id) {
  const { error } = await supabase
    .from('productgroepen')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function laadGerechten() {
  const { data, error } = await supabase
    .from('gerechten')
    .select(`*, gn_formaten(*), schaal_formaten(*), ingredienten(*, sligro_producten(*))`)
    .order('volgorde')
  if (error) throw error
  return data
}

export async function slaGerechtenOp(gerecht) {
  const { data, error } = await supabase
    .from('gerechten')
    .upsert(gerecht)
    .select()
  if (error) throw error
  return data[0]
}

export async function laadMenus() {
  const { data, error } = await supabase
    .from('menus')
    .select(`*, menu_gerechten(*, gerechten(*))`)
    .order('code')
  if (error) throw error
  return data
}

export async function laadSligroProducten() {
  const { data, error } = await supabase
    .from('sligro_producten')
    .select('*')
    .order('naam')
  if (error) throw error
  return data
}

export async function slaaSligroProductenOp(producten) {
  const { error } = await supabase
    .from('sligro_producten')
    .upsert(producten)
  if (error) throw error
}

export async function laadRecrasKoppelingen() {
  const { data, error } = await supabase
    .from('recras_koppelingen')
    .select(`*, menus(*)`)
    .order('recras_id')
  if (error) throw error
  return data
}
