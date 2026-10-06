import { numericPrice } from '@/lib/wines';
export function useWineSeo(title, description, product) {
  const route = useRoute();
  const config = useRuntimeConfig().public;
  const get = value => typeof value === 'function' ? value() : value;
  useHead(() => {
    const wine = product ? get(product) : null;
    const name = get(title);
    const summary = get(description);
    const url = `${config.siteUrl.replace(/\/$/, '')}${route.path}`;
    const image = wine?.main_variant_image?.[0];
    let price;
    try { price = numericPrice(wine?.variant_price); } catch { price = undefined; }
    const data = wine?.id ? {
      '@context': 'https://schema.org', '@type': 'Product', name: wine.product_name, description: summary,
      image: image ? [image] : [], brand: { '@type': 'Brand', name: wine.product_bodega || 'Inquieto' },
      offers: { '@type': 'Offer', priceCurrency: config.currency, price, availability: wine.stock !== false && wine.inventory_units !== 0 && !wine.archived ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url },
    } : null;
    return {
      title: name,
      meta: [{ name: 'description', content: summary }, { property: 'og:title', content: name }, { property: 'og:description', content: summary }, { property: 'og:url', content: url }, { name: 'twitter:title', content: name }, { name: 'twitter:description', content: summary }, ...(image ? [{ property: 'og:image', content: image }] : [])],
      link: [{ rel: 'canonical', href: url }],
      script: data ? [{ key: 'product-jsonld', type: 'application/ld+json', innerHTML: JSON.stringify(data).replace(/</g, '\\u003c') }] : [],
    };
  });
}
