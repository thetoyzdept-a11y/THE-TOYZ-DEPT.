import fs from "fs";
import path from "path";

const products = [
  {
    name: "dragon-1.svg",
    title: "CYBER DRAGON",
    subtitle: "48-SEGMENT FLUID MECHANICAL",
    accent: "#D9FF43",
    icon: `<path d="M120 280 C160 220, 200 320, 260 260 C320 200, 360 300, 420 240 C460 200, 500 220, 520 180" stroke="#191919" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="520" cy="180" r="16" fill="#FF694B"/><polygon points="500,160 540,150 520,190" fill="#191919"/><path d="M160 245 L170 210 L190 230" fill="#D9FF43" stroke="#191919" stroke-width="4"/><path d="M260 255 L280 215 L300 240" fill="#D9FF43" stroke="#191919" stroke-width="4"/><path d="M360 265 L380 220 L400 245" fill="#D9FF43" stroke="#191919" stroke-width="4"/>`
  },
  {
    name: "dragon-2.svg",
    title: "DRAGON SCALES",
    subtitle: "DETAIL INTERLOCK 0.12MM",
    accent: "#FF694B",
    icon: `<g transform="translate(180, 160)"><polygon points="120,40 180,80 120,120 60,80" fill="#D9FF43" stroke="#191919" stroke-width="6"/><polygon points="120,120 180,160 120,200 60,160" fill="#FF694B" stroke="#191919" stroke-width="6"/><polygon points="60,80 120,120 60,160 0,120" fill="#F5F1E8" stroke="#191919" stroke-width="6"/><polygon points="180,80 240,120 180,160 120,120" fill="#191919" stroke="#191919" stroke-width="6"/></g>`
  },
  {
    name: "rex-1.svg",
    title: "MECHA FLEXI REX",
    subtitle: "NEO-INDUSTRIAL DESK TYRANT",
    accent: "#D9FF43",
    icon: `<g transform="translate(160, 140)"><path d="M80 200 L120 200 L140 160 L180 150 L200 110 L260 110 L280 140 L300 140 L300 170 L260 180 L220 190 L200 240 L160 240 L140 210 L100 240 Z" fill="#191919" stroke="#191919" stroke-width="6"/><circle cx="270" cy="130" r="6" fill="#D9FF43"/><rect x="180" y="240" width="24" height="40" fill="#191919"/><rect x="120" y="240" width="24" height="40" fill="#191919"/><line x1="160" y1="160" x2="220" y2="160" stroke="#D9FF43" stroke-width="4"/></g>`
  },
  {
    name: "serpent-1.svg",
    title: "CRYSTAL SERPENT",
    subtitle: "60CM GEOMETRIC WRAP",
    accent: "#FF694B",
    icon: `<g transform="translate(150, 130)"><path d="M60 220 Q180 80 240 200 T400 180" fill="none" stroke="#191919" stroke-width="14"/><polygon points="390,165 420,180 390,195" fill="#FF694B" stroke="#191919" stroke-width="4"/><circle cx="160" cy="140" r="12" fill="#D9FF43" stroke="#191919" stroke-width="4"/><circle cx="280" cy="210" r="12" fill="#D9FF43" stroke="#191919" stroke-width="4"/><circle cx="340" cy="160" r="12" fill="#D9FF43" stroke="#191919" stroke-width="4"/></g>`
  },
  {
    name: "planter-1.svg",
    title: "BRUTALIST PLANTER",
    subtitle: "ARCHITECTURAL DRAINAGE HUB",
    accent: "#D9FF43",
    icon: `<g transform="translate(180, 130)"><polygon points="120,40 220,100 220,240 120,300 20,240 20,100" fill="#E8E2D5" stroke="#191919" stroke-width="8"/><polygon points="120,40 220,100 120,160 20,100" fill="#FAF7F2" stroke="#191919" stroke-width="6"/><path d="M120 70 Q100 20 120 -10 Q140 20 120 70" fill="#D9FF43" stroke="#191919" stroke-width="4"/><path d="M100 80 Q70 40 80 10 Q105 45 100 80" fill="#D9FF43" stroke="#191919" stroke-width="4"/></g>`
  },
  {
    name: "dock-1.svg",
    title: "CABLE DOCK",
    subtitle: "5-CHANNEL MAGNETIC CONDUIT",
    accent: "#FF694B",
    icon: `<g transform="translate(140, 160)"><rect x="40" y="80" width="280" height="80" fill="#191919" rx="8" stroke="#191919" stroke-width="6"/><circle cx="80" cy="120" r="14" fill="#D9FF43"/><circle cx="130" cy="120" r="14" fill="#F5F1E8"/><circle cx="180" cy="120" r="14" fill="#FF694B"/><circle cx="230" cy="120" r="14" fill="#F5F1E8"/><circle cx="280" cy="120" r="14" fill="#D9FF43"/></g>`
  },
  {
    name: "stand-1.svg",
    title: "ISOMETRIC STAND",
    subtitle: "HEADPHONE REST APEX",
    accent: "#D9FF43",
    icon: `<g transform="translate(190, 110)"><path d="M110 30 Q110 10 70 10 Q30 10 30 30 L50 260 L90 260 Z" fill="#191919" stroke="#191919" stroke-width="6"/><ellipse cx="70" cy="30" rx="60" ry="20" fill="none" stroke="#FF694B" stroke-width="8"/><rect x="10" y="260" width="120" height="30" fill="#D9FF43" stroke="#191919" stroke-width="6"/></g>`
  },
  {
    name: "mount-1.svg",
    title: "MAGNETIC MOUNTS",
    subtitle: "HEXAGONAL TRIO WALL SYSTEM",
    accent: "#D9FF43",
    icon: `<g transform="translate(160, 120)"><polygon points="90,40 140,70 140,130 90,160 40,130 40,70" fill="#191919" stroke="#191919" stroke-width="6"/><polygon points="190,40 240,70 240,130 190,160 140,130 140,70" fill="#D9FF43" stroke="#191919" stroke-width="6"/><polygon points="140,130 190,160 190,220 140,250 90,220 90,160" fill="#FF694B" stroke="#191919" stroke-width="6"/><circle cx="90" cy="100" r="12" fill="#F5F1E8"/><circle cx="190" cy="100" r="12" fill="#191919"/><circle cx="140" cy="190" r="12" fill="#F5F1E8"/></g>`
  },
  {
    name: "cube-1.svg",
    title: "GEAR CUBE",
    subtitle: "SYNCHRONOUS HELICAL FOCUS",
    accent: "#FF694B",
    icon: `<g transform="translate(170, 120)"><rect x="50" y="50" width="160" height="160" fill="#F5F1E8" stroke="#191919" stroke-width="8"/><circle cx="130" cy="130" r="50" fill="#D9FF43" stroke="#191919" stroke-width="6"/><circle cx="130" cy="130" r="20" fill="#191919"/><path d="M130 70 L130 60 M130 190 L130 200 M70 130 L60 130 M190 130 L200 130" stroke="#FF694B" stroke-width="12" stroke-linecap="round"/></g>`
  },
  {
    name: "wolf-1.svg",
    title: "POLYGON WOLF",
    subtitle: "182-FACET TROPHY MONOLITH",
    accent: "#D9FF43",
    icon: `<g transform="translate(170, 110)"><polygon points="130,20 80,70 100,140 50,180 80,240 130,260 180,240 210,180 160,140 180,70" fill="#191919" stroke="#191919" stroke-width="6"/><polygon points="130,20 100,140 130,170" fill="#252525" stroke="#F5F1E8" stroke-width="2"/><polygon points="130,20 160,140 130,170" fill="#404040" stroke="#F5F1E8" stroke-width="2"/><polygon points="130,170 80,240 130,260" fill="#191919" stroke="#D9FF43" stroke-width="2"/><polygon points="130,170 180,240 130,260" fill="#252525" stroke="#D9FF43" stroke-width="2"/></g>`
  },
  {
    name: "caddy-1.svg",
    title: "BAUHAUS CADDY",
    subtitle: "STAGGERED VESSEL INDUSTRIAL",
    accent: "#D9FF43",
    icon: `<g transform="translate(160, 120)"><rect x="40" y="80" width="50" height="160" fill="#191919" stroke="#191919" stroke-width="6"/><rect x="100" y="40" width="60" height="200" fill="#D9FF43" stroke="#191919" stroke-width="6"/><rect x="170" y="110" width="50" height="130" fill="#FF694B" stroke="#191919" stroke-width="6"/><rect x="230" y="70" width="50" height="170" fill="#FAF7F2" stroke="#191919" stroke-width="6"/></g>`
  }
];

