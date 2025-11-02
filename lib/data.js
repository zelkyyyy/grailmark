// lib/data.js

import clientPromise from './mongodb';

export async function getProducts() {
  try {
    const client = await clientPromise;
    const db = client.db('dripandDB'); // Zmień na swoją nazwę bazy
    const collection = db.collection('bookmarks'); // Zmień na nazwę swojej kolekcji

    const data = await collection.find({}).toArray();

    // Ważne: MongoDB zwraca obiekty z polem _id typu ObjectId.
    // Aby uniknąć błędów serializacji, konwertujemy _id na string.
    const serializableData = data.map(doc => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return serializableData;
  } catch (e) {
    console.error("Błąd podczas pobierania danych:", e);
    // W przypadku błędu najlepiej rzucić wyjątek
    throw new Error("Nie udało się pobrać danych użytkowników.");
  }
}