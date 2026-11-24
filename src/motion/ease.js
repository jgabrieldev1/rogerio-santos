/* As duas curvas da casa, registradas no GSAP. Todo o motion importa o gsap daqui.
   out:  0.16, 1, 0.3, 1  — o que chega
   foco: 0.62, 0, 0.16, 1 — o foco que desce */
import { gsap } from 'gsap'

function bezier(x1, y1, x2, y2) {
  // resolve x(t) = p por Newton e devolve y(t)
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const X = (t) => ((ax * t + bx) * t + cx) * t
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx
  const Y = (t) => ((ay * t + by) * t + cy) * t
  return (p) => {
    if (p <= 0) return 0
    if (p >= 1) return 1
    let t = p
    for (let i = 0; i < 8; i++) {
      const d = dX(t)
      if (Math.abs(d) < 1e-6) break
      t -= (X(t) - p) / d
    }
    t = Math.min(1, Math.max(0, t))
    return Y(t)
  }
}

gsap.registerEase('out', bezier(0.16, 1, 0.3, 1))
gsap.registerEase('foco', bezier(0.62, 0, 0.16, 1))

export { gsap }
