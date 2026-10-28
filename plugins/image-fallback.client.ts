/**
 * Several historic CMS records point at a retired Cloudinary account. Rather
 * than exposing broken-image icons across the admin, replace any failed image
 * with a branded placeholder while the content team re-uploads the asset.
 */
export default defineNuxtPlugin(() => {
  const placeholder =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#eff6fb"/>
            <stop offset="1" stop-color="#dceaf4"/>
          </linearGradient>
        </defs>
        <rect width="640" height="420" fill="url(#g)"/>
        <circle cx="320" cy="192" r="46" fill="#27628c" opacity=".12"/>
        <path d="M296 214l18-22 14 16 12-14 24 30h-68z" fill="#27628c" opacity=".55"/>
        <circle cx="306" cy="180" r="7" fill="#27628c" opacity=".55"/>
        <text x="320" y="290" text-anchor="middle" font-family="Satoshi, sans-serif" font-size="18" font-weight="600" fill="#27628c">MedLabConvo</text>
        <text x="320" y="314" text-anchor="middle" font-family="Satoshi, sans-serif" font-size="11" letter-spacing="2" fill="#6b8192">IMAGE UNAVAILABLE</text>
      </svg>`,
    )

  document.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLImageElement | null
      if (!target || target.tagName !== 'IMG') return
      if (target.dataset.mcFallback === 'true') return
      target.dataset.mcFallback = 'true'
      target.classList.add('mc-img-fallback')
      target.src = placeholder
    },
    true,
  )
})
