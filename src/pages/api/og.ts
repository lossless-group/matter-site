/**
 * Dynamic OG Image Generation Endpoint
 *
 * Generates Open Graph images on-demand using satori + resvg.
 * Follows the GitHub-style approach: branded template + dynamic text.
 *
 * Usage: /api/og?title=My+Title&description=My+description&category=Blog
 *
 * See: context-v/Maintain-an-Elegant-Open-Graph-System.md
 */

import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Font loading - bundled Inter font (TTF format required by satori)
let fontDataCache: Buffer | null = null;

async function loadFont(): Promise<Buffer> {
  if (fontDataCache) return fontDataCache;

  // Try multiple paths for dev vs production environments
  const possiblePaths = [
    // Development: relative to project root
    join(process.cwd(), 'public/fonts/Inter/static/Inter_24pt-Bold.ttf'),
    // Vercel production: static files
    join(process.cwd(), '.vercel/output/static/fonts/Inter/static/Inter_24pt-Bold.ttf'),
    // Alternative production path
    join(process.cwd(), 'dist/client/fonts/Inter/static/Inter_24pt-Bold.ttf'),
  ];

  for (const fontPath of possiblePaths) {
    try {
      fontDataCache = await readFile(fontPath);
      console.log(`[og] Loaded font from: ${fontPath}`);
      return fontDataCache;
    } catch {
      // Try next path
    }
  }

  throw new Error(`Could not find font file. Tried: ${possiblePaths.join(', ')}`);
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);

    // Extract params with sensible defaults
    const title = url.searchParams.get('title') ?? 'Dark Matter';
    const description = url.searchParams.get('description') ?? '';
    const category = url.searchParams.get('category') ?? '';
    const author = url.searchParams.get('author') ?? '';
    const date = url.searchParams.get('date') ?? '';

    // Truncate for safety
    const truncatedTitle = title.length > 80 ? title.slice(0, 77) + '...' : title;
    const truncatedDesc = description.length > 120 ? description.slice(0, 117) + '...' : description;

    // Load font
    const fontData = await loadFont();

    // Build the element tree using plain objects (no JSX needed)
    const element = {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          backgroundColor: '#0f0f23',
          color: '#f8fafc',
          fontFamily: 'Inter',
        },
        children: [
          // Header: Logo placeholder + Site Name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
              },
              children: [
                // Logo placeholder (triangle shape like Dark Matter brand)
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#6366f1',
                      borderRadius: '8px',
                    },
                  },
                },
                // Site name
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: '#94a3b8',
                    },
                    children: 'darkmatter.bio',
                  },
                },
              ],
            },
          },
          // Main Content Card
          {
            type: 'div',
            props: {
              style: {
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '40px',
                backgroundColor: '#1e1e3f',
                borderRadius: '16px',
                border: '1px solid #334155',
              },
              children: [
                // Category Badge (if provided)
                ...(category
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginBottom: '20px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                padding: '6px 16px',
                                backgroundColor: '#6366f1',
                                borderRadius: '9999px',
                                fontSize: '14px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              },
                              children: category,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: truncatedTitle.length > 50 ? '42px' : '56px',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      margin: 0,
                      marginBottom: truncatedDesc ? '20px' : '0',
                    },
                    children: truncatedTitle,
                  },
                },
                // Description (if provided)
                ...(truncatedDesc
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '24px',
                            color: '#94a3b8',
                            lineHeight: 1.4,
                            margin: 0,
                          },
                          children: truncatedDesc,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Footer: Author, Date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '30px',
              },
              children: [
                // Author and date
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '16px',
                      fontSize: '18px',
                      color: '#64748b',
                    },
                    children: [author, author && date ? ' · ' : '', date].filter(Boolean).join(''),
                  },
                },
                // Tagline
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '16px',
                      color: '#475569',
                    },
                    children: 'Bio Longevity Fund',
                  },
                },
              ],
            },
          },
        ],
      },
    };

    // Generate SVG with satori
    const svg = await satori(element as any, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    });

    // Convert SVG to PNG using resvg
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Return PNG with appropriate headers
    return new Response(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('OG Image generation failed:', error);

    // Return a fallback response
    return new Response(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};
