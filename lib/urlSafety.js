import dns from 'node:dns/promises'
import net from 'node:net'

// Blocks server-side requests from being pointed at internal/private
// infrastructure (loopback, RFC1918 ranges, link-local incl. cloud
// metadata endpoints like 169.254.169.254, etc). Used to guard any
// endpoint that fetches a URL supplied by the client.

function ipv4ToInt(ip) {
  return ip.split('.').reduce((acc, part) => (acc << 8) + parseInt(part, 10), 0) >>> 0
}

function isPrivateIPv4(ip) {
  const n = ipv4ToInt(ip)
  const inRange = (base, bits) => {
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0
    return (n & mask) === (ipv4ToInt(base) & mask)
  }
  return (
    inRange('0.0.0.0', 8) ||       // "this" network
    inRange('10.0.0.0', 8) ||      // private
    inRange('100.64.0.0', 10) ||   // carrier-grade NAT
    inRange('127.0.0.0', 8) ||     // loopback
    inRange('169.254.0.0', 16) ||  // link-local (cloud metadata: 169.254.169.254)
    inRange('172.16.0.0', 12) ||   // private
    inRange('192.0.0.0', 24) ||    // IETF protocol assignments
    inRange('192.0.2.0', 24) ||    // TEST-NET-1
    inRange('192.168.0.0', 16) ||  // private
    inRange('198.18.0.0', 15) ||   // benchmarking
    inRange('198.51.100.0', 24) || // TEST-NET-2
    inRange('203.0.113.0', 24) ||  // TEST-NET-3
    inRange('224.0.0.0', 4) ||     // multicast
    inRange('240.0.0.0', 4)        // reserved
  )
}

function isPrivateIPv6(ip) {
  const lower = ip.toLowerCase()
  if (lower === '::1' || lower === '::') return true
  if (lower.startsWith('fe80:') || lower.startsWith('fc') || lower.startsWith('fd')) return true // link-local / ULA
  // IPv4-mapped IPv6 (::ffff:a.b.c.d) — check the embedded IPv4 address
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return isPrivateIPv4(mapped[1])
  return false
}

function isPrivateIp(ip) {
  const version = net.isIP(ip)
  if (version === 4) return isPrivateIPv4(ip)
  if (version === 6) return isPrivateIPv6(ip)
  return true // unrecognized — fail closed
}

// Resolves the URL's hostname and rejects it if it isn't a safe,
// public http(s) address. Returns { safe: true } or { safe: false, reason }.
export async function assertSafeRemoteUrl(rawUrl) {
  let parsed
  try {
    parsed = new URL(rawUrl)
  } catch {
    return { safe: false, reason: 'Invalid URL' }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { safe: false, reason: 'Only http/https links are supported' }
  }

  const hostname = parsed.hostname
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.local')) {
    return { safe: false, reason: 'That link is not reachable' }
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) return { safe: false, reason: 'That link is not reachable' }
    return { safe: true }
  }

  let addresses
  try {
    addresses = await dns.lookup(hostname, { all: true, verbatim: true })
  } catch {
    return { safe: false, reason: 'Could not resolve that link' }
  }

  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    return { safe: false, reason: 'That link is not reachable' }
  }

  return { safe: true }
}
