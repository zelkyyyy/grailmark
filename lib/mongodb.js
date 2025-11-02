// lib/mongodb.js - Przykład dla biblioteki 'mongodb'

import { MongoClient } from 'mongodb'

// Pobranie URI z zmiennych środowiskowych
const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local')
}

// Użycie globalnej zmiennej 'global' w środowisku Next.js Dev Mode 
// aby uniknąć tworzenia wielu połączeń przy Hot Reloading
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // W trybie produkcji połączenie jest tworzone i buforowane
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise