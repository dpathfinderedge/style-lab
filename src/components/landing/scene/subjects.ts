import type { SubjectDef } from "./types";

export const SUBJECTS: SubjectDef[] = [
  {
    id: "lighthouse",
    label: "Lighthouse",
    phrase: "a lighthouse on a rock",
    shapes: [
      { role: "beam", d: "M222 162 L400 118 L400 210Z" },
      { role: "ground", d: "M80 445 Q130 395 200 400 Q270 395 320 445Z" },
      { role: "body", d: "M165 400 L180 190 L220 190 L235 400Z" },
      { role: "trim", d: "M175.7 250 L224.3 250 L226.8 285 L173.2 285Z" },
      { role: "trim", d: "M170 330 L230 330 L232.5 365 L167.5 365Z" },
      { role: "trim", d: "M168 190 L232 190 L232 180 L168 180Z" },
      { role: "light", d: "M178 180 L222 180 L222 145 L178 145Z" },
      { role: "trim", d: "M172 145 L200 112 L228 145Z" },
      { role: "shadow", d: "M192 400 L192 372 Q200 362 208 372 L208 400Z" },
    ],
  },
  {
    id: "teapot",
    label: "Teapot",
    phrase: "a teapot on a table",
    shapes: [
      { role: "shadow", d: "M105 420 Q200 442 295 420 Q200 408 105 420Z" },
      { role: "trim", d: "M122 300 C70 290 60 380 124 375 L126 360 C95 365 92 315 126 315Z" },
      { role: "body", d: "M278 320 C310 315 330 290 345 262 L360 270 C345 310 315 345 276 352Z" },
      {
        role: "body",
        d: "M120 360 C110 290 150 250 200 250 C250 250 290 290 280 360 C275 395 240 410 200 410 C160 410 125 395 120 360Z",
      },
      { role: "trim", d: "M118 345 Q200 365 282 345 L281 360 Q200 380 119 360Z" },
      { role: "trim", d: "M165 255 Q200 215 235 255Z" },
      { role: "trim", d: "M190 222 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0Z" },
      { role: "light", d: "M145 305 C148 282 165 268 182 264 C165 276 156 292 154 312Z" },
    ],
  },
  {
    id: "cabin",
    label: "Cabin",
    phrase: "a cabin on a hill",
    shapes: [
      { role: "ground", d: "M20 450 Q200 372 380 450Z" },
      { role: "body", d: "M120 430 L120 320 L280 320 L280 430Z" },
      { role: "trim", d: "M240 282 L240 236 L262 236 L262 300Z" },
      { role: "trim", d: "M98 326 L200 236 L302 326Z" },
      { role: "shadow", d: "M185 430 L185 365 L215 365 L215 430Z" },
      { role: "light", d: "M138 345 L168 345 L168 375 L138 375Z" },
      { role: "light", d: "M232 345 L262 345 L262 375 L232 375Z" },
    ],
  },
];
