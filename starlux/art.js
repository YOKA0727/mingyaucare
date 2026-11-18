/* 老大航班：自繪插圖庫（平塗＋3px 墨灰線，星宇色系柔和版）
   - 國家小圖示：iconSvg(國家)
   - 城市橫幅：bannerSvg(機場代碼)；沒有專屬橫幅的城市，改用所屬國家的圖案 */
(() => {
'use strict';
const INK = '#404B4E', PAPER = '#FFFCF6', CU = '#C49A7E', GD = '#E3D3A6', MZ = '#C3DCE4', GR = '#C9D5AC', CO = '#F2A497', GY = '#C3CBCD', CUD = '#90664D';
const g = inner => `<g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;

/* ---------- 共用小物 ---------- */
const CLOUD = `<symbol id="cloud" viewBox="0 0 70 34"><path d="M12 30 a10 10 0 0 1 2-19 a13 13 0 0 1 24-4 a11 11 0 0 1 19 8 a8 8 0 0 1 1 15Z" fill="${PAPER}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></symbol>`;
const PLANE = `<symbol id="plane" viewBox="0 0 64 40">${g(`
  <path d="M6 22 C6 16 12 14 20 14 H50 C57 14 61 18 61 21 C61 24 57 27 50 27 H20 C12 27 6 26 6 22Z" fill="${PAPER}"/>
  <path d="M28 14 L22 3 H30 L40 14Z" fill="${CU}"/><path d="M30 27 L24 37 H32 L41 27Z" fill="${CU}"/>
  <path d="M8 20 L4 10 H10 L16 15" fill="${CU}"/>
  <circle cx="44" cy="20.5" r="2.2" fill="${MZ}" stroke-width="2"/><circle cx="36" cy="20.5" r="2.2" fill="${MZ}" stroke-width="2"/>`)}</symbol>`;
const palm = (x, base, h, lean = 0) => `
  <path d="M${x} ${base} C${x+2} ${base-h*.4} ${x+4+lean} ${base-h*.75} ${x+lean} ${base-h}" fill="none" stroke-width="5"/>
  <path d="M${x+lean} ${base-h} C${x+lean-10} ${base-h-10} ${x+lean-20} ${base-h-6} ${x+lean-24} ${base-h+2} C${x+lean-14} ${base-h-2} ${x+lean-6} ${base-h} ${x+lean} ${base-h}Z" fill="${GR}"/>
  <path d="M${x+lean} ${base-h} C${x+lean+10} ${base-h-12} ${x+lean+22} ${base-h-8} ${x+lean+26} ${base-h} C${x+lean+16} ${base-h-4} ${x+lean+8} ${base-h-2} ${x+lean} ${base-h}Z" fill="${GR}"/>
  <path d="M${x+lean} ${base-h} C${x+lean-4} ${base-h-14} ${x+lean+2} ${base-h-22} ${x+lean+10} ${base-h-22} C${x+lean+4} ${base-h-16} ${x+lean+2} ${base-h-8} ${x+lean} ${base-h}Z" fill="${GR}"/>`;
const tree = (x, base, r) => `<path d="M${x} ${base} V${base-r}" stroke-width="3"/><circle cx="${x}" cy="${base-r-r*.6}" r="${r}" fill="${GR}"/>`;
const waves = (y, x0 = 0, x1 = 340, step = 20) => { let d = `M${x0} ${y}`; for (let x = x0; x < x1; x += step) d += ` q${step/4} -4 ${step/2} 0 t${step/2} 0`; return `<path d="${d}" fill="none" stroke-width="2.5"/>`; };

/* ---------- 國家圖案（100×100，地面在 y=90） ---------- */
const M = {
  tw: g(`
    <rect x="41" y="72" width="18" height="18" fill="${PAPER}"/>
    ${[0,1,2,3,4,5].map(i => { const yb = 72 - 9*i, yt = yb - 9; return `<path d="M42 ${yb} L38 ${yt} H62 L58 ${yb}Z" fill="${PAPER}"/>`; }).join('')}
    <rect x="44" y="12" width="12" height="6" fill="${GD}"/><path d="M50 12 V3"/>
    <path d="M45 80 h10" stroke-width="2.5"/>`),
  jp: g(`
    <circle cx="76" cy="26" r="11" fill="${CO}"/>
    <path d="M6 90 L40 38 H60 L94 90Z" fill="${MZ}"/>
    <path d="M40 38 H60 L68 50 L61 47 L55 53 L49 47 L42 52 L33 49Z" fill="${PAPER}"/>
    <path d="M13 70 H37 M16 76 H34 M19 70 V90 M31 70 V90" stroke="${CO}" stroke-width="4"/>
    <path d="M13 70 H37 M16 76 H34 M19 70 V90 M31 70 V90" stroke-width="1" opacity=".0"/>`),
  kr: g(`
    <path d="M2 90 Q50 52 98 90Z" fill="${GR}"/>
    <rect x="46" y="30" width="8" height="40" fill="${PAPER}"/>
    <ellipse cx="50" cy="32" rx="13" ry="6" fill="${PAPER}"/>
    <path d="M44 26 H56 L54 20 H46Z" fill="${CO}"/><path d="M50 20 V6"/>`),
  hk: g(`
    <path d="M8 62 V40 H18 V62 M22 62 V24 H32 V62 M68 62 V32 H78 V62 M82 62 V44 H92 V62" fill="${PAPER}"/>
    <path d="M-2 66 H102 V102 H-2Z" fill="${MZ}"/>
    <path d="M30 72 H76 L68 84 H38Z" fill="${GD}"/><path d="M52 72 V22"/>
    <path d="M52 26 C40 34 36 52 38 70 H52Z" fill="${CU}"/><path d="M52 34 C62 42 66 56 64 70 H52Z" fill="${CU}"/>
    <path d="M39 40 H52 M38 50 H52 M38 60 H52 M52 46 H62 M52 58 H65" stroke-width="2"/>
    <path d="M4 92 q8 -5 16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke-width="2.5"/>`),
  mo: g(`
    <path d="M24 90 V42 H76 V90Z" fill="${GD}"/>
    <path d="M30 42 L50 22 L70 42Z" fill="${GD}"/><path d="M50 22 V12 M45 16 H55"/>
    <path d="M32 90 V78 a6 6 0 0 1 12 0 V90 M56 90 V78 a6 6 0 0 1 12 0 V90" fill="${PAPER}"/>
    <path d="M45 90 V74 a5 5 0 0 1 10 0 V90" fill="${PAPER}"/>
    <path d="M34 62 v-6 a4 4 0 0 1 8 0 v6Z M58 62 v-6 a4 4 0 0 1 8 0 v6Z M46 60 v-6 a4 4 0 0 1 8 0 v6Z" fill="${PAPER}" stroke-width="2.5"/>
    <circle cx="50" cy="34" r="3.5" fill="${PAPER}" stroke-width="2.5"/>`),
  vn: g(`
    <path d="M8 4 Q30 14 52 6" fill="none"/>
    <path d="M22 9 V16"/><ellipse cx="22" cy="25" rx="8" ry="9" fill="${CO}"/><path d="M17 34 H27 M22 34 V40"/>
    <path d="M42 7 V12"/><ellipse cx="42" cy="20" rx="7" ry="8" fill="${GD}"/><path d="M38 28 H46 M42 28 V33"/>
    <path d="M14 82 L54 44 L94 82 Q54 94 14 82Z" fill="${GD}"/>
    <path d="M54 44 L34 86 M54 44 L54 90 M54 44 L74 86" stroke-width="2"/>`),
  ph: g(`
    <path d="M10 82 V56 Q10 50 16 50 H74 Q82 50 86 58 L92 70 V82Z" fill="${GD}"/>
    <path d="M14 50 V44 H80 V50" fill="${PAPER}"/>
    <path d="M10 66 H92" stroke="${CO}" stroke-width="5"/><path d="M10 66 H92" stroke-width="1.5"/>
    <path d="M18 56 H34 V62 H18Z M40 56 H56 V62 H40Z M62 56 H76 V62 H62Z" fill="${MZ}" stroke-width="2.5"/>
    <circle cx="26" cy="84" r="7" fill="${PAPER}"/><circle cx="74" cy="84" r="7" fill="${PAPER}"/>
    <path d="M86 46 l4 -6 M80 44 l2 -7" stroke-width="2.5"/>`),
  th: g(`
    <path d="M28 90 V78 H72 V90Z" fill="${PAPER}"/>
    <path d="M32 78 L36 62 H64 L68 78Z" fill="${GD}"/>
    <path d="M38 62 L41 48 H59 L62 62Z" fill="${PAPER}"/>
    <path d="M43 48 L45 36 H55 L57 48Z" fill="${GD}"/>
    <path d="M46 36 L50 14 L54 36Z" fill="${PAPER}"/><path d="M50 14 V6"/>
    <path d="M44 90 V84 a6 6 0 0 1 12 0 V90" fill="${CU}" stroke-width="2.5"/>`),
  sg: g(`
    <path d="M18 90 L20 36 H30 L30 90Z M45 90 L46 36 H56 L55 90Z M70 90 L70 36 H80 L82 90Z" fill="${PAPER}"/>
    <path d="M8 30 H94 Q90 37 84 37 H16 Q10 36 8 30Z" fill="${CU}"/>
    <path d="M-2 90 H102 V102 H-2Z" fill="${MZ}"/>`),
  my: g(`
    <path d="M26 90 V34 H42 V90Z M58 90 V34 H74 V90Z" fill="${PAPER}"/>
    <path d="M28 34 V24 H40 V34 M60 34 V24 H72 V34" fill="${PAPER}"/>
    <path d="M30 24 V16 H38 V24 M62 24 V16 H70 V24" fill="${GD}"/>
    <path d="M34 16 V4 M66 16 V4"/>
    <path d="M42 52 H58 V57 H42Z" fill="${GD}"/>
    <path d="M30 46 h8 M30 60 h8 M30 74 h8 M62 46 h8 M62 60 h8 M62 74 h8" stroke-width="2"/>`),
  id: g(`
    <path d="M12 90 V64 H18 V52 H24 V40 H30 V28 H40 V90Z" fill="${CU}"/>
    <path d="M88 90 V64 H82 V52 H76 V40 H70 V28 H60 V90Z" fill="${CU}"/>
    <path d="M30 28 V18 H36 V28 M64 28 V18 H70 V28" fill="${GD}"/>
    <path d="M40 90 H60" stroke-width="3"/><path d="M14 76 h24 M62 76 h24" stroke-width="2"/>`),
  us: g(`
    <circle cx="68" cy="62" r="18" fill="${CO}"/>
    <path d="M-2 68 H102 V102 H-2Z" fill="${MZ}"/>
    <path d="M8 80 q8 -5 16 0 M60 86 q8 -5 16 0" fill="none" stroke-width="2.5"/>
    ${palm(30, 92, 56)}`),
  cz: g(`
    <path d="M26 90 V46 H44 V90 M56 90 V46 H74 V90" fill="${PAPER}"/>
    <path d="M44 90 V62 H56 V90" fill="${PAPER}"/>
    <path d="M24 46 L35 12 L46 46Z M54 46 L65 12 L76 46Z" fill="${CU}"/>
    <path d="M35 12 V6 M65 12 V6"/>
    <circle cx="35" cy="58" r="4" fill="${GD}" stroke-width="2.5"/><circle cx="65" cy="58" r="4" fill="${GD}" stroke-width="2.5"/>
    <path d="M48 90 V78 a2 2 0 0 1 4 0 V90" fill="${GD}" stroke-width="2.5"/>`),
  other: g(`
    <circle cx="50" cy="52" r="32" fill="${MZ}"/>
    <path d="M30 34 q10 -6 18 2 q4 8 -4 12 q-8 2 -10 10 q-6 -4 -8 -12 q0 -8 4 -12Z M58 58 q10 -4 16 4 q0 10 -10 14 q-8 -4 -6 -18Z" fill="${GR}" stroke-width="2.5"/>
    <path d="M18 52 H82 M50 20 Q36 52 50 84 M50 20 Q64 52 50 84" fill="none" stroke-width="1.8" opacity=".5"/>`),
};

/* ---------- 城市橫幅（340×120，地面在 y=100；天空、太陽、雲、地面由外框畫） ---------- */
const B = {
  tyo: g(`
    <path d="M6 100 L66 42 H90 L150 100Z" fill="${MZ}"/>
    <path d="M66 42 H90 L100 54 L91 51 L84 58 L77 51 L70 57 L58 53Z" fill="${PAPER}"/>
    <path d="M206 100 L226 40 H234 L254 100Z" fill="${CO}"/>
    <path d="M220 100 L230 74 L240 100Z" fill="${PAPER}"/>
    <rect x="218" y="62" width="24" height="6" fill="${PAPER}"/><rect x="224" y="40" width="12" height="6" fill="${PAPER}"/>
    <path d="M226 40 L229 22 H231 L234 40Z" fill="${CO}"/><path d="M230 22 V8"/>
    <path d="M268 100 V78 H288 V100 M290 100 V68 H306 V100" fill="${PAPER}"/><path d="M160 100 V82 H180 V100" fill="${GD}"/>`),
  kix: g(`
    ${tree(70, 100, 14)}${tree(276, 100, 16)}
    <path d="M118 100 L128 78 H212 L222 100Z" fill="${GY}"/>
    <rect x="136" y="64" width="68" height="14" fill="${PAPER}"/>
    <path d="M126 66 L142 56 H198 L214 66Z" fill="${GR}"/>
    <rect x="146" y="46" width="48" height="10" fill="${PAPER}"/>
    <path d="M136 48 L150 38 H190 L204 48Z" fill="${GR}"/>
    <rect x="154" y="28" width="32" height="10" fill="${PAPER}"/>
    <path d="M144 30 L158 18 H182 L196 30Z" fill="${GR}"/>
    <circle cx="158" cy="17" r="2.5" fill="${GD}" stroke-width="2"/><circle cx="182" cy="17" r="2.5" fill="${GD}" stroke-width="2"/>
    <path d="M150 72 h6 M168 72 h6 M186 72 h6" stroke-width="2"/>`),
  cts: g(`
    <path d="M-3 100 H343 V123 H-3Z" fill="${PAPER}"/>
    <rect x="110" y="66" width="120" height="34" fill="${PAPER}"/>
    <path d="M104 68 L170 44 L236 68Z" fill="${CO}"/>
    <rect x="152" y="26" width="36" height="30" fill="${PAPER}"/>
    <circle cx="170" cy="40" r="9" fill="${PAPER}" stroke-width="2.5"/><path d="M170 35 V40 H174" stroke-width="2"/>
    <path d="M148 28 L170 10 L192 28Z" fill="${CO}"/>
    <path d="M126 80 h14 v12 h-14Z M200 80 h14 v12 h-14Z" fill="${MZ}" stroke-width="2.5"/>
    <path d="M162 100 V84 h16 V100" fill="${GD}" stroke-width="2.5"/>
    <circle cx="280" cy="88" r="12" fill="${PAPER}"/><circle cx="280" cy="68" r="9" fill="${PAPER}"/>
    <path d="M272 62 H288 L285 54 H275Z" fill="${CO}" stroke-width="2.5"/>
    <path d="M40 30 l6 6 m0 -6 l-6 6 M70 54 l5 5 m0 -5 l-5 5 M250 30 l5 5 m0 -5 l-5 5 M310 50 l5 5 m0 -5 l-5 5" stroke-width="2"/>`),
  oka: g(`
    <path d="M-3 84 H343 V100 H-3Z" fill="${MZ}"/>
    <path d="M-3 98 H343 V123 H-3Z" fill="${GD}"/>
    ${waves(90, 180, 330, 24)}
    <rect x="60" y="70" width="90" height="28" fill="${PAPER}"/>
    <path d="M48 72 L78 50 H132 L162 72Z" fill="${CO}"/>
    <path d="M60 64 H150 M68 58 H142" stroke-width="2"/>
    <path d="M96 98 V82 h18 V98" fill="${CU}" stroke-width="2.5"/>
    <circle cx="105" cy="43" r="7" fill="${GD}" stroke-width="2.5"/><path d="M99 38 l-3 -5 M111 38 l3 -5" stroke-width="2.5"/>
    ${palm(262, 100, 62, 4)}`),
  hkg: g(`
    <path d="M18 92 V58 H40 V92 M44 92 V44 H62 V92 M66 92 V64 H84 V92 M200 92 V52 H220 V92 M224 92 V40 H244 V92 M290 92 V60 H312 V92" fill="${PAPER}"/>
    <path d="M100 92 V54 H120 V92 M300 92 V74 H330 V92" fill="${GD}"/>
    <path d="M140 92 V30 L156 12 L172 30 V92Z" fill="${MZ}"/>
    <path d="M140 30 L172 60 M172 30 L140 60 M140 60 L172 92 M172 60 L140 92" stroke-width="2"/>
    <path d="M-3 90 H343 V123 H-3Z" fill="${MZ}"/>
    ${waves(110, 0, 120)}
    <path d="M220 100 H272 L262 112 H230Z" fill="${GD}"/><path d="M246 100 V58"/>
    <path d="M246 62 C234 70 230 84 232 98 H246Z" fill="${CU}"/><path d="M246 68 C256 76 260 88 258 98 H246Z" fill="${CU}"/>`),
  mfm: g(`
    ${tree(56, 100, 14)}${tree(290, 100, 14)}
    <path d="M128 100 V42 H212 V100Z" fill="${GD}"/>
    <path d="M136 42 L170 16 L204 42Z" fill="${GD}"/><path d="M170 16 V6 M165 10 H175"/>
    <path d="M138 100 V88 a7 7 0 0 1 14 0 V100 M188 100 V88 a7 7 0 0 1 14 0 V100" fill="${PAPER}"/>
    <path d="M162 100 V84 a8 8 0 0 1 16 0 V100" fill="${PAPER}"/>
    <path d="M142 70 v-6 a4 4 0 0 1 8 0 v6Z M190 70 v-6 a4 4 0 0 1 8 0 v6Z M165 68 v-7 a5 5 0 0 1 10 0 v7Z M150 54 h40" fill="${PAPER}" stroke-width="2.5"/>
    <circle cx="170" cy="32" r="4" fill="${PAPER}" stroke-width="2.5"/>
    <path d="M112 100 H228 V106 H112Z M100 106 H240 V112 H100Z" fill="${GY}" stroke-width="2.5"/>`),
  sgn: g(`
    <path d="M120 100 V62 H220 V100" fill="${GD}"/>
    <path d="M150 62 V34 H190 V62" fill="${GD}"/>
    <path d="M144 34 L170 14 L196 34Z" fill="${CU}"/>
    <circle cx="170" cy="46" r="8" fill="${PAPER}" stroke-width="2.5"/><path d="M170 41 V46 H174" stroke-width="2"/>
    <path d="M160 100 V84 a10 10 0 0 1 20 0 V100" fill="${PAPER}"/>
    <path d="M130 74 h14 M196 74 h14 M130 88 h14 M196 88 h14" stroke-width="2.5"/>
    ${palm(262, 100, 50, 0)}
    <circle cx="44" cy="102" r="9" fill="${PAPER}"/><circle cx="92" cy="102" r="9" fill="${PAPER}"/>
    <path d="M40 96 H72 C80 96 84 90 84 84 L92 84 L96 98" fill="${CO}"/>
    <path d="M56 96 C54 88 60 84 66 84 H76" fill="none"/>
    <path d="M60 84 L63 68 H75 L72 84" fill="${PAPER}"/>
    <circle cx="69" cy="61" r="6" fill="${PAPER}"/>
    <path d="M56 57 L69 42 L82 57 Q69 61 56 57Z" fill="${GD}"/>`),
  han: g(`
    <path d="M-3 84 H343 V123 H-3Z" fill="${MZ}"/>
    ${waves(104, 20, 120)}${waves(108, 230, 330)}
    <ellipse cx="170" cy="88" rx="56" ry="8" fill="${GR}"/>
    <rect x="148" y="62" width="44" height="24" fill="${GD}"/>
    <path d="M156 86 v-10 a4 4 0 0 1 8 0 v10 M176 86 v-10 a4 4 0 0 1 8 0 v10" fill="${PAPER}" stroke-width="2.5"/>
    <rect x="155" y="46" width="30" height="16" fill="${GD}"/>
    <rect x="161" y="34" width="18" height="12" fill="${GD}"/>
    <path d="M158 34 L170 22 L182 34Z" fill="${CU}"/>
    <path d="M64 84 V52" stroke-width="4"/>
    <path d="M40 66 C36 40 54 30 64 30 C74 30 92 40 88 66 C80 60 74 64 72 70 C68 62 60 62 56 70 C54 64 46 60 40 66Z" fill="${GR}"/>
    <path d="M50 52 v10 M64 44 v12 M78 52 v10" stroke-width="2"/>`),
  dad: g(`
    <path d="M-3 64 L60 38 L120 60 L190 34 L260 58 L343 40 V100 H-3Z" fill="${GR}"/>
    <path d="M-3 88 H343 V123 H-3Z" fill="${MZ}"/>
    ${waves(108, 10, 330, 28)}
    <rect x="-3" y="80" width="346" height="8" fill="${GY}"/>
    <path d="M30 80 C60 36 96 36 126 80 C156 36 192 36 222 80 C250 40 280 40 296 62" fill="none" stroke="${INK}" stroke-width="12"/>
    <path d="M30 80 C60 36 96 36 126 80 C156 36 192 36 222 80 C250 40 280 40 296 62" fill="none" stroke="${GD}" stroke-width="6"/>
    <path d="M292 66 L300 50 L316 54 L322 64 L308 62 L300 72Z" fill="${GD}"/>
    <circle cx="308" cy="56" r="1.5" fill="${INK}"/>
    <path d="M80 80 V100 M174 80 V100 M260 80 V100" stroke-width="4"/>`),
  bkk: g(`
    <path d="M70 100 V86 H170 V100Z" fill="${PAPER}"/>
    <path d="M78 86 L86 70 H154 L162 86Z" fill="${GD}"/>
    <path d="M92 70 L98 54 H142 L148 70Z" fill="${PAPER}"/>
    <path d="M104 54 L108 40 H132 L136 54Z" fill="${GD}"/>
    <path d="M110 40 L120 10 L130 40Z" fill="${PAPER}"/><path d="M120 10 V2"/>
    <path d="M104 64 h32 M110 48 h20" stroke-width="2"/>
    <path d="M114 100 V92 a6 6 0 0 1 12 0 V100" fill="${CU}" stroke-width="2.5"/>
    <path d="M222 92 V66 H272 L286 80 V92Z" fill="${CO}"/>
    <path d="M216 66 H276 V60 H216Z" fill="${MZ}"/>
    <path d="M230 70 H250 V80 H230Z" fill="${PAPER}" stroke-width="2.5"/>
    <circle cx="232" cy="96" r="7" fill="${PAPER}"/><circle cx="276" cy="96" r="7" fill="${PAPER}"/>`),
  sin: g(`
    <path d="M-3 92 H343 V123 H-3Z" fill="${MZ}"/>
    ${waves(110, 10, 330)}
    <path d="M110 92 L112 40 H128 L128 92Z M156 92 L157 40 H173 L172 92Z M202 92 L202 40 H218 L220 92Z" fill="${PAPER}"/>
    <path d="M94 32 H236 Q232 41 224 41 H104 Q96 40 94 32Z" fill="${CU}"/>
    <path d="M268 92 L271 62 L256 52 H292 L277 62 L280 92Z" fill="${GR}"/>
    <path d="M300 92 L302 72 L290 64 H322 L310 72 L312 92Z" fill="${CU}"/>
    <path d="M262 56 H286 M294 67 H318" stroke-width="2"/>`),
  kul: g(`
    ${tree(70, 100, 14)}${tree(270, 100, 16)}
    <path d="M136 100 V40 H158 V100Z M182 100 V40 H204 V100Z" fill="${PAPER}"/>
    <path d="M139 40 V28 H155 V40 M185 40 V28 H201 V40" fill="${PAPER}"/>
    <path d="M142 28 V18 H152 V28 M188 28 V18 H198 V28" fill="${GD}"/>
    <path d="M147 18 V4 M193 18 V4"/>
    <path d="M158 60 H182 V66 H158Z" fill="${GD}"/>
    <path d="M141 52 h12 M141 66 h12 M141 80 h12 M187 52 h12 M187 66 h12 M187 80 h12" stroke-width="2"/>`),
  mnl: g(`
    ${palm(58, 100, 56, -4)}${palm(266, 100, 50, -2)}
    <path d="M110 92 V62 Q110 54 118 54 H214 Q224 54 228 64 L236 78 V92Z" fill="${GD}"/>
    <path d="M114 54 V46 H222 V54" fill="${PAPER}"/>
    <path d="M110 74 H236" stroke="${CO}" stroke-width="6"/><path d="M110 74 H236" stroke-width="1.5"/>
    <path d="M120 60 H142 V68 H120Z M150 60 H172 V68 H150Z M180 60 H202 V68 H180Z" fill="${MZ}" stroke-width="2.5"/>
    <circle cx="132" cy="94" r="8" fill="${PAPER}"/><circle cx="214" cy="94" r="8" fill="${PAPER}"/>
    <path d="M228 46 l4 -8 M218 44 l2 -8" stroke-width="2.5"/>`),
  lax: g(`
    <circle cx="200" cy="80" r="30" fill="${CO}"/>
    <path d="M-3 100 V80 C50 62 110 66 160 88 C210 66 280 64 343 82 V100Z" fill="${GR}"/>
    ${palm(60, 100, 70, -6)}${palm(96, 100, 56, 4)}${palm(290, 100, 66, 6)}`),
  sfo: g(`
    <path d="M-3 100 V70 C30 60 60 66 80 80 V100Z" fill="${GR}"/>
    <path d="M-3 92 H343 V123 H-3Z" fill="${MZ}"/>
    ${waves(110, 10, 330)}
    <path d="M20 66 Q66 66 106 24 Q170 82 234 24 Q274 66 320 66" fill="none" stroke="${CO}" stroke-width="3.5"/>
    <rect x="-3" y="76" width="346" height="7" fill="${CO}"/>
    <path d="M100 100 V22 H112 V100 M228 100 V22 H240 V100" fill="${CO}"/>
    <path d="M100 40 H112 M100 58 H112 M228 40 H240 M228 58 H240" stroke-width="2.5"/>
    ${[136,150,164,178,192,206].map(x => `<path d="M${x} 76 V${Math.round(36 + Math.pow((x-170)/64,2)*40)}" stroke-width="1.5"/>`).join('')}`),
  sea: g(`
    <path d="M-3 100 L76 46 L96 42 L116 48 L196 100Z" fill="${MZ}"/>
    <path d="M76 46 L96 42 L116 48 L106 56 L98 52 L90 58 L84 52Z" fill="${PAPER}"/>
    <path d="M216 100 L226 54 M244 100 L234 54 M222 76 H238" stroke-width="4"/>
    <ellipse cx="230" cy="50" rx="28" ry="7" fill="${PAPER}"/>
    <path d="M216 46 Q230 34 244 46" fill="${GD}"/>
    <path d="M230 38 V12"/>
    <path d="M270 100 V74 H292 V100 M296 100 V82 H316 V100" fill="${PAPER}"/>`),
  prg: g(`
    <path d="M222 92 V54 H240 V92 M252 92 V54 H270 V92" fill="${PAPER}"/>
    <path d="M240 92 V68 H252 V92" fill="${PAPER}"/>
    <path d="M220 54 L231 22 L242 54Z M250 54 L261 22 L272 54Z" fill="${CU}"/><path d="M231 22 V16 M261 22 V16"/>
    <path d="M28 82 V40 H56 V82Z" fill="${GD}"/><path d="M24 40 L42 18 L60 40Z" fill="${INK}" stroke-width="2"/>
    <path d="M-3 88 H343 V123 H-3Z" fill="${MZ}"/>
    ${waves(112, 10, 330, 26)}
    <rect x="-3" y="80" width="346" height="22" fill="${GD}"/>
    ${[18,94,170,246].map(x => `<path d="M${x} 102 V96 a26 12 0 0 1 52 0 V102Z" fill="${MZ}" stroke-width="2.5"/>`).join('')}
    <path d="M-3 80 H343" stroke-width="3"/>
    ${[60,120,180,300].map(x => `<path d="M${x} 80 V70 M${x-3} 70 H${x+3}" stroke-width="2"/>`).join('')}`),
};

/* ---------- 對照表 ---------- */
const COUNTRY_ART = {
  '台灣':['tw',MZ], '日本':['jp',MZ], '韓國':['kr',GD], '港澳':['hk',MZ], '越南':['vn',GR], '菲律賓':['ph',MZ],
  '泰國':['th',MZ], '新加坡':['sg',GD], '馬來西亞':['my',GR], '印尼':['id',MZ], '美國':['us',GD], '捷克':['cz',MZ], '其他':['other',PAPER],
};
const CONT_ART = { '亞洲':['tw',MZ], '美洲':['us',GD], '歐洲':['cz',MZ], '其他':['other',PAPER] };
// 城市 → 專屬橫幅
const CITY_BANNER = {
  NRT:'tyo', HND:'tyo', KIX:'kix', CTS:'cts', OKA:'oka', MMY:'oka', HKG:'hkg', MFM:'mfm', SGN:'sgn', HAN:'han', DAD:'dad',
  BKK:'bkk', SIN:'sin', KUL:'kul', MNL:'mnl', LAX:'lax', ONT:'lax', SFO:'sfo', SEA:'sea', PRG:'prg',
};
const CITY_MOTIF = { MFM:'mo' };
const SKY = { lax: GD };

function sprite(){
  const sym = (id, vb, body) => `<symbol id="${id}" viewBox="${vb}">${body}</symbol>`;
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${CLOUD}${PLANE}` +
    Object.entries(M).map(([k,v]) => sym('m-'+k, '0 0 100 100', v)).join('') +
    Object.entries(B).map(([k,v]) => sym('b-'+k, '0 0 340 120', v)).join('') + '</defs></svg>';
}
function iconSvg(motif, bg, size){
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="${bg}"/>` +
    `<rect x="-3" y="90" width="106" height="13" fill="${GR}" stroke="${INK}" stroke-width="3"/><use href="#m-${motif}"/></svg>`;
}
/* 國家插圖：使用者提供的色鉛筆風圖片（art/country-*.jpg） */
const COUNTRY_IMG = { '台灣':'taiwan', '日本':'japan', '韓國':'korea', '港澳':'hkmo', '越南':'vietnam', '菲律賓':'philippines', '泰國':'thailand',
  '新加坡':'singapore', '馬來西亞':'malaysia', '印尼':'indonesia', '美國':'usa', '捷克':'czech', '其他':'other' };
const CONT_IMG = { '亞洲':'taiwan', '美洲':'usa', '歐洲':'czech', '其他':'other' };
const imgOf = name => `art/country-${name}.jpg`;
const imgTag = (name, size) => `<img src="${imgOf(name)}" width="${size}" height="${size}" alt="" loading="lazy" style="display:block;width:${size}px;height:${size}px">`;
const countryIcon = (country, size = 44) => imgTag(COUNTRY_IMG[country] || 'other', size);
const contIcon = (cont, size = 62) => imgTag(CONT_IMG[cont] || 'other', size);
/* 城市橫幅：使用者提供的色鉛筆風圖片（art/banner-*.jpg，檔名用圖上的城市簡稱） */
const CITY_IMG = { NRT:'TYO', HND:'TYO', KIX:'OSA', CTS:'SPK', OKA:'OKA', MMY:'OKA', HKG:'HKG', MFM:'MFM', SGN:'SGN', HAN:'HAN', DAD:'DAD',
  BKK:'BKK', SIN:'SIN', KUL:'KUL', MNL:'MNL', LAX:'LAX', ONT:'LAX', SFO:'SFO', SEA:'SEA', PRG:'PRG' };
const motifOfCity = (code, country) => CITY_MOTIF[code] || (COUNTRY_ART[country] || COUNTRY_ART['其他'])[0];
function bannerSvg(code, country){
  if (CITY_IMG[code]) return `<div class="banner bimg"><img src="art/banner-${CITY_IMG[code]}.jpg" alt="" loading="lazy"></div>`;
  const b = CITY_BANNER[code];
  // 沒有專屬橫幅的城市：用該國的色鉛筆插圖置中
  if (!b) return `<div class="banner bimg"><img class="sq" src="${imgOf(COUNTRY_IMG[country] || 'other')}" alt="" loading="lazy"></div>`;
  const sky = (b && SKY[b]) || MZ;
  const body = b ? `<use href="#b-${b}"/>` : `<use href="#m-${motifOfCity(code, country)}" x="120" y="10" width="100" height="100"/>`;
  return `<svg class="banner" viewBox="0 0 340 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="340" height="120" fill="${sky}"/>
    ${b === 'lax' ? '' : `<circle cx="306" cy="26" r="13" fill="${GD}" stroke="${INK}" stroke-width="3"/>`}
    <use href="#cloud" x="16" y="10" width="50" height="24"/>
    <rect x="-3" y="100" width="346" height="23" fill="${GR}" stroke="${INK}" stroke-width="3"/>
    ${body}</svg>`;
}
function stampSvg(code, country, size = 44){ return imgTag(COUNTRY_IMG[country] || 'other', size); }

window.LaodaArt = { sprite, countryIcon, contIcon, bannerSvg, stampSvg, CITY_BANNER };
})();