fs.mkdirSync("public/images/products", { recursive: true });

for (const p of products) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <rect width="600" height="600" fill="#F5F1E8"/>
  <rect x="24" y="24" width="552" height="552" fill="#FAF7F2" stroke="#191919" stroke-width="4"/>
  <defs>
    <pattern id="grid-${p.name}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#191919" stroke-width="0.5" stroke-opacity="0.08"/>
    </pattern>
  </defs>
  <rect x="24" y="24" width="552" height="552" fill="url(#grid-${p.name})"/>
  <rect x="24" y="24" width="552" height="48" fill="#191919"/>
  <text x="44" y="54" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#D9FF43" letter-spacing="2">THE TOYZ DEPT. // SPEC 3D</text>
  <rect x="510" y="38" width="46" height="20" fill="#FF694B" rx="2"/>
  <text x="533" y="52" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#FFFFFF" text-anchor="middle">REV.A</text>
  ${p.icon}
  <rect x="40" y="470" width="12" height="12" fill="#D9FF43" stroke="#191919" stroke-width="2"/>
  <rect x="548" y="470" width="12" height="12" fill="#FF694B" stroke="#191919" stroke-width="2"/>
  <rect x="24" y="496" width="552" height="80" fill="#191919"/>
  <text x="44" y="534" font-family="'Space Grotesk', sans-serif" font-size="22" font-weight="700" fill="#F5F1E8" letter-spacing="1">${p.title}</text>
  <text x="44" y="558" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="500" fill="#D9FF43" letter-spacing="1.5">${p.subtitle}</text>
  <circle cx="536" cy="536" r="16" fill="#D9FF43"/>
  <path d="M 530 536 L 542 536 M 536 530 L 536 542" stroke="#191919" stroke-width="3"/>
</svg>`;

  fs.writeFileSync(path.join("public/images/products", p.name), svg);
}

console.log("Successfully generated", products.length, "branded product SVGs");
