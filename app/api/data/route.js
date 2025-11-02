// app/api/dane/route.js (App Router)
// lub pages/api/dane.js (Pages Router)

import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const client = await clientPromise
    
    // 2. Wybierz bazę danych i kolekcję
    // (Możesz również podać nazwę bazy danych w URI)
    const db = client.db("dripandDB") 
    const collection = db.collection("bookmarks")
    
    // 3. Wykonaj zapytanie
    const dane = await collection.find({}).toArray()
    
    // 4. Zwróć dane
    return NextResponse.json({ status: 200, data: dane })

  } catch (e) {
    console.error(e)
    return NextResponse.json({ status: 500, error: 'Błąd połączenia z bazą danych' })
  }
}