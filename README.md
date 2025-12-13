# Dark Matter Site

![Dark Matter Trademark](https://ik.imagekit.io/xvpgfijuw/Dark-Matter-Embeds/trademark__Dark-Matter--Dark-Mode.svg)

## Version 0.1.0 as of December 13, 2025
Includes confidential access, Level 1, as well as portfolio and pipeline pages with Markdown rendering of investment memos.

<p align="center">
  <span style="font-size: 18px; font-weight: 500; color: #374151;">A modern web application built with</span>
  <span style="font-size: 20px; color: #ef4444; margin: 0 4px;">❤️</span>
  <span style="font-size: 18px; font-weight: 500; color: #374151;">by</span>
  <br/>
  <a href="https://lossless.group" target="_blank" rel="noopener" style="text-decoration: none; display: inline-flex; align-items: center; margin: 8px 0;">
    <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__The-Lossless-Group.svg?updatedAt=1758016855404" alt="The Lossless Group" height="24" style="margin-right: 8px;" />
    <span style="font-size: 22px; font-weight: 600; color: #1f2937;">The Lossless Group</span>
  </a>
  <br/>
  <span style="font-size: 14px; color: #6b7280; margin-top: 12px; display: block;">
    SSG and Styles with 
    <a href="https://astro.build" style="color: #7c3aed; text-decoration: none; font-weight: 500;">Astro</a> 
    and 
    <a href="https://tailwindcss.com" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">Tailwind CSS v4</a> 
    for <a href="https://darkmatter.bio/" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">Dark Matter Bio</a>
  </span>
</p>


# Stack

<p align="center">
  <a href="https://astro.build" target="_blank" rel="noopener">
    <img src="https://astro.build/assets/press/astro-logo-light-gradient.png" alt="Astro" height="48" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://revealjs.com" target="_blank" rel="noopener">
    <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__Reveal--SizeMod--Light.svg?updatedAt=1758016291602" alt="RevealJS" height="48" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tailwindcss.com" target="_blank" rel="noopener">
    <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__TailwindCSS--Lighter.webp?updatedAt=1758016076289" height="42" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://threejs.org" target="_blank" rel="noopener">
    <img src="https://threejs.org/files/favicon.ico" alt="Three.js" height="48" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://vitest.dev" target="_blank" rel="noopener">
    <span style="display:inline-flex;align-items:center;gap:8px">
      <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__Vitest.webp?updatedAt=1758016614303" alt="Vitest" height="48" />
    </span>
  </a>
</p>

<p align="center">
  Modern site generation, presentations, styling, testing, and 3D graphics.
</p>

---

## 🌐 Three.js for WebGL Graphics

This site uses [Three.js](https://threejs.org) for hardware-accelerated 3D graphics and particle systems. Three.js provides:

- **WebGL Abstraction** — Write high-level JavaScript instead of raw WebGL shaders
- **Particle Systems** — Create thousands of animated points with custom behaviors
- **Custom Shaders** — GLSL vertex and fragment shaders for unique visual effects
- **Performance** — GPU-accelerated rendering runs smoothly even with complex scenes
- **Cross-Platform** — Works on desktop and mobile browsers with WebGL support

### Current Components

**`ImageAbstract--Orb--Half.astro`** — A signature particle sphere based on Dark Matter brand assets:
- ~8000 particles distributed using golden spiral algorithm
- Central void/eye cutout creating an almond-shaped hole
- Custom shaders for soft circular particles with depth-based transparency
- Subtle rotation animation with configurable speed
- Additive blending for glowing effect

```astro
<ImageAbstractOrb
  size="400px"
  color="#9C85DF"
  rotationSpeed={0.3}
/>
```

### Future Possibilities

Three.js opens the door to:
- Interactive data visualizations
- Animated backgrounds and hero sections
- 3D product showcases
- Particle-based transitions between pages
- Scroll-driven 3D animations

---

## 📝 Changelog as Git Submodule

The `changelog/` directory is managed as a **separate git repository** (submodule), enabling:

- **Independent Version Control** — Changelog history is tracked separately from site code
- **Cross-Repository Collaboration** — Team members can update the changelog without touching the main codebase
- **Selective Sharing** — The changelog can be shared with stakeholders who don't need access to source code
- **Clean Commit History** — Documentation changes don't clutter the main repository's git log
- **Reusability** — The same changelog can be mounted in multiple projects or documentation sites

The changelog is also registered as an **Astro content collection** using a `glob` loader that points outside `src/`:

```ts
// src/content/changelog/changelog.config.ts
loader: glob({
  pattern: '**/*.md',
  base: '../../changelog',
}),
```

This allows changelog entries to be queried and rendered as pages while keeping the content in its own repository.

---

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more about Astro?

Feel free to check out [Astro Documentation](https://docs.astro.build) or jump into the Astro [Discord server](https://astro.build/chat).
