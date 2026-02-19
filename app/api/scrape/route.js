import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) return NextResponse.json({ error: 'Brak URL' }, { status: 400 });

    console.log('--- START SCRAPING ---');
    console.log('URL:', url);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'pl-PL,pl;q=0.9,en-US;q=0.8',
    };

    const response = await fetch(url, { headers });

    if (!response.ok) throw new Error(`Status: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    // --- HELPER: Funkcja do naprawiania urwanych linków (np. "/img/but.jpg") ---
    const resolveUrl = (extractedUrl) => {
        if (!extractedUrl) return null;
        if (extractedUrl.startsWith('data:image')) return null; // Ignorujemy base64 (zazwyczaj to małe placeholdery)
        try {
            return new URL(extractedUrl, url).href; // To magicznie łączy domenę ze ścieżką
        } catch (e) {
            return extractedUrl;
        }
    };

    // 1. TYTUŁ
    const title = 
        $('meta[property="og:title"]').attr('content') || 
        $('meta[name="twitter:title"]').attr('content') || 
        $('h1').first().text().trim() || 
        $('title').text().trim();

    // 2. OBRAZEK (Strategia Totalna)
    let image = null;

    // A. JSON-LD (Najlepsza jakość)
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).html());
            const items = Array.isArray(json) ? json : (json['@graph'] || [json]);
            const product = items.find(i => i['@type'] === 'Product' || i['@type'] === 'http://schema.org/Product');
            
            if (product) {
                // Image może być stringiem albo tablicą
                const img = Array.isArray(product.image) ? product.image[0] : product.image;
                // Czasami jest to obiekt {url: "..."}
                if (typeof img === 'object' && img?.url) image = img.url;
                else if (typeof img === 'string') image = img;
            }
        } catch (e) {}
    });

    // B. Meta tagi (Standard)
    if (!image) {
        image = 
            $('meta[property="og:image"]').attr('content') || 
            $('meta[name="twitter:image"]').attr('content') ||
            $('link[rel="image_src"]').attr('href');
    }

    // C. Szukanie w tagach <img> (Desperacja - szukamy największego obrazka)
    if (!image) {
        // Szukamy obrazków, które mają w klasie lub ID słowo "product" lub "main"
        const potentialImg = $('img[class*="product"], img[id*="product"], .product-gallery img').first();
        
        // Często prawdziwe src jest w data-src (lazy loading)
        image = potentialImg.attr('data-src') || potentialImg.attr('src');
    }

    // Naprawiamy URL obrazka (jeśli był relatywny)
    image = resolveUrl(image);


    // 3. CENA (Kopiuj-wklej z poprzedniej działającej wersji)
    let price = null;
    let currency = 'PLN';

    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).html());
            const items = Array.isArray(json) ? json : (json['@graph'] || [json]);
            const product = items.find(i => i['@type'] === 'Product' || i['@type'] === 'http://schema.org/Product');
            if (product && product.offers) {
                const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
                price = offer.price;
                currency = offer.priceCurrency || 'PLN';
            }
        } catch (e) {}
    });

    if (!price) {
        price = $('meta[property="product:price:amount"]').attr('content') || 
                $('meta[property="og:price:amount"]').attr('content');
        currency = $('meta[property="product:price:currency"]').attr('content') || 
                   $('meta[property="og:price:currency"]').attr('content') || 'PLN';
    }

    // Czyszczenie ceny
    if (price) {
        price = price.toString().replace(',', '.').replace(/[^0-9.]/g, '');
    }

    console.log('Znalazłem:', { title, image, price });

    return NextResponse.json({ 
      title: title || '', 
      image: image || '', 
      price, 
      currency,
      url 
    });

  } catch (error) {
    console.error('Błąd:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}