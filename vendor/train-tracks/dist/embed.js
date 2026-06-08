import { className as e, createComponent as t, delegateEvents as n, effect as r, insert as i, memo as a, render as o, setAttribute as s, setStyleProperty as c, template as l, use as u } from "solid-js/web";
import { For as d, Show as f, createEffect as p, createMemo as m, createSignal as h, onCleanup as g, onMount as _ } from "solid-js";
var v = Math.PI / 4, y = Math.PI / 8, b = 205 * Math.sin(Math.PI / 8), x = 205 * Math.sin(Math.PI / 4), S = 205 * (1 - Math.cos(Math.PI / 4)), C = 205 * (1 - Math.cos(Math.PI / 8)), w = 1e-6, T = 1e6;
//#endregion
//#region src/pieces/straight.ts
function E(e, t) {
	return {
		type: e,
		category: "straight",
		ends: [{
			position: [0, 0],
			angle: Math.PI,
			polarity: "F"
		}, {
			position: [t, 0],
			angle: 0,
			polarity: "M"
		}],
		connections: [[0, 1]],
		arms: [{
			kind: "line",
			from: [0, 0],
			to: [t, 0]
		}],
		bounds: {
			min: [0, -2.5],
			max: [t, 2.5]
		}
	};
}
var D = E("straight-nub", C), O = E("straight-tiny", S), k = E("straight-short", b), A = E("straight-long", x);
//#endregion
//#region src/pieces/curve.ts
function j(e, t, n) {
	let r = -Math.PI / 2 + t, i = 205 * Math.cos(r), a = 205 + 205 * Math.sin(r), o = n === "l" ? 1 : -1, s = [i, o * a], c = o * (r + Math.PI / 2);
	return {
		type: `${e}-${n}`,
		category: "curve",
		ends: [{
			position: [0, 0],
			angle: Math.PI,
			polarity: "F"
		}, {
			position: s,
			angle: c,
			polarity: "M"
		}],
		connections: [[0, 1]],
		arms: [{
			kind: "arc",
			from: [0, 0],
			to: s,
			center: [0, o * 205],
			radius: 205,
			ccw: n === "l"
		}],
		bounds: {
			min: [Math.min(0, s[0]) - 2.5, Math.min(0, s[1]) - 2.5],
			max: [Math.max(0, s[0]) + 2.5, Math.max(0, s[1]) + 2.5]
		}
	};
}
var M = j("curve-45", v, "l"), N = j("curve-45", v, "r"), P = j("curve-22", y, "l"), ee = j("curve-22", y, "r");
//#endregion
//#region src/pieces/switch.ts
function F(e, t) {
	let n = Math.PI / 8, r = -Math.PI / 2 + n, i = 205 * Math.cos(r), a = 205 + 205 * Math.sin(r), o = e === "l" ? 1 : -1, s = [i, o * a], c = [i, -o * a], l = o * (r + Math.PI / 2), u = -o * (r + Math.PI / 2), d = t === "fmm" ? "F" : "M", f = t === "fmm" ? "M" : "F";
	return {
		type: t === "fmm" ? `switch-y-${e}` : `switch-y-mff-${e}`,
		category: "junction",
		ends: [
			{
				position: [0, 0],
				angle: Math.PI,
				polarity: d
			},
			{
				position: s,
				angle: l,
				polarity: f
			},
			{
				position: c,
				angle: u,
				polarity: f
			}
		],
		connections: [[0, 1], [0, 2]],
		arms: [{
			kind: "arc",
			from: [0, 0],
			to: s,
			center: [0, o * 205],
			radius: 205,
			ccw: e === "l"
		}, {
			kind: "arc",
			from: [0, 0],
			to: c,
			center: [0, -o * 205],
			radius: 205,
			ccw: e !== "l"
		}],
		bounds: {
			min: [-2.5, -a - 2.5],
			max: [i + 2.5, a + 2.5]
		}
	};
}
var te = F("l", "fmm"), ne = F("r", "fmm"), re = F("l", "mff"), ie = F("r", "mff");
//#endregion
//#region src/pieces/switch-parallel.ts
function I(e, t, n) {
	let r = e, i = 2 * n - t, a = 2 * n, o = Math.sqrt(r * r + i * i), s = Math.atan2(i, r), c = Math.asin(a / o) - s;
	return {
		alpha: c,
		S: (e - 2 * n * Math.sin(c)) / Math.cos(c)
	};
}
function L(e, t, n, r, i, a) {
	let o = [t * Math.sin(n), e * t * (1 - Math.cos(n))], s = [o[0] + r * Math.cos(n), o[1] + e * r * Math.sin(n)], c = [s[0] + t * Math.sin(n), s[1] - e * t * Math.cos(n)], l = [i, e * a];
	return {
		kind: "composite",
		parts: [
			{
				kind: "arc",
				from: [0, 0],
				to: o,
				center: [0, e * t],
				radius: t,
				ccw: e > 0
			},
			{
				kind: "line",
				from: o,
				to: s
			},
			{
				kind: "arc",
				from: s,
				to: l,
				center: c,
				radius: t,
				ccw: e < 0
			}
		]
	};
}
function R(e, t) {
	let n = x, { alpha: r, S: i } = I(n, 22, 205), a = e === "l" ? 1 : -1, o = t === "fmm" ? "F" : "M", s = t === "fmm" ? "M" : "F";
	return {
		type: t === "fmm" ? `switch-parallel-${e}` : `switch-parallel-mff-${e}`,
		category: "junction",
		ends: [
			{
				position: [0, 0],
				angle: Math.PI,
				polarity: o
			},
			{
				position: [n, a * 22],
				angle: 0,
				polarity: s
			},
			{
				position: [n, -a * 22],
				angle: 0,
				polarity: s
			}
		],
		connections: [[0, 1], [0, 2]],
		arms: [L(a, 205, r, i, n, 22), L(-a, 205, r, i, n, 22)],
		bounds: {
			min: [-2.5, -24.5],
			max: [n + 2.5, 24.5]
		}
	};
}
var ae = R("l", "fmm"), z = R("r", "fmm"), oe = R("l", "mff"), se = R("r", "mff");
//#endregion
//#region src/pieces/switch-turn.ts
function ce(e, t) {
	let n = y, r = -Math.PI / 2 + n, i = 205 * Math.cos(r), a = 205 + 205 * Math.sin(r), o = e === "l" ? 1 : -1, s = [i, o * a], c = o * (r + Math.PI / 2), l = t === "fmm" ? "F" : "M", u = t === "fmm" ? "M" : "F";
	return {
		type: t === "fmm" ? `switch-turn-${e}` : `switch-turn-mff-${e}`,
		category: "junction",
		ends: [
			{
				position: [0, 0],
				angle: Math.PI,
				polarity: l
			},
			{
				position: [b, 0],
				angle: 0,
				polarity: u
			},
			{
				position: s,
				angle: c,
				polarity: u
			}
		],
		connections: [[0, 1], [0, 2]],
		arms: [{
			kind: "line",
			from: [0, 0],
			to: [b, 0]
		}, {
			kind: "arc",
			from: [0, 0],
			to: s,
			center: [0, o * 205],
			radius: 205,
			ccw: e === "l"
		}],
		bounds: {
			min: [-2.5, (o < 0 ? o * a : 0) - 2.5],
			max: [b + 2.5, (o > 0 ? o * a : 0) + 2.5]
		}
	};
}
var le = ce("l", "fmm"), ue = ce("r", "fmm"), de = ce("l", "mff"), fe = ce("r", "mff"), B = 50, pe = {
	type: "crossing-diamond",
	category: "crossing",
	ends: [
		{
			position: [-B, 0],
			angle: Math.PI,
			polarity: "F"
		},
		{
			position: [0, B],
			angle: Math.PI / 2,
			polarity: "M"
		},
		{
			position: [B, 0],
			angle: 0,
			polarity: "M"
		},
		{
			position: [0, -B],
			angle: -Math.PI / 2,
			polarity: "F"
		}
	],
	connections: [[0, 2], [1, 3]],
	arms: [{
		kind: "line",
		from: [-B, 0],
		to: [B, 0]
	}, {
		kind: "line",
		from: [0, B],
		to: [0, -B]
	}],
	bounds: {
		min: [-B - 2.5, -B - 2.5],
		max: [B + 2.5, B + 2.5]
	}
};
//#endregion
//#region src/pieces/adapter.ts
function me(e, t) {
	return {
		type: e,
		category: "adapter",
		ends: [{
			position: [0, 0],
			angle: Math.PI,
			polarity: t
		}, {
			position: [S, 0],
			angle: 0,
			polarity: t
		}],
		connections: [[0, 1]],
		arms: [{
			kind: "line",
			from: [0, 0],
			to: [S, 0]
		}],
		bounds: {
			min: [0, -2.5],
			max: [S, 2.5]
		}
	};
}
var he = me("adapter-mm", "M"), ge = me("adapter-ff", "F"), _e = {
	type: "magic-connector",
	category: "magic",
	ends: [{
		position: [0, 0],
		angle: Math.PI,
		polarity: "F"
	}, {
		position: [205, 0],
		angle: 0,
		polarity: "M"
	}],
	connections: [[0, 1]],
	arms: (() => {
		let e = 205 / 3, t = 4 / 3 * 20;
		return [{
			kind: "composite",
			parts: [
				{
					kind: "bezier",
					from: [0, 0],
					to: [e, 0],
					c1: [e / 3, t],
					c2: [2 * e / 3, t]
				},
				{
					kind: "bezier",
					from: [e, 0],
					to: [2 * e, 0],
					c1: [91.1111111111111, -26.666666666666664],
					c2: [113.88888888888889, -26.666666666666664]
				},
				{
					kind: "bezier",
					from: [2 * e, 0],
					to: [205, 0],
					c1: [159.44444444444443, t],
					c2: [182.2222222222222, t]
				}
			]
		}];
	})(),
	bounds: {
		min: [0, -20],
		max: [205, 20]
	}
};
2 * Math.PI;
//#endregion
//#region src/pieces/registry.ts
var ve = {
	[D.type]: D,
	[O.type]: O,
	[k.type]: k,
	[A.type]: A,
	[P.type]: P,
	[ee.type]: ee,
	[M.type]: M,
	[N.type]: N,
	[te.type]: te,
	[ne.type]: ne,
	[re.type]: re,
	[ie.type]: ie,
	[ae.type]: ae,
	[z.type]: z,
	[oe.type]: oe,
	[se.type]: se,
	[le.type]: le,
	[ue.type]: ue,
	[de.type]: de,
	[fe.type]: fe,
	[pe.type]: pe,
	[he.type]: he,
	[ge.type]: ge,
	[_e.type]: _e
};
function V(e) {
	let t = ve[e];
	if (!t) throw Error(`Unknown piece type: ${e}`);
	return t;
}
//#endregion
//#region src/lib/geometry.ts
function ye(e, t) {
	let n = e[0] - t[0], r = e[1] - t[1];
	return Math.sqrt(n * n + r * r);
}
function H(e) {
	if (e.kind === "line") return ye(e.from, e.to);
	if (e.kind === "arc") return e.radius * be(e);
	if (e.kind === "bezier") {
		let t = 0, n = xe(e, 0);
		for (let r = 1; r <= 32; r++) {
			let i = xe(e, r / 32);
			t += ye(n, i), n = i;
		}
		return t;
	}
	let t = 0;
	for (let n of e.parts) t += H(n);
	return t;
}
function be(e) {
	let t = Math.atan2(e.from[1] - e.center[1], e.from[0] - e.center[0]), n = Math.atan2(e.to[1] - e.center[1], e.to[0] - e.center[0]), r = e.ccw ? n - t : t - n;
	for (; r < 0;) r += 2 * Math.PI;
	for (; r >= 2 * Math.PI;) r -= 2 * Math.PI;
	return r;
}
function xe(e, t) {
	let n = 1 - t, r = n * n * n, i = 3 * n * n * t, a = 3 * n * t * t, o = t * t * t;
	return [r * e.from[0] + i * e.c1[0] + a * e.c2[0] + o * e.to[0], r * e.from[1] + i * e.c1[1] + a * e.c2[1] + o * e.to[1]];
}
function Se(e, t) {
	let n = 1 - t, r = 3 * n * n * (e.c1[0] - e.from[0]) + 6 * n * t * (e.c2[0] - e.c1[0]) + 3 * t * t * (e.to[0] - e.c2[0]), i = 3 * n * n * (e.c1[1] - e.from[1]) + 6 * n * t * (e.c2[1] - e.c1[1]) + 3 * t * t * (e.to[1] - e.c2[1]), a = Math.sqrt(r * r + i * i) || 1;
	return [r / a, i / a];
}
function U(e, t) {
	if (e.kind === "line") {
		let n = [e.from[0] + (e.to[0] - e.from[0]) * t, e.from[1] + (e.to[1] - e.from[1]) * t], r = e.to[0] - e.from[0], i = e.to[1] - e.from[1], a = Math.sqrt(r * r + i * i) || 1, o = [r / a, i / a];
		return {
			point: n,
			tangent: o,
			normal: [-o[1], o[0]]
		};
	}
	if (e.kind === "arc") {
		let n = Math.atan2(e.from[1] - e.center[1], e.from[0] - e.center[0]), r = be(e), i = e.ccw ? 1 : -1, a = n + i * r * t, o = [e.center[0] + e.radius * Math.cos(a), e.center[1] + e.radius * Math.sin(a)], s = [-i * Math.sin(a), i * Math.cos(a)];
		return {
			point: o,
			tangent: s,
			normal: [-s[1], s[0]]
		};
	}
	if (e.kind === "bezier") {
		let n = xe(e, t), r = Se(e, t);
		return {
			point: n,
			tangent: r,
			normal: [-r[1], r[0]]
		};
	}
	let n = H(e), r = Math.max(0, Math.min(n, t * n)), i = 0;
	for (let t = 0; t < e.parts.length; t++) {
		let n = e.parts[t], a = H(n);
		if (t === e.parts.length - 1 || i + a >= r) {
			let e = a > 1e-9 ? (r - i) / a : 0;
			return U(n, Math.max(0, Math.min(1, e)));
		}
		i += a;
	}
	return U(e.parts[e.parts.length - 1], 1);
}
function Ce(e, t) {
	let n = [];
	for (let r = 0; r <= t; r++) n.push(U(e, r / t));
	return n;
}
//#endregion
//#region src/lib/transform.ts
var we = {
	position: [0, 0],
	rotation: 0
};
function W([e, t], n) {
	let r = Math.cos(n.rotation), i = Math.sin(n.rotation);
	return [r * e - i * t + n.position[0], i * e + r * t + n.position[1]];
}
function Te(e, t) {
	return e + t.rotation;
}
function Ee(e, t) {
	return {
		position: W(e.position, t),
		angle: Te(e.angle, t),
		polarity: e.polarity
	};
}
function G(e, t) {
	return e.kind === "line" ? {
		kind: "line",
		from: W(e.from, t),
		to: W(e.to, t)
	} : e.kind === "arc" ? {
		kind: "arc",
		from: W(e.from, t),
		to: W(e.to, t),
		center: W(e.center, t),
		radius: e.radius,
		ccw: e.ccw
	} : e.kind === "bezier" ? {
		kind: "bezier",
		from: W(e.from, t),
		to: W(e.to, t),
		c1: W(e.c1, t),
		c2: W(e.c2, t)
	} : {
		kind: "composite",
		parts: e.parts.map((e) => G(e, t))
	};
}
function De(e) {
	let t = e;
	for (; t > Math.PI;) t -= 2 * Math.PI;
	for (; t <= -Math.PI;) t += 2 * Math.PI;
	return t;
}
//#endregion
//#region src/track/placement.ts
var Oe = 0;
function ke() {
	return Oe += 1, `p${Oe}`;
}
function Ae(e) {
	e > Oe && (Oe = e);
}
function K(e) {
	return {
		position: e.position,
		rotation: e.rotation
	};
}
function je(e) {
	if (e.magic) return e.magic.ends;
	let t = V(e.type), n = K(e);
	return t.ends.map((e) => Ee(e, n));
}
function Me(e, t, n) {
	let r = V(e).ends[t];
	if (!Ne(r.polarity, n.polarity)) return null;
	let i = De(De(n.angle + Math.PI) - r.angle), a = Math.cos(i), o = Math.sin(i), s = a * r.position[0] - o * r.position[1], c = o * r.position[0] + a * r.position[1], l = [n.position[0] - s, n.position[1] - c];
	return {
		id: ke(),
		type: e,
		position: l,
		rotation: i
	};
}
function Ne(e, t) {
	return e !== t;
}
//#endregion
//#region src/track/junctions.ts
function Pe(e, t = w) {
	let n = [];
	for (let t of e.pieces) je(t).forEach((e, r) => {
		n.push({
			ref: {
				pieceId: t.id,
				endIndex: r
			},
			position: [e.position[0], e.position[1]]
		});
	});
	let r = Array(n.length).fill(!1), i = [], a = 0;
	for (let e = 0; e < n.length; e++) {
		if (r[e]) continue;
		r[e] = !0;
		let o = [n[e].ref], s = n[e].position[0], c = n[e].position[1], l = 1;
		for (let i = e + 1; i < n.length; i++) r[i] || ye(n[e].position, n[i].position) < t && (r[i] = !0, o.push(n[i].ref), s += n[i].position[0], c += n[i].position[1], l += 1);
		i.push({
			id: a++,
			members: o,
			position: [s / l, c / l]
		});
	}
	return i;
}
function Fe(e, t) {
	for (let n of e) for (let e of n.members) if (e.pieceId === t.pieceId && e.endIndex === t.endIndex) return n;
	return null;
}
//#endregion
//#region src/scoring/smooth-widths.ts
function Ie(e) {
	let t = 0;
	for (let n of e.values()) t = Math.max(t, n.atobFrom, n.atobTo, n.btoaFrom, n.btoaTo);
	return t;
}
function Le(e, t, n, r) {
	let i = n.pieces.find((t) => t.id === e);
	if (!i) return null;
	let [a, o] = V(i.type).connections[t];
	return r.includes(a) ? a : r.includes(o) ? o : null;
}
function Re(e, t, n) {
	return e.connections[t][1] === n;
}
function ze(e, t) {
	let n = Pe(e), r = new Map(e.pieces.map((e) => [e.id, e])), i = (e) => V(r.get(e).type), a = /* @__PURE__ */ new Map();
	for (let r of n) {
		let n = /* @__PURE__ */ new Map();
		for (let { pieceId: e, endIndex: t } of r.members) n.has(e) || n.set(e, []), n.get(e).push(t);
		let o = [];
		for (let [r, i] of n) {
			let n = e.pieces.find((e) => e.id === r);
			if (!n) continue;
			let a = V(n.type);
			for (let e = 0; e < a.connections.length; e++) {
				let [n, s] = a.connections[e];
				(i.includes(n) || i.includes(s)) && o.push({
					pieceId: r,
					ci: e,
					atob: t.get(`${r}:${e}:AtoB`) ?? 0,
					btoa: t.get(`${r}:${e}:BtoA`) ?? 0
				});
			}
		}
		let s = (t) => Le(t.pieceId, t.ci, e, n.get(t.pieceId) ?? []), c = (e) => {
			let t = s(e);
			if (t === null) return null;
			let n = Re(i(e.pieceId), e.ci, t);
			return {
				into: n ? e.atob : e.btoa,
				out: n ? e.btoa : e.atob
			};
		};
		for (let e of o) {
			let t = s(e);
			if (t === null) continue;
			let n = `${e.pieceId}:${e.ci}:${t}`;
			if (a.has(n)) continue;
			let r = Re(i(e.pieceId), e.ci, t), l = {
				into: r ? e.atob : e.btoa,
				out: r ? e.btoa : e.atob
			}, u = o.filter((t) => t.pieceId === e.pieceId), d = o.filter((t) => t.pieceId !== e.pieceId), f, p;
			if (u.length > 1 && d.length === 1) {
				let e = c(d[0]) ?? l;
				p = e.into, f = e.out;
			} else if (o.length === 2) {
				let t = c(o.find((t) => t !== e)) ?? l;
				p = (l.out + t.into) / 2, f = (l.into + t.out) / 2;
			} else p = l.out, f = l.into;
			let m = r ? f : p, h = r ? p : f;
			a.set(n, {
				atob: m,
				btoa: h
			});
		}
	}
	let o = /* @__PURE__ */ new Map();
	for (let r of e.pieces) {
		let e = V(r.type);
		for (let i = 0; i < e.connections.length; i++) {
			let [s, c] = e.connections[i], l = Fe(n, {
				pieceId: r.id,
				endIndex: s
			}), u = Fe(n, {
				pieceId: r.id,
				endIndex: c
			}), d = {
				atob: t.get(`${r.id}:${i}:AtoB`) ?? 0,
				btoa: t.get(`${r.id}:${i}:BtoA`) ?? 0
			}, f = l ? a.get(`${r.id}:${i}:${s}`) ?? d : d, p = u ? a.get(`${r.id}:${i}:${c}`) ?? d : d;
			o.set(`${r.id}:${i}`, {
				atobFrom: f.atob,
				atobTo: p.atob,
				btoaFrom: f.btoa,
				btoaTo: p.btoa
			});
		}
	}
	return o;
}
//#endregion
//#region src/scoring/types.ts
function Be(e) {
	return `${e.pieceId}:${e.connectionIndex}:${e.direction}`;
}
//#endregion
//#region src/render/path.ts
var Ve = .3;
function He(e, t) {
	let n = G(e, t);
	if (n.kind === "line") return `M ${n.from[0]} ${n.from[1]} L ${n.to[0]} ${n.to[1]}`;
	if (n.kind === "bezier") return `M ${n.from[0]} ${n.from[1]} C ${n.c1[0]} ${n.c1[1]}, ${n.c2[0]} ${n.c2[1]}, ${n.to[0]} ${n.to[1]}`;
	let r = Math.max(8, Math.ceil(H(n) * Ve)), i = "";
	for (let e = 0; e <= r; e++) {
		let t = U(n, e / r).point;
		i += `${e === 0 ? "M" : "L"} ${t[0]} ${t[1]} `;
	}
	return i.trim();
}
//#endregion
//#region src/render/bulge.ts
function Ue(e, t, n, r, i, a, o = 16) {
	let s = Ce(G(e, t), o), c = a === "atob" ? 1 : -1, l = "";
	for (let e = 0; e < s.length; e++) {
		let t = e / (s.length - 1), a = n + (r - n) * t, o = Math.min(i * a, 50), u = s[e].point[0] + c * s[e].normal[0] * o, d = s[e].point[1] + c * s[e].normal[1] * o;
		l += `${e === 0 ? "M" : "L"} ${u} ${d} `;
	}
	for (let e = s.length - 1; e >= 0; e--) l += `L ${s[e].point[0]} ${s[e].point[1]} `;
	return l += "Z", l.trim();
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function We(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = We(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function Ge() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = We(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/tailwind-merge/dist/bundle-mjs.mjs
var Ke = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, qe = (e, t) => ({
	classGroupId: e,
	validator: t
}), Je = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), Ye = "-", Xe = [], Ze = "arbitrary..", Qe = (e) => {
	let t = tt(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return et(e);
			let n = e.split(Ye);
			return $e(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? Ke(i, t) : t : i || Xe;
			}
			return n[e] || Xe;
		}
	};
}, $e = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = $e(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(Ye) : e.slice(t).join(Ye), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, et = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? Ze + r : void 0;
})(), tt = (e) => {
	let { theme: t, classGroups: n } = e;
	return nt(n, t);
}, nt = (e, t) => {
	let n = Je();
	for (let r in e) {
		let i = e[r];
		rt(i, n, r, t);
	}
	return n;
}, rt = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		it(i, t, n, r);
	}
}, it = (e, t, n, r) => {
	if (typeof e == "string") {
		at(e, t, n);
		return;
	}
	if (typeof e == "function") {
		ot(e, t, n, r);
		return;
	}
	st(e, t, n, r);
}, at = (e, t, n) => {
	let r = e === "" ? t : ct(t, e);
	r.classGroupId = n;
}, ot = (e, t, n, r) => {
	if (lt(e)) {
		rt(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(qe(n, e));
}, st = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		rt(o, ct(t, a), n, r);
	}
}, ct = (e, t) => {
	let n = e, r = t.split(Ye), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = Je(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, lt = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, ut = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = Object.create(null), r = Object.create(null), i = (i, a) => {
		n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null));
	};
	return {
		get(e) {
			let t = n[e];
			if (t !== void 0) return t;
			if ((t = r[e]) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			e in n ? n[e] = t : i(e, t);
		}
	};
}, dt = "!", ft = ":", pt = [], mt = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), ht = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === ft) {
					t.push(e.slice(i, s)), i = s + 1;
					continue;
				}
				if (o === "/") {
					a = s;
					continue;
				}
			}
			o === "[" ? n++ : o === "]" ? n-- : o === "(" ? r++ : o === ")" && r--;
		}
		let s = t.length === 0 ? e : e.slice(i), c = s, l = !1;
		s.endsWith(dt) ? (c = s.slice(0, -1), l = !0) : s.startsWith(dt) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return mt(t, l, c, u);
	};
	if (t) {
		let e = t + ft, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : mt(pt, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, gt = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.orderSensitiveModifiers.forEach((e, n) => {
		t.set(e, 1e6 + n);
	}), (e) => {
		let n = [], r = [];
		for (let i = 0; i < e.length; i++) {
			let a = e[i], o = a[0] === "[", s = t.has(a);
			o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
		}
		return r.length > 0 && (r.sort(), n.push(...r)), n;
	};
}, _t = (e) => ({
	cache: ut(e.cacheSize),
	parseClassName: ht(e),
	sortModifiers: gt(e),
	postfixLookupClassGroupIds: vt(e),
	...Qe(e)
}), vt = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, yt = /\s+/, bt = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(yt), l = "";
	for (let e = c.length - 1; e >= 0; --e) {
		let t = c[e], { isExternal: u, modifiers: d, hasImportantModifier: f, baseClassName: p, maybePostfixModifierPosition: m } = n(t);
		if (u) {
			l = t + (l.length > 0 ? " " + l : l);
			continue;
		}
		let h = !!m, g;
		if (h) {
			g = r(p.substring(0, m));
			let e = g && o[g] ? r(p) : void 0;
			e && e !== g && (g = e, h = !1);
		} else g = r(p);
		if (!g) {
			if (!h) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			if (g = r(p), !g) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			h = !1;
		}
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + dt : _, y = v + g;
		if (s.indexOf(y) > -1) continue;
		s.push(y);
		let b = i(g, h);
		for (let e = 0; e < b.length; ++e) {
			let t = b[e];
			s.push(v + t);
		}
		l = t + (l.length > 0 ? " " + l : l);
	}
	return l;
}, xt = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = St(n)) && (i && (i += " "), i += r);
	return i;
}, St = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = St(e[r])) && (n && (n += " "), n += t);
	return n;
}, Ct = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = _t(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = bt(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(xt(...e));
}, wt = [], q = (e) => {
	let t = (t) => t[e] || wt;
	return t.isThemeGetter = !0, t;
}, Tt = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Et = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Dt = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Ot = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, kt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, At = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, jt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Mt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Nt = (e) => Dt.test(e), J = (e) => !!e && !Number.isNaN(Number(e)), Y = (e) => !!e && Number.isInteger(Number(e)), Pt = (e) => e.endsWith("%") && J(e.slice(0, -1)), X = (e) => Ot.test(e), Ft = () => !0, It = (e) => kt.test(e) && !At.test(e), Lt = () => !1, Rt = (e) => jt.test(e), zt = (e) => Mt.test(e), Bt = (e) => !Z(e) && !Q(e), Vt = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Ht = (e) => $(e, sn, Lt), Z = (e) => Tt.test(e), Ut = (e) => $(e, cn, It), Wt = (e) => $(e, ln, J), Gt = (e) => $(e, dn, Ft), Kt = (e) => $(e, un, Lt), qt = (e) => $(e, an, Lt), Jt = (e) => $(e, on, zt), Yt = (e) => $(e, fn, Rt), Q = (e) => Et.test(e), Xt = (e) => rn(e, cn), Zt = (e) => rn(e, un), Qt = (e) => rn(e, an), $t = (e) => rn(e, sn), en = (e) => rn(e, on), tn = (e) => rn(e, fn, !0), nn = (e) => rn(e, dn, !0), $ = (e, t, n) => {
	let r = Tt.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, rn = (e, t, n = !1) => {
	let r = Et.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, an = (e) => e === "position" || e === "percentage", on = (e) => e === "image" || e === "url", sn = (e) => e === "length" || e === "size" || e === "bg-size", cn = (e) => e === "length", ln = (e) => e === "number", un = (e) => e === "family-name", dn = (e) => e === "number" || e === "weight", fn = (e) => e === "shadow", pn = /* @__PURE__ */ Ct(() => {
	let e = q("color"), t = q("font"), n = q("text"), r = q("font-weight"), i = q("tracking"), a = q("leading"), o = q("breakpoint"), s = q("container"), c = q("spacing"), l = q("radius"), u = q("shadow"), d = q("inset-shadow"), f = q("text-shadow"), p = q("drop-shadow"), m = q("blur"), h = q("perspective"), g = q("aspect"), _ = q("ease"), v = q("animate"), y = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], b = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	], x = () => [
		...b(),
		Q,
		Z
	], S = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], C = () => [
		"auto",
		"contain",
		"none"
	], w = () => [
		Q,
		Z,
		c
	], T = () => [
		Nt,
		"full",
		"auto",
		...w()
	], E = () => [
		Y,
		"none",
		"subgrid",
		Q,
		Z
	], D = () => [
		"auto",
		{ span: [
			"full",
			Y,
			Q,
			Z
		] },
		Y,
		Q,
		Z
	], O = () => [
		Y,
		"auto",
		Q,
		Z
	], k = () => [
		"auto",
		"min",
		"max",
		"fr",
		Q,
		Z
	], A = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	], j = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], M = () => ["auto", ...w()], N = () => [
		Nt,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], P = () => [
		Nt,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...w()
	], ee = () => [
		Nt,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], F = () => [
		e,
		Q,
		Z
	], te = () => [
		...b(),
		Qt,
		qt,
		{ position: [Q, Z] }
	], ne = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], re = () => [
		"auto",
		"cover",
		"contain",
		$t,
		Ht,
		{ size: [Q, Z] }
	], ie = () => [
		Pt,
		Xt,
		Ut
	], I = () => [
		"",
		"none",
		"full",
		l,
		Q,
		Z
	], L = () => [
		"",
		J,
		Xt,
		Ut
	], R = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], ae = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], z = () => [
		J,
		Pt,
		Qt,
		qt
	], oe = () => [
		"",
		"none",
		m,
		Q,
		Z
	], se = () => [
		"none",
		J,
		Q,
		Z
	], ce = () => [
		"none",
		J,
		Q,
		Z
	], le = () => [
		J,
		Q,
		Z
	], ue = () => [
		Nt,
		"full",
		...w()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [X],
			breakpoint: [X],
			color: [Ft],
			container: [X],
			"drop-shadow": [X],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [Bt],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [X],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [X],
			shadow: [X],
			spacing: ["px", J],
			text: [X],
			"text-shadow": [X],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				Nt,
				Z,
				Q,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				Q,
				Z
			] }],
			"container-named": [Vt],
			columns: [{ columns: [
				J,
				Z,
				Q,
				s
			] }],
			"break-after": [{ "break-after": y() }],
			"break-before": [{ "break-before": y() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only", "not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: x() }],
			overflow: [{ overflow: S() }],
			"overflow-x": [{ "overflow-x": S() }],
			"overflow-y": [{ "overflow-y": S() }],
			overscroll: [{ overscroll: C() }],
			"overscroll-x": [{ "overscroll-x": C() }],
			"overscroll-y": [{ "overscroll-y": C() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: T() }],
			"inset-x": [{ "inset-x": T() }],
			"inset-y": [{ "inset-y": T() }],
			start: [{
				"inset-s": T(),
				start: T()
			}],
			end: [{
				"inset-e": T(),
				end: T()
			}],
			"inset-bs": [{ "inset-bs": T() }],
			"inset-be": [{ "inset-be": T() }],
			top: [{ top: T() }],
			right: [{ right: T() }],
			bottom: [{ bottom: T() }],
			left: [{ left: T() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				Y,
				"auto",
				Q,
				Z
			] }],
			basis: [{ basis: [
				Nt,
				"full",
				"auto",
				s,
				...w()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				J,
				Nt,
				"auto",
				"initial",
				"none",
				Z
			] }],
			grow: [{ grow: [
				"",
				J,
				Q,
				Z
			] }],
			shrink: [{ shrink: [
				"",
				J,
				Q,
				Z
			] }],
			order: [{ order: [
				Y,
				"first",
				"last",
				"none",
				Q,
				Z
			] }],
			"grid-cols": [{ "grid-cols": E() }],
			"col-start-end": [{ col: D() }],
			"col-start": [{ "col-start": O() }],
			"col-end": [{ "col-end": O() }],
			"grid-rows": [{ "grid-rows": E() }],
			"row-start-end": [{ row: D() }],
			"row-start": [{ "row-start": O() }],
			"row-end": [{ "row-end": O() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": k() }],
			"auto-rows": [{ "auto-rows": k() }],
			gap: [{ gap: w() }],
			"gap-x": [{ "gap-x": w() }],
			"gap-y": [{ "gap-y": w() }],
			"justify-content": [{ justify: [...A(), "normal"] }],
			"justify-items": [{ "justify-items": [...j(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...j()] }],
			"align-content": [{ content: ["normal", ...A()] }],
			"align-items": [{ items: [...j(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...j(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": A() }],
			"place-items": [{ "place-items": [...j(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...j()] }],
			p: [{ p: w() }],
			px: [{ px: w() }],
			py: [{ py: w() }],
			ps: [{ ps: w() }],
			pe: [{ pe: w() }],
			pbs: [{ pbs: w() }],
			pbe: [{ pbe: w() }],
			pt: [{ pt: w() }],
			pr: [{ pr: w() }],
			pb: [{ pb: w() }],
			pl: [{ pl: w() }],
			m: [{ m: M() }],
			mx: [{ mx: M() }],
			my: [{ my: M() }],
			ms: [{ ms: M() }],
			me: [{ me: M() }],
			mbs: [{ mbs: M() }],
			mbe: [{ mbe: M() }],
			mt: [{ mt: M() }],
			mr: [{ mr: M() }],
			mb: [{ mb: M() }],
			ml: [{ ml: M() }],
			"space-x": [{ "space-x": w() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": w() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: N() }],
			"inline-size": [{ inline: ["auto", ...P()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...P()] }],
			"max-inline-size": [{ "max-inline": ["none", ...P()] }],
			"block-size": [{ block: ["auto", ...ee()] }],
			"min-block-size": [{ "min-block": ["auto", ...ee()] }],
			"max-block-size": [{ "max-block": ["none", ...ee()] }],
			w: [{ w: [
				s,
				"screen",
				...N()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...N()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...N()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...N()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...N()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...N()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				Xt,
				Ut
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				nn,
				Gt
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				Pt,
				Z
			] }],
			"font-family": [{ font: [
				Zt,
				Kt,
				t
			] }],
			"font-features": [{ "font-features": [Z] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				Q,
				Z
			] }],
			"line-clamp": [{ "line-clamp": [
				J,
				"none",
				Q,
				Wt
			] }],
			leading: [{ leading: [a, ...w()] }],
			"list-image": [{ "list-image": [
				"none",
				Q,
				Z
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				Q,
				Z
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: F() }],
			"text-color": [{ text: F() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...R(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				J,
				"from-font",
				"auto",
				Q,
				Ut
			] }],
			"text-decoration-color": [{ decoration: F() }],
			"underline-offset": [{ "underline-offset": [
				J,
				"auto",
				Q,
				Z
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: w() }],
			"tab-size": [{ tab: [
				Y,
				Q,
				Z
			] }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				Q,
				Z
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				Q,
				Z
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: te() }],
			"bg-repeat": [{ bg: ne() }],
			"bg-size": [{ bg: re() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						Y,
						Q,
						Z
					],
					radial: [
						"",
						Q,
						Z
					],
					conic: [
						Y,
						Q,
						Z
					]
				},
				en,
				Jt
			] }],
			"bg-color": [{ bg: F() }],
			"gradient-from-pos": [{ from: ie() }],
			"gradient-via-pos": [{ via: ie() }],
			"gradient-to-pos": [{ to: ie() }],
			"gradient-from": [{ from: F() }],
			"gradient-via": [{ via: F() }],
			"gradient-to": [{ to: F() }],
			rounded: [{ rounded: I() }],
			"rounded-s": [{ "rounded-s": I() }],
			"rounded-e": [{ "rounded-e": I() }],
			"rounded-t": [{ "rounded-t": I() }],
			"rounded-r": [{ "rounded-r": I() }],
			"rounded-b": [{ "rounded-b": I() }],
			"rounded-l": [{ "rounded-l": I() }],
			"rounded-ss": [{ "rounded-ss": I() }],
			"rounded-se": [{ "rounded-se": I() }],
			"rounded-ee": [{ "rounded-ee": I() }],
			"rounded-es": [{ "rounded-es": I() }],
			"rounded-tl": [{ "rounded-tl": I() }],
			"rounded-tr": [{ "rounded-tr": I() }],
			"rounded-br": [{ "rounded-br": I() }],
			"rounded-bl": [{ "rounded-bl": I() }],
			"border-w": [{ border: L() }],
			"border-w-x": [{ "border-x": L() }],
			"border-w-y": [{ "border-y": L() }],
			"border-w-s": [{ "border-s": L() }],
			"border-w-e": [{ "border-e": L() }],
			"border-w-bs": [{ "border-bs": L() }],
			"border-w-be": [{ "border-be": L() }],
			"border-w-t": [{ "border-t": L() }],
			"border-w-r": [{ "border-r": L() }],
			"border-w-b": [{ "border-b": L() }],
			"border-w-l": [{ "border-l": L() }],
			"divide-x": [{ "divide-x": L() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": L() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...R(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...R(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: F() }],
			"border-color-x": [{ "border-x": F() }],
			"border-color-y": [{ "border-y": F() }],
			"border-color-s": [{ "border-s": F() }],
			"border-color-e": [{ "border-e": F() }],
			"border-color-bs": [{ "border-bs": F() }],
			"border-color-be": [{ "border-be": F() }],
			"border-color-t": [{ "border-t": F() }],
			"border-color-r": [{ "border-r": F() }],
			"border-color-b": [{ "border-b": F() }],
			"border-color-l": [{ "border-l": F() }],
			"divide-color": [{ divide: F() }],
			"outline-style": [{ outline: [
				...R(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				J,
				Q,
				Z
			] }],
			"outline-w": [{ outline: [
				"",
				J,
				Xt,
				Ut
			] }],
			"outline-color": [{ outline: F() }],
			shadow: [{ shadow: [
				"",
				"none",
				u,
				tn,
				Yt
			] }],
			"shadow-color": [{ shadow: F() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				tn,
				Yt
			] }],
			"inset-shadow-color": [{ "inset-shadow": F() }],
			"ring-w": [{ ring: L() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: F() }],
			"ring-offset-w": [{ "ring-offset": [J, Ut] }],
			"ring-offset-color": [{ "ring-offset": F() }],
			"inset-ring-w": [{ "inset-ring": L() }],
			"inset-ring-color": [{ "inset-ring": F() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				tn,
				Yt
			] }],
			"text-shadow-color": [{ "text-shadow": F() }],
			opacity: [{ opacity: [
				J,
				Q,
				Z
			] }],
			"mix-blend": [{ "mix-blend": [
				...ae(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": ae() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [J] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": z() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": z() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": F() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": F() }],
			"mask-image-t-from-pos": [{ "mask-t-from": z() }],
			"mask-image-t-to-pos": [{ "mask-t-to": z() }],
			"mask-image-t-from-color": [{ "mask-t-from": F() }],
			"mask-image-t-to-color": [{ "mask-t-to": F() }],
			"mask-image-r-from-pos": [{ "mask-r-from": z() }],
			"mask-image-r-to-pos": [{ "mask-r-to": z() }],
			"mask-image-r-from-color": [{ "mask-r-from": F() }],
			"mask-image-r-to-color": [{ "mask-r-to": F() }],
			"mask-image-b-from-pos": [{ "mask-b-from": z() }],
			"mask-image-b-to-pos": [{ "mask-b-to": z() }],
			"mask-image-b-from-color": [{ "mask-b-from": F() }],
			"mask-image-b-to-color": [{ "mask-b-to": F() }],
			"mask-image-l-from-pos": [{ "mask-l-from": z() }],
			"mask-image-l-to-pos": [{ "mask-l-to": z() }],
			"mask-image-l-from-color": [{ "mask-l-from": F() }],
			"mask-image-l-to-color": [{ "mask-l-to": F() }],
			"mask-image-x-from-pos": [{ "mask-x-from": z() }],
			"mask-image-x-to-pos": [{ "mask-x-to": z() }],
			"mask-image-x-from-color": [{ "mask-x-from": F() }],
			"mask-image-x-to-color": [{ "mask-x-to": F() }],
			"mask-image-y-from-pos": [{ "mask-y-from": z() }],
			"mask-image-y-to-pos": [{ "mask-y-to": z() }],
			"mask-image-y-from-color": [{ "mask-y-from": F() }],
			"mask-image-y-to-color": [{ "mask-y-to": F() }],
			"mask-image-radial": [{ "mask-radial": [Q, Z] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": z() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": z() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": F() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": F() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [J] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": z() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": z() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": F() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": F() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: te() }],
			"mask-repeat": [{ mask: ne() }],
			"mask-size": [{ mask: re() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				Q,
				Z
			] }],
			filter: [{ filter: [
				"",
				"none",
				Q,
				Z
			] }],
			blur: [{ blur: oe() }],
			brightness: [{ brightness: [
				J,
				Q,
				Z
			] }],
			contrast: [{ contrast: [
				J,
				Q,
				Z
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				tn,
				Yt
			] }],
			"drop-shadow-color": [{ "drop-shadow": F() }],
			grayscale: [{ grayscale: [
				"",
				J,
				Q,
				Z
			] }],
			"hue-rotate": [{ "hue-rotate": [
				J,
				Q,
				Z
			] }],
			invert: [{ invert: [
				"",
				J,
				Q,
				Z
			] }],
			saturate: [{ saturate: [
				J,
				Q,
				Z
			] }],
			sepia: [{ sepia: [
				"",
				J,
				Q,
				Z
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				Q,
				Z
			] }],
			"backdrop-blur": [{ "backdrop-blur": oe() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				J,
				Q,
				Z
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				J,
				Q,
				Z
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				J,
				Q,
				Z
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				J,
				Q,
				Z
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				J,
				Q,
				Z
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				J,
				Q,
				Z
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				J,
				Q,
				Z
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				J,
				Q,
				Z
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": w() }],
			"border-spacing-x": [{ "border-spacing-x": w() }],
			"border-spacing-y": [{ "border-spacing-y": w() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				Q,
				Z
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				J,
				"initial",
				Q,
				Z
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				Q,
				Z
			] }],
			delay: [{ delay: [
				J,
				Q,
				Z
			] }],
			animate: [{ animate: [
				"none",
				v,
				Q,
				Z
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				Q,
				Z
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: se() }],
			"rotate-x": [{ "rotate-x": se() }],
			"rotate-y": [{ "rotate-y": se() }],
			"rotate-z": [{ "rotate-z": se() }],
			scale: [{ scale: ce() }],
			"scale-x": [{ "scale-x": ce() }],
			"scale-y": [{ "scale-y": ce() }],
			"scale-z": [{ "scale-z": ce() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: le() }],
			"skew-x": [{ "skew-x": le() }],
			"skew-y": [{ "skew-y": le() }],
			transform: [{ transform: [
				Q,
				Z,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: ue() }],
			"translate-x": [{ "translate-x": ue() }],
			"translate-y": [{ "translate-y": ue() }],
			"translate-z": [{ "translate-z": ue() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				Y,
				Q,
				Z
			] }],
			accent: [{ accent: F() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: F() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				Q,
				Z
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scrollbar-thumb-color": [{ "scrollbar-thumb": F() }],
			"scrollbar-track-color": [{ "scrollbar-track": F() }],
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			"scroll-m": [{ "scroll-m": w() }],
			"scroll-mx": [{ "scroll-mx": w() }],
			"scroll-my": [{ "scroll-my": w() }],
			"scroll-ms": [{ "scroll-ms": w() }],
			"scroll-me": [{ "scroll-me": w() }],
			"scroll-mbs": [{ "scroll-mbs": w() }],
			"scroll-mbe": [{ "scroll-mbe": w() }],
			"scroll-mt": [{ "scroll-mt": w() }],
			"scroll-mr": [{ "scroll-mr": w() }],
			"scroll-mb": [{ "scroll-mb": w() }],
			"scroll-ml": [{ "scroll-ml": w() }],
			"scroll-p": [{ "scroll-p": w() }],
			"scroll-px": [{ "scroll-px": w() }],
			"scroll-py": [{ "scroll-py": w() }],
			"scroll-ps": [{ "scroll-ps": w() }],
			"scroll-pe": [{ "scroll-pe": w() }],
			"scroll-pbs": [{ "scroll-pbs": w() }],
			"scroll-pbe": [{ "scroll-pbe": w() }],
			"scroll-pt": [{ "scroll-pt": w() }],
			"scroll-pr": [{ "scroll-pr": w() }],
			"scroll-pb": [{ "scroll-pb": w() }],
			"scroll-pl": [{ "scroll-pl": w() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				Q,
				Z
			] }],
			fill: [{ fill: ["none", ...F()] }],
			"stroke-w": [{ stroke: [
				J,
				Xt,
				Ut,
				Wt
			] }],
			stroke: [{ stroke: ["none", ...F()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
});
//#endregion
//#region src/lib/cn.ts
function mn(...e) {
	return pn(Ge(e));
}
//#endregion
//#region src/render/Arm.tsx
var hn = /* @__PURE__ */ l("<svg><path fill=currentColor fill-opacity=1 stroke=none class=\"text-amber-200 dark:text-sky-800\"></svg>", !1, !0, !1), gn = /* @__PURE__ */ l("<svg><path fill=none stroke=currentColor stroke-width=8></svg>", !1, !0, !1);
function _n(e) {
	let n = () => e.pAtoBFrom !== void 0 || e.pAtoBTo !== void 0 || e.pBtoAFrom !== void 0 || e.pBtoATo !== void 0;
	return [t(f, {
		get when() {
			return n();
		},
		get children() {
			return [(() => {
				var t = hn();
				return r(() => s(t, "d", Ue(e.arm, e.transform, e.pAtoBFrom ?? 0, e.pAtoBTo ?? 0, e.bulgeScale ?? 1, "atob"))), t;
			})(), (() => {
				var t = hn();
				return r(() => s(t, "d", Ue(e.arm, e.transform, e.pBtoAFrom ?? 0, e.pBtoATo ?? 0, e.bulgeScale ?? 1, "btoa"))), t;
			})()];
		}
	}), t(f, {
		get when() {
			return !e.bulgeOnly;
		},
		get children() {
			var t = gn();
			return r((n) => {
				var r = He(e.arm, e.transform), i = e.dashed ? "butt" : "round", a = e.dashed ? "16 12" : void 0, o = mn("arm-stroke", e.class);
				return r !== n.e && s(t, "d", n.e = r), i !== n.t && s(t, "stroke-linecap", n.t = i), a !== n.a && s(t, "stroke-dasharray", n.a = a), o !== n.o && s(t, "class", n.o = o), n;
			}, {
				e: void 0,
				t: void 0,
				a: void 0,
				o: void 0
			}), t;
		}
	})];
}
//#endregion
//#region src/render/Piece.tsx
var vn = /* @__PURE__ */ l("<svg><g></svg>", !1, !0, !1), yn = /* @__PURE__ */ l("<svg><g data-interactive></svg>", !1, !0, !1), bn = /* @__PURE__ */ l("<svg><circle r=6 fill=currentColor></svg>", !1, !0, !1), xn = /* @__PURE__ */ l("<svg><circle r=6 fill=none stroke=currentColor stroke-width=2></svg>", !1, !0, !1), Sn = /* @__PURE__ */ l("<svg><g><polygon points=\"12,0 0,-12 -12,0 0,12\"class=\"text-emerald-500 dark:text-emerald-400\"fill=currentColor stroke=none></svg>", !1, !0, !1);
function Cn() {
	return {
		kind: "composite",
		parts: [{
			kind: "line",
			from: [0, 50],
			to: [0, 12]
		}, {
			kind: "line",
			from: [0, -12],
			to: [0, -50]
		}]
	};
}
function wn(e) {
	let n = () => V(e.piece.type), o = () => e.piece.magic?.arms ?? n().arms, l = () => e.piece.magic ? we : K(e.piece), u = () => e.piece.type === "magic-connector" && !e.piece.magic;
	function p(t) {
		let n = e.smoothedWidths?.get(`${e.piece.id}:${t}`);
		if (n) return n;
		let r = e.scores;
		if (!r) return null;
		let i = r.get(Be({
			pieceId: e.piece.id,
			connectionIndex: t,
			direction: "AtoB"
		})) ?? 0, a = r.get(Be({
			pieceId: e.piece.id,
			connectionIndex: t,
			direction: "BtoA"
		})) ?? 0;
		return {
			atobFrom: i,
			atobTo: i,
			btoaFrom: a,
			btoaTo: a
		};
	}
	let m = () => e.renderPass;
	return m() === "bulge" ? (() => {
		var n = vn();
		return i(n, t(d, {
			get each() {
				return o();
			},
			children: (n, r) => {
				let i = () => p(r());
				return t(_n, {
					arm: n,
					get transform() {
						return l();
					},
					get pAtoBFrom() {
						return i()?.atobFrom;
					},
					get pAtoBTo() {
						return i()?.atobTo;
					},
					get pBtoAFrom() {
						return i()?.btoaFrom;
					},
					get pBtoATo() {
						return i()?.btoaTo;
					},
					get bulgeScale() {
						return e.bulgeScale;
					},
					bulgeOnly: !0
				});
			}
		})), r(() => s(n, "data-piece-id", e.piece.id)), n;
	})() : (() => {
		var h = yn();
		return h.$$click = (t) => {
			e.onSelect && (t.stopPropagation(), e.onSelect(t));
		}, h.addEventListener("pointerleave", () => e.onHoverPiece?.(null)), h.addEventListener("pointerenter", () => e.onHoverPiece?.(e.piece.id)), h.$$pointerdown = (e) => e.stopPropagation(), i(h, t(d, {
			get each() {
				return o();
			},
			children: (n, r) => {
				let i = () => p(r()), a = m() === "line";
				return t(_n, {
					arm: e.piece.type === "crossing-diamond" && r() === 1 ? Cn() : n,
					get transform() {
						return l();
					},
					get pAtoBFrom() {
						return a ? void 0 : i()?.atobFrom;
					},
					get pAtoBTo() {
						return a ? void 0 : i()?.atobTo;
					},
					get pBtoAFrom() {
						return a ? void 0 : i()?.btoaFrom;
					},
					get pBtoATo() {
						return a ? void 0 : i()?.btoaTo;
					},
					get bulgeScale() {
						return e.bulgeScale;
					},
					get dashed() {
						return u();
					}
				});
			}
		}), null), i(h, t(f, {
			get when() {
				return e.showPolarity;
			},
			get children() {
				return t(d, {
					get each() {
						return je(e.piece);
					},
					children: (e) => e.polarity === "M" ? (() => {
						var t = bn();
						return r((n) => {
							var r = e.position[0], i = e.position[1];
							return r !== n.e && s(t, "cx", n.e = r), i !== n.t && s(t, "cy", n.t = i), n;
						}, {
							e: void 0,
							t: void 0
						}), t;
					})() : (() => {
						var t = xn();
						return r((n) => {
							var r = e.position[0], i = e.position[1];
							return r !== n.e && s(t, "cx", n.e = r), i !== n.t && s(t, "cy", n.t = i), n;
						}, {
							e: void 0,
							t: void 0
						}), t;
					})()
				});
			}
		}), null), i(h, t(f, {
			get when() {
				return a(() => !!e.showAdapters)() && (n().category === "adapter" || e.piece.type === "magic-connector" && e.piece.magic !== void 0 && e.piece.magic.ends[0].polarity === e.piece.magic.ends[1].polarity);
			},
			get children() {
				return (() => {
					let t, r, i;
					if (e.piece.magic) {
						let n = e.piece.magic.arms[0], a = n.kind === "composite" ? n.parts.find((e) => e.kind === "line") : n.kind === "line" ? n : void 0;
						if (a && a.kind === "line") t = (a.from[0] + a.to[0]) / 2, r = (a.from[1] + a.to[1]) / 2, i = Math.atan2(a.to[1] - a.from[1], a.to[0] - a.from[0]) * 180 / Math.PI;
						else {
							let e = U(n, .5);
							t = e.point[0], r = e.point[1], i = Math.atan2(e.tangent[1], e.tangent[0]) * 180 / Math.PI;
						}
					} else {
						let a = U(G(n().arms[0], K(e.piece)), .5);
						t = a.point[0], r = a.point[1], i = Math.atan2(a.tangent[1], a.tangent[0]) * 180 / Math.PI;
					}
					return (() => {
						var e = Sn();
						return e.firstChild, s(e, "transform", `translate(${t},${r}) scale(1,-1) rotate(${-i})`), e;
					})();
				})();
			}
		}), null), r((t) => {
			var n = e.piece.id, r = e.piece.type, i = e.selected ? "true" : void 0, a = e.onSelect ? "pointer" : void 0;
			return n !== t.e && s(h, "data-piece-id", t.e = n), r !== t.t && s(h, "data-piece-type", t.t = r), i !== t.a && s(h, "data-selected", t.a = i), a !== t.o && c(h, "cursor", t.o = a), t;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0
		}), h;
	})();
}
n(["pointerdown", "click"]);
//#endregion
//#region src/render/JunctionFan.tsx
var Tn = /* @__PURE__ */ l("<svg><polygon fill=currentColor stroke=none class=\"text-amber-200 dark:text-sky-800\"></svg>", !1, !0, !1);
function En(e) {
	let n = () => Dn(e.track, e.smoothedWidths, e.bulgeScale);
	return t(d, {
		get each() {
			return n();
		},
		children: (e) => (() => {
			var t = Tn();
			return s(t, "points", e), t;
		})()
	});
}
function Dn(e, t, n) {
	let r = Pe(e), i = [];
	for (let a of r) {
		if (a.members.length < 2) continue;
		let r = [];
		for (let { pieceId: i, endIndex: o } of a.members) {
			let s = e.pieces.find((e) => e.id === i);
			if (!s) continue;
			let c = V(s.type);
			for (let e = 0; e < c.connections.length; e++) {
				let [l, u] = c.connections[e];
				if (l !== o && u !== o) continue;
				let d = U(s.magic ? s.magic.arms[e] : G(c.arms[e], K(s)), l === o ? 0 : 1), f = t.get(`${i}:${e}`), p = l === o ? f?.atobFrom ?? 0 : f?.atobTo ?? 0, m = l === o ? f?.btoaFrom ?? 0 : f?.btoaTo ?? 0;
				if (p > 0) {
					let e = [d.normal[0] * p * n, d.normal[1] * p * n];
					r.push({
						angle: Math.atan2(e[1], e[0]),
						x: a.position[0] + e[0],
						y: a.position[1] + e[1],
						off: e
					});
				}
				if (m > 0) {
					let e = [-d.normal[0] * m * n, -d.normal[1] * m * n];
					r.push({
						angle: Math.atan2(e[1], e[0]),
						x: a.position[0] + e[0],
						y: a.position[1] + e[1],
						off: e
					});
				}
			}
		}
		if (r.length < 2) continue;
		let o = r[0].off, s = [], c = [];
		for (let e of r) (e.off[0] * o[0] + e.off[1] * o[1] >= 0 ? s : c).push(e);
		for (let e of [s, c]) {
			if (e.length < 2) continue;
			e.sort((e, t) => e.angle - t.angle);
			let t = `${a.position[0]},${a.position[1]} ` + e.map((e) => `${e.x},${e.y}`).join(" ");
			i.push(t);
		}
	}
	return i;
}
//#endregion
//#region src/render/bounds.ts
function On(e, t = 1) {
	if (e.pieces.length === 0) return {
		x: -5,
		y: -5,
		width: 10,
		height: 10
	};
	let n = Infinity, r = Infinity, i = -Infinity, a = -Infinity;
	for (let t of e.pieces) {
		let e = t.magic?.bounds ?? V(t.type).bounds, o = t.magic ? null : K(t), s = [
			[e.min[0], e.min[1]],
			[e.min[0], e.max[1]],
			[e.max[0], e.min[1]],
			[e.max[0], e.max[1]]
		];
		for (let e of s) {
			let [t, s] = o ? W(e, o) : e;
			t < n && (n = t), s < r && (r = s), t > i && (i = t), s > a && (a = s);
		}
	}
	return {
		x: n - t,
		y: r - t,
		width: i - n + 2 * t,
		height: a - r + 2 * t
	};
}
//#endregion
//#region src/render/Svg.tsx
var kn = /* @__PURE__ */ l("<svg preserveAspectRatio=\"xMidYMid meet\"><g transform=\"matrix(1 0 0 -1 0 0)\"><g></g><g>");
function An(e) {
	let n = m(() => e.bbox ?? On(e.track)), a = () => {
		let e = n();
		return `${e.x} ${-(e.y + e.height)} ${e.width} ${e.height}`;
	}, o = m(() => e.scores ? ze(e.track, e.scores) : void 0), c = m(() => {
		let t = o();
		if (!t) return 0;
		let n = Ie(t);
		return n <= 0 ? 0 : 50 / n * ((e.bulgeScale ?? 100) / 100);
	});
	return (() => {
		var n = kn(), l = n.firstChild, p = l.firstChild, m = p.nextSibling, h = e.svgRef;
		return typeof h == "function" ? u(h, n) : e.svgRef = n, i(p, t(f, {
			get when() {
				return o();
			},
			get children() {
				return t(En, {
					get track() {
						return e.track;
					},
					get smoothedWidths() {
						return o();
					},
					get bulgeScale() {
						return c();
					}
				});
			}
		}), null), i(p, t(d, {
			get each() {
				return e.track.pieces;
			},
			children: (n) => t(wn, {
				piece: n,
				get scores() {
					return e.scores;
				},
				get smoothedWidths() {
					return o();
				},
				get bulgeScale() {
					return c();
				},
				renderPass: "bulge"
			})
		}), null), i(m, t(d, {
			get each() {
				return e.track.pieces;
			},
			children: (n) => t(wn, {
				piece: n,
				get scores() {
					return e.scores;
				},
				get smoothedWidths() {
					return o();
				},
				get bulgeScale() {
					return e.bulgeScale;
				},
				get showPolarity() {
					return e.showPolarity;
				},
				get showAdapters() {
					return e.showAdapters;
				},
				get selected() {
					return e.selectedPieceIds?.has(n.id);
				},
				get onSelect() {
					return e.onSelectPiece ? (t) => e.onSelectPiece(n.id, t.shiftKey) : void 0;
				},
				get onHoverPiece() {
					return e.onHoverPiece;
				},
				renderPass: "line"
			})
		})), i(l, () => e.children, null), r((t) => {
			var r = a(), i = mn("block h-full w-full text-neutral-900 dark:text-neutral-100", e.class);
			return r !== t.e && s(n, "viewBox", t.e = r), i !== t.t && s(n, "class", t.t = i), t;
		}, {
			e: void 0,
			t: void 0
		}), n;
	})();
}
//#endregion
//#region src/track/builder.ts
function jn(e, t = [0, 0], n = 0, r = 1) {
	let i = {
		id: ke(),
		type: e,
		position: t,
		rotation: n
	}, a = je(i), o = {
		pieceId: i.id,
		endIndex: r
	};
	return {
		track: { pieces: [i] },
		active: {
			...a[r],
			ref: o
		}
	};
}
function Mn(e, t, n = {}) {
	if (!e.active) throw Error("No active end to attach to.");
	let r = n.attachingEndIndex ?? 0, i = n.continueEndIndex ?? 1, a = Me(t, r, e.active);
	if (!a) throw Error(`Polarity mismatch attaching ${t}.ends[${r}] to active end.`);
	let o = V(t).ends.map((e) => Ee(e, {
		position: a.position,
		rotation: a.rotation
	})), s = {
		pieceId: a.id,
		endIndex: i
	};
	return {
		track: { pieces: [...e.track.pieces, a] },
		active: {
			...o[i],
			ref: s
		}
	};
}
//#endregion
//#region src/export/json.ts
function Nn(e) {
	let t = e;
	if (!t || typeof t != "object" || !Array.isArray(t.pieces)) return {
		track: { pieces: [] },
		seed: null
	};
	let n = t.version ?? 1, r = t.pieces.map((e, t) => {
		let r = {
			id: `p${t}`,
			position: e.position,
			rotation: e.rotation
		};
		if (n === 1 && e.mirror) {
			let t = Fn[e.type];
			return {
				...r,
				type: t ?? e.type
			};
		}
		let i = e;
		return {
			...r,
			type: e.type,
			magic: i.magic
		};
	});
	Ae(r.length);
	let i = null;
	if (n >= 4) {
		let e = t.seed;
		e && e.pieceIndex >= 0 && e.pieceIndex < r.length && (i = {
			pieceId: r[e.pieceIndex].id,
			connectionIndex: e.connectionIndex,
			direction: e.direction
		});
	}
	return {
		track: { pieces: r },
		seed: i
	};
}
function Pn(e, t) {
	return !t || t.pieceIndex < 0 || t.pieceIndex >= e.pieces.length ? null : {
		pieceId: e.pieces[t.pieceIndex].id,
		connectionIndex: t.connectionIndex,
		direction: t.direction
	};
}
var Fn = {
	"curve-22": "curve-22-r",
	"curve-45": "curve-45-r",
	"switch-y": "switch-y-r"
}, In = {
	version: 4,
	pieces: [
		{
			type: "switch-parallel-r",
			position: [78.4501036348434, 0],
			rotation: 0
		},
		{
			type: "straight-long",
			position: [-66.50678650839882, 0],
			rotation: 0
		},
		{
			type: "curve-45-l",
			position: [223.40699377808562, 22],
			rotation: 0
		},
		{
			type: "curve-45-l",
			position: [-211.4636766516411, 60.04310985675774],
			rotation: -.7853981633974483
		},
		{
			type: "curve-45-l",
			position: [-271.5067865083989, 205],
			rotation: -1.5707963267948966
		},
		{
			type: "straight-long",
			position: [368.3638839213279, 82.04310985675778],
			rotation: .7853981633974483
		},
		{
			type: "straight-long",
			position: [470.8638839213279, 184.54310985675775],
			rotation: .7853981633974483
		},
		{
			type: "curve-45-r",
			position: [223.40699377808562, -22],
			rotation: 0
		},
		{
			type: "curve-45-r",
			position: [368.3638839213279, -82.04310985675778],
			rotation: -.7853981633974483
		},
		{
			type: "curve-45-r",
			position: [428.4069937780857, -227.00000000000006],
			rotation: -1.5707963267948966
		},
		{
			type: "curve-45-r",
			position: [368.3638839213279, -371.9568901432423],
			rotation: -2.356194490192345
		},
		{
			type: "switch-parallel-mff-l",
			position: [78.4501036348434, -454.00000000000006],
			rotation: 0
		},
		{
			type: "curve-45-r",
			position: [78.4501036348434, -454.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [-66.50678650839885, -393.9568901432423],
			rotation: 2.356194490192345
		},
		{
			type: "switch-parallel-r",
			position: [-169.00678650839882, -291.4568901432423],
			rotation: 2.356194490192345
		},
		{
			type: "straight-long",
			position: [-255.95043732229476, -173.40054095713825],
			rotation: 2.356194490192345
		},
		{
			type: "straight-short",
			position: [-358.45043732229476, -70.90054095713826],
			rotation: 2.356194490192345
		},
		{
			type: "curve-45-r",
			position: [-413.92303758727996, -15.427940692153065],
			rotation: 2.356194490192345
		},
		{
			type: "straight-long",
			position: [-473.9661474440377, 129.5289494510892],
			rotation: 1.5707963267948966
		},
		{
			type: "straight-short",
			position: [-271.5067865083989, 283.4501036348434],
			rotation: -1.5707963267948966
		},
		{
			type: "curve-45-l",
			position: [-211.46367665164115, 428.4069937780857],
			rotation: -2.356194490192345
		},
		{
			type: "curve-45-l",
			position: [-66.5067865083989, 488.45010363484346],
			rotation: 3.141592653589793
		},
		{
			type: "switch-parallel-mff-l",
			position: [-66.5067865083989, 488.45010363484346],
			rotation: 0
		},
		{
			type: "switch-parallel-l",
			position: [223.40699377808554, 532.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [368.3638839213278, 532.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [513.3207740645701, 532.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [658.2776642078122, 532.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [803.2345543510544, 532.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "curve-45-l",
			position: [223.4069937780856, 406.4069937780857],
			rotation: 2.356194490192345
		},
		{
			type: "straight-long",
			position: [325.90699377808545, 303.9069937780856],
			rotation: 2.356194490192344
		},
		{
			type: "straight-long",
			position: [428.40699377808534, 201.40699377808554],
			rotation: 2.356194490192344
		},
		{
			type: "straight-long",
			position: [530.9069937780852, 98.90699377808545],
			rotation: 2.356194490192344
		},
		{
			type: "straight-long",
			position: [633.406993778085, -3.593006221914635],
			rotation: 2.356194490192344
		},
		{
			type: "curve-45-l",
			position: [693.4501036348427, -148.54989636515694],
			rotation: 1.5707963267948957
		},
		{
			type: "curve-45-l",
			position: [633.4069937780848, -293.50678650839916],
			rotation: .7853981633974474
		},
		{
			type: "curve-45-r",
			position: [573.3638839213269, -438.4636766516413],
			rotation: 1.5707963267948957
		},
		{
			type: "curve-45-r",
			position: [633.4069937780845, -583.4205667948836],
			rotation: 2.356194490192344
		},
		{
			type: "curve-45-r",
			position: [778.3638839213266, -643.4636766516415],
			rotation: 3.1415926535897922
		},
		{
			type: "curve-45-r",
			position: [923.3207740645689, -583.4205667948838],
			rotation: -2.356194490192345
		},
		{
			type: "curve-45-r",
			position: [983.3638839213266, -438.46367665164155],
			rotation: -1.5707963267948966
		},
		{
			type: "curve-45-r",
			position: [573.3638839213279, 287.0431098567577],
			rotation: .7853981633974483
		},
		{
			type: "straight-long",
			position: [983.3638839213266, -293.50678650839933],
			rotation: -1.5707963267948966
		},
		{
			type: "switch-parallel-r",
			position: [1005.3638839213266, -148.5498963651571],
			rotation: -1.5707963267948966
		},
		{
			type: "straight-long",
			position: [1005.3638839213266, -3.593006221914891],
			rotation: -1.5707963267948966
		},
		{
			type: "switch-parallel-mff-l",
			position: [1005.3638839213266, -3.593006221914891],
			rotation: 1.5707963267948966
		},
		{
			type: "curve-45-r",
			position: [923.3207740645689, 286.3207740645696],
			rotation: -.7853981633974483
		},
		{
			type: "curve-45-r",
			position: [778.3638839213266, 346.3638839213274],
			rotation: 0
		},
		{
			type: "magic-connector",
			position: [0, 0],
			rotation: 0,
			magic: {
				ends: [{
					position: [778.3638839213266, 346.3638839213274],
					angle: 6.283185307179586,
					polarity: "M"
				}, {
					position: [718.3207740645702, 347.08621971351545],
					angle: 3.141592653589793,
					polarity: "F"
				}],
				arms: [{
					kind: "composite",
					parts: [
						{
							kind: "arc",
							from: [778.3638839213266, 346.3638839213274],
							to: [775.7872986114693, 346.3800767361231],
							center: [778.3638839213266, 551.3638839213274],
							radius: 205,
							ccw: !1
						},
						{
							kind: "line",
							from: [775.7872986114693, 346.3800767361231],
							to: [720.8973593744275, 347.0700268987198]
						},
						{
							kind: "arc",
							from: [720.8973593744275, 347.0700268987198],
							to: [718.3207740645702, 347.08621971351545],
							center: [718.3207740645702, 142.08621971351545],
							radius: 205,
							ccw: !0
						}
					]
				}],
				bounds: {
					min: [513.3207740645702, -62.91378028648455],
					max: [983.3638839213266, 756.3638839213274]
				}
			}
		},
		{
			type: "straight-nub",
			position: [818.8392501862406, 532.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "curve-45-l",
			position: [963.7961403294829, 472.4069937780857],
			rotation: 2.356194490192345
		},
		{
			type: "curve-45-l",
			position: [1023.8392501862405, 327.45010363484334],
			rotation: 1.5707963267948957
		},
		{
			type: "magic-connector",
			position: [0, 0],
			rotation: 0,
			magic: {
				ends: [{
					position: [1023.8392501862405, 327.45010363484334],
					angle: 7.853981633974482,
					polarity: "M"
				}, {
					position: [1027.3638839213268, 141.36388392132733],
					angle: 4.71238898038469,
					polarity: "M"
				}],
				arms: [{
					kind: "composite",
					parts: [
						{
							kind: "arc",
							from: [1023.8392501862405, 327.45010363484334],
							to: [1023.8776314014733, 323.4833889831694],
							center: [1228.8392501862404, 327.4501036348431],
							radius: 205,
							ccw: !0
						},
						{
							kind: "line",
							from: [1023.8776314014733, 323.4833889831694],
							to: [1027.3255027060939, 145.33059857300103]
						},
						{
							kind: "arc",
							from: [1027.3255027060939, 145.33059857300103],
							to: [1027.3638839213268, 141.36388392132733],
							center: [822.3638839213268, 141.36388392132733],
							radius: 205,
							ccw: !1
						}
					]
				}],
				bounds: {
					min: [617.3638839213268, -63.63611607867267],
					max: [1433.8392501862404, 532.4501036348431]
				}
			}
		},
		{
			type: "straight-long",
			position: [78.45010363484332, 554.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [-66.5067865083989, 554.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "straight-tiny",
			position: [-211.46367665164112, 554.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "curve-45-l",
			position: [-271.5067865083989, 554.4501036348435],
			rotation: 3.141592653589793
		},
		{
			type: "curve-45-l",
			position: [-416.4636766516411, 494.4069937780857],
			rotation: -2.356194490192345
		},
		{
			type: "magic-connector",
			position: [0, 0],
			rotation: 0,
			magic: {
				ends: [{
					position: [-476.5067865083988, 349.4501036348434],
					angle: 1.5707963267948966,
					polarity: "F"
				}, {
					position: [-473.9661474440377, 274.4858395943314],
					angle: 4.71238898038469,
					polarity: "F"
				}],
				arms: [{
					kind: "composite",
					parts: [
						{
							kind: "arc",
							from: [-476.5067865083988, 349.4501036348434],
							to: [-476.3605134897459, 341.70733011034406],
							center: [-271.5067865083988, 349.4501036348434],
							radius: 205,
							ccw: !0
						},
						{
							kind: "line",
							from: [-476.3605134897459, 341.70733011034406],
							to: [-474.1124204626906, 282.22861311883076]
						},
						{
							kind: "arc",
							from: [-474.1124204626906, 282.22861311883076],
							to: [-473.9661474440377, 274.4858395943314],
							center: [-678.9661474440377, 274.4858395943314],
							radius: 205,
							ccw: !1
						}
					]
				}],
				bounds: {
					min: [-883.9661474440377, 69.48583959433142],
					max: [-66.50678650839882, 554.4501036348433]
				}
			}
		},
		{
			type: "straight-long",
			position: [1027.3638839213268, -293.50678650839933],
			rotation: -1.5707963267948966
		},
		{
			type: "straight-long",
			position: [1027.3638839213268, -438.46367665164155],
			rotation: -1.5707963267948966
		},
		{
			type: "curve-45-r",
			position: [1027.3638839213268, -583.4205667948838],
			rotation: -1.5707963267948966
		},
		{
			type: "curve-45-r",
			position: [967.320774064569, -728.3774569381261],
			rotation: -2.356194490192345
		},
		{
			type: "switch-parallel-r",
			position: [822.3638839213268, -788.4205667948838],
			rotation: 3.141592653589793
		},
		{
			type: "magic-connector",
			position: [0, 0],
			rotation: 0,
			magic: {
				ends: [{
					position: [677.4069937780846, -766.4205667948838],
					angle: 6.283185307179586,
					polarity: "F"
				}, {
					position: [223.40699377808562, -476.00000000000006],
					angle: 3.141592653589793,
					polarity: "M"
				}],
				arms: [{
					kind: "composite",
					parts: [
						{
							kind: "arc",
							from: [677.4069937780846, -766.4205667948838],
							to: [529.7231108514159, -703.5981695447614],
							center: [677.4069937780846, -561.4205667948838],
							radius: 205,
							ccw: !1
						},
						{
							kind: "line",
							from: [529.7231108514159, -703.5981695447614],
							to: [371.09087670475435, -538.8223972501224]
						},
						{
							kind: "arc",
							from: [371.09087670475435, -538.8223972501224],
							to: [223.40699377808562, -476.00000000000006],
							center: [223.40699377808562, -681],
							radius: 205,
							ccw: !0
						}
					]
				}],
				bounds: {
					min: [18.40699377808562, -886],
					max: [882.4069937780846, -356.4205667948838]
				}
			}
		},
		{
			type: "curve-45-l",
			position: [-287.0631356945028, -204.51323932934633],
			rotation: 2.356194490192345
		},
		{
			type: "curve-45-l",
			position: [-432.0200258377451, -144.47012947258858],
			rotation: 3.141592653589793
		},
		{
			type: "curve-45-l",
			position: [-576.9769159809873, -204.51323932934633],
			rotation: -2.356194490192345
		},
		{
			type: "straight-long",
			position: [-637.020025837745, -349.4701294725886],
			rotation: -1.5707963267948966
		},
		{
			type: "straight-long",
			position: [-637.020025837745, -494.42701961583083],
			rotation: -1.5707963267948966
		},
		{
			type: "curve-45-l",
			position: [-637.020025837745, -639.383909759073],
			rotation: -1.5707963267948966
		},
		{
			type: "curve-45-l",
			position: [-576.9769159809872, -784.3407999023153],
			rotation: -.7853981633974483
		},
		{
			type: "straight-long",
			position: [-432.0200258377449, -844.383909759073],
			rotation: 0
		},
		{
			type: "straight-long",
			position: [-287.0631356945027, -844.383909759073],
			rotation: 0
		},
		{
			type: "straight-long",
			position: [-142.10624555126049, -844.383909759073],
			rotation: 0
		},
		{
			type: "straight-long",
			position: [2.850644591981734, -844.383909759073],
			rotation: 0
		},
		{
			type: "straight-long",
			position: [147.80753473522395, -844.383909759073],
			rotation: 0
		},
		{
			type: "straight-long",
			position: [292.7644248784662, -844.383909759073],
			rotation: 0
		},
		{
			type: "magic-connector",
			position: [0, 0],
			rotation: 0,
			magic: {
				ends: [{
					position: [437.7213150217084, -844.383909759073],
					angle: 3.141592653589793,
					polarity: "F"
				}, {
					position: [677.4069937780846, -810.4205667948838],
					angle: 6.283185307179586,
					polarity: "F"
				}],
				arms: [{
					kind: "composite",
					parts: [
						{
							kind: "arc",
							from: [437.7213150217084, -844.383909759073],
							to: [471.04822615178807, -841.6567873144384],
							center: [437.7213150217084, -639.383909759073],
							radius: 205,
							ccw: !0
						},
						{
							kind: "line",
							from: [471.04822615178807, -841.6567873144384],
							to: [644.0800826480049, -813.1476892395185]
						},
						{
							kind: "arc",
							from: [644.0800826480049, -813.1476892395185],
							to: [677.4069937780846, -810.4205667948838],
							center: [677.4069937780846, -1015.4205667948838],
							radius: 205,
							ccw: !1
						}
					]
				}],
				bounds: {
					min: [232.7213150217084, -1220.4205667948838],
					max: [882.4069937780846, -434.38390975907305]
				}
			}
		}
	]
};
//#endregion
//#region src/layouts/presets.ts
function Ln() {
	let e = jn("curve-45-l");
	for (let t = 0; t < 7; t++) e = Mn(e, "curve-45-l");
	return e.track;
}
function Rn() {
	let e = jn("straight-long");
	e = Mn(e, "switch-y-l", { continueEndIndex: 1 }), e = Mn(e, "curve-22-l"), e = Mn(e, "straight-short");
	let t = e.track, n = t.pieces.find((e) => e.type === "switch-y-l"), r = {
		track: t,
		active: {
			...je(n)[2],
			ref: {
				pieceId: n.id,
				endIndex: 2
			}
		}
	};
	return r = Mn(r, "curve-22-r"), r = Mn(r, "straight-short"), r.track;
}
var zn = {
	version: 4,
	pieces: [
		{
			type: "curve-45-l",
			position: [-144.95689014324228, 60.04310985675774],
			rotation: -.7853981633974483
		},
		{
			type: "curve-45-l",
			position: [-205.00000000000006, 205],
			rotation: -1.5707963267948966
		},
		{
			type: "curve-45-l",
			position: [-144.95689014324233, 349.9568901432423],
			rotation: -2.356194490192345
		},
		{
			type: "curve-45-l",
			position: [-8526512829121202e-29, 410.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "straight-short",
			position: [78.45010363484332, 410.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [223.40699377808554, 410.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [368.3638839213278, 410.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [78.4501036348434, 0],
			rotation: 0
		},
		{
			type: "straight-long",
			position: [223.40699377808562, 0],
			rotation: 0
		},
		{
			type: "straight-short",
			position: [368.36388392132784, 0],
			rotation: 0
		},
		{
			type: "curve-45-l",
			position: [591.7708776994134, 349.9568901432423],
			rotation: 2.356194490192345
		},
		{
			type: "curve-45-l",
			position: [651.813987556171, 204.99999999999997],
			rotation: 1.5707963267948957
		},
		{
			type: "curve-45-l",
			position: [591.7708776994132, 60.04310985675775],
			rotation: .7853981633974474
		},
		{
			type: "curve-45-l",
			position: [446.8139875561709, 9947598300641403e-29],
			rotation: -8881784197001252e-31
		},
		{
			type: "straight-short",
			position: [0, 0],
			rotation: 0
		},
		{
			type: "straight-short",
			position: [446.8139875561712, 410.00000000000006],
			rotation: 3.141592653589793
		}
	],
	seed: {
		pieceIndex: 7,
		connectionIndex: 0,
		direction: "AtoB"
	}
};
function Bn() {
	return Nn(zn).track;
}
var Vn = {
	version: 4,
	pieces: [
		{
			type: "switch-turn-l",
			position: [0, 0],
			rotation: 0
		},
		{
			type: "curve-45-l",
			position: [-144.95689014324228, 60.04310985675774],
			rotation: -.7853981633974483
		},
		{
			type: "curve-45-l",
			position: [-205.00000000000006, 205],
			rotation: -1.5707963267948966
		},
		{
			type: "curve-45-l",
			position: [-144.95689014324233, 349.9568901432423],
			rotation: -2.356194490192345
		},
		{
			type: "curve-45-l",
			position: [-8526512829121202e-29, 410.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "straight-short",
			position: [78.45010363484332, 410.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [223.40699377808554, 410.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [368.3638839213278, 410.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "straight-long",
			position: [78.4501036348434, 0],
			rotation: 0
		},
		{
			type: "straight-long",
			position: [223.40699377808562, 0],
			rotation: 0
		},
		{
			type: "straight-short",
			position: [368.36388392132784, 0],
			rotation: 0
		},
		{
			type: "switch-turn-l",
			position: [446.8139875561712, 410.00000000000006],
			rotation: 3.141592653589793
		},
		{
			type: "magic-connector",
			position: [0, 0],
			rotation: 0,
			magic: {
				ends: [{
					position: [78.45010363484342, 15.60469583518622],
					angle: 3.5342917352885173,
					polarity: "F"
				}, {
					position: [368.3638839213278, 394.39530416481387],
					angle: 6.675884388878311,
					polarity: "F"
				}],
				arms: [{
					kind: "composite",
					parts: [
						{
							kind: "arc",
							from: [78.45010363484342, 15.60469583518622],
							to: [188.1095989400593, 123.51516222873086],
							center: [14210854715202004e-30, 205],
							radius: 205,
							ccw: !0
						},
						{
							kind: "line",
							from: [188.1095989400593, 123.51516222873086],
							to: [258.70438861611194, 286.4848377712692]
						},
						{
							kind: "arc",
							from: [258.70438861611194, 286.4848377712692],
							to: [368.3638839213278, 394.39530416481387],
							center: [446.8139875561712, 205.00000000000006],
							radius: 205,
							ccw: !1
						}
					]
				}],
				bounds: {
					min: [-205, 0],
					max: [651.8139875561712, 410.00000000000006]
				}
			}
		},
		{
			type: "curve-45-l",
			position: [591.7708776994134, 349.9568901432423],
			rotation: 2.356194490192345
		},
		{
			type: "curve-45-l",
			position: [651.813987556171, 204.99999999999997],
			rotation: 1.5707963267948957
		},
		{
			type: "curve-45-l",
			position: [591.7708776994132, 60.04310985675775],
			rotation: .7853981633974474
		},
		{
			type: "curve-45-l",
			position: [446.8139875561709, 9947598300641403e-29],
			rotation: -8881784197001252e-31
		}
	],
	seed: {
		pieceIndex: 8,
		connectionIndex: 0,
		direction: "AtoB"
	}
};
function Hn() {
	return Nn(Vn).track;
}
function Un() {
	return Nn(In).track;
}
var Wn = [
	{
		id: "oval",
		label: "Oval",
		description: "Closed loop, no switches. Stationary distribution is uniform; bulges are fully one-sided.",
		closed: !0,
		seed: zn.seed,
		build: Bn
	},
	{
		id: "oval-diagonal",
		label: "Oval with diagonal",
		description: "Oval with a diagonal cross-cut using turnout switches and a magic connector.",
		closed: !0,
		seed: Vn.seed,
		build: Hn
	},
	{
		id: "complex",
		label: "Complex track",
		description: "Large multi-loop layout with parallel switches and magic-connector crossings. Fully closed (no free ends).",
		closed: !0,
		build: Un
	},
	{
		id: "circle",
		label: "Closed circle",
		description: "Smallest closed loop: 8 × curve-45.",
		closed: !0,
		build: Ln
	},
	{
		id: "switch-stubs",
		label: "Y switch with stubs",
		description: "Trunk straight, Y switch, dead-end stub on each branch. With reflect policy the trunk arm sees ~2× the traffic of each branch.",
		closed: !1,
		build: Rn
	}
];
function Gn(e) {
	return Wn.find((t) => t.id === e) ?? null;
}
//#endregion
//#region src/embed/resolve.ts
function Kn(e) {
	return !!e && typeof e == "object" && Array.isArray(e.pieces) && e.pieces.every((e) => typeof e.id == "string");
}
function qn(e) {
	if (e.preset) {
		let t = Gn(e.preset);
		return {
			track: t ? t.build() : { pieces: [] },
			seed: null
		};
	}
	if (Kn(e.track)) return {
		track: e.track,
		seed: null
	};
	let { track: t, seed: n } = Nn(e.track);
	return {
		track: t,
		seed: n
	};
}
function Jn(e, t) {
	if (t) {
		let n = {
			pieceIndex: t.pieceIndex,
			connectionIndex: t.connectionIndex ?? 0,
			direction: t.direction ?? "AtoB"
		};
		return Pn(e.track, n);
	}
	return e.seed ? e.seed : e.track.pieces.length === 0 ? null : {
		pieceId: e.track.pieces[0].id,
		connectionIndex: 0,
		direction: "AtoB"
	};
}
//#endregion
//#region src/embed/TrackFigure.tsx
var Yn = /* @__PURE__ */ l("<div>");
function Xn(n) {
	let a = m(() => qn(n)), o = m(() => On(a().track, n.padding ?? 2));
	return (() => {
		var s = Yn();
		return i(s, t(An, {
			get track() {
				return a().track;
			},
			get bbox() {
				return o();
			},
			get showAdapters() {
				return n.showAdapters ?? !1;
			}
		})), r(() => e(s, `tt-embed ${n.class ?? ""}`)), s;
	})();
}
//#endregion
//#region src/scoring/states.ts
function Zn(e) {
	let t = Pe(e), n = [], r = /* @__PURE__ */ new Map();
	for (let t of e.pieces) {
		let e = V(t.type);
		for (let i = 0; i < e.connections.length; i++) for (let e of ["AtoB", "BtoA"]) {
			let a = {
				pieceId: t.id,
				connectionIndex: i,
				direction: e
			}, o = `${a.pieceId}:${a.connectionIndex}:${a.direction}`;
			r.set(o, n.length), n.push(a);
		}
	}
	return {
		states: n,
		index: r,
		junctions: t
	};
}
function Qn(e, t, n = "reflect") {
	let r = [], i = new Map(e.pieces.map((e) => [e.id, e]));
	for (let e of t.states) {
		let a = i.get(e.pieceId), [o, s] = V(a.type).connections[e.connectionIndex], c = e.direction === "AtoB" ? s : o, l = Fe(t.junctions, {
			pieceId: a.id,
			endIndex: c
		}), u = [];
		if (l) for (let e of l.members) {
			if (e.pieceId === a.id && e.endIndex === c) continue;
			let t = V(i.get(e.pieceId).type);
			for (let n = 0; n < t.connections.length; n++) {
				let [r, i] = t.connections[n];
				r === e.endIndex ? u.push({
					pieceId: e.pieceId,
					connectionIndex: n,
					direction: "AtoB"
				}) : i === e.endIndex && u.push({
					pieceId: e.pieceId,
					connectionIndex: n,
					direction: "BtoA"
				});
			}
		}
		if (u.length === 0) {
			if (n === "reflect") {
				let n = e.direction === "AtoB" ? "BtoA" : "AtoB", i = `${e.pieceId}:${e.connectionIndex}:${n}`;
				r.push([{
					col: t.index.get(i),
					p: 1
				}]);
			} else {
				let n = `${e.pieceId}:${e.connectionIndex}:${e.direction}`;
				r.push([{
					col: t.index.get(n),
					p: 1
				}]);
			}
			continue;
		}
		let d = 1 / u.length, f = [];
		for (let e of u) {
			let n = `${e.pieceId}:${e.connectionIndex}:${e.direction}`;
			f.push({
				col: t.index.get(n),
				p: d
			});
		}
		r.push(f);
	}
	return r;
}
//#endregion
//#region src/scoring/stationary.ts
function $n(e, t = {}) {
	let n = t.iterations ?? 500, r = t.deadEndPolicy ?? "reflect", i = Zn(e), a = i.states.length, o = /* @__PURE__ */ new Map();
	if (a === 0) return {
		scores: o,
		spectralGap: 0
	};
	let s = Qn(e, i, r), c = new Float64Array(a);
	for (let e = 0; e < a; e++) c[e] = 1 / a;
	let l = new Float64Array(a), u = 0, d = 0;
	for (let e = 0; e < n; e++) {
		l.fill(0);
		for (let e = 0; e < a; e++) {
			let t = c[e];
			if (t === 0) continue;
			let n = s[e];
			for (let e = 0; e < n.length; e++) l[n[e].col] += t * n[e].p;
		}
		let t = 0;
		for (let e = 0; e < a; e++) t += l[e];
		if (t > 0) for (let e = 0; e < a; e++) l[e] /= t;
		if (e >= n - 4) {
			let e = 0;
			for (let t = 0; t < a; t++) e += Math.abs(l[t] - c[t]);
			u > 1e-15 && (d = e / u), u = e;
		}
		let r = c;
		c = l, l = r;
	}
	let f = Math.max(0, Math.min(1, 1 - d));
	return i.states.forEach((e, t) => {
		o.set(Be(e), c[t]);
	}), {
		scores: o,
		spectralGap: f
	};
}
//#endregion
//#region src/scoring/transitions.ts
function er(e) {
	let t = e >>> 0;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function tr(e, t) {
	if (e.length === 1) return e[0].col;
	let n = t(), r = 0, i = e[e.length - 1].col;
	for (let t = 0; t < e.length; t++) if (r += e[t].p, n < r) {
		i = e[t].col;
		break;
	}
	return i;
}
//#endregion
//#region src/scoring/montecarlo.ts
function nr(e, t = {}) {
	let n = t.steps ?? 1e5, r = t.deadEndPolicy ?? "reflect", i = Zn(e), a = i.states.length, o = /* @__PURE__ */ new Map();
	if (a === 0) return o;
	let s = Qn(e, i, r), c = er(t.seed ?? Date.now()), l = new Uint32Array(a), u = t.startState?.direction ?? t.startDirection ?? (c() < .5 ? "AtoB" : "BtoA"), d = i.states.reduce((e, t, n) => (t.direction === u && e.push(n), e), []), f = Math.max(64, Math.min(512, Math.ceil(n / 5e3))), p = Math.max(1, Math.floor(n / f));
	for (let e = 0; e < f; e++) {
		let e = d[Math.floor(c() * d.length)];
		for (let t = 0; t < p; t++) l[e] += 1, e = tr(s[e], c);
	}
	let m = 0;
	for (let e = 0; e < a; e++) m += l[e];
	return i.states.forEach((e, t) => {
		o.set(Be(e), l[t] / m);
	}), o;
}
//#endregion
//#region src/scoring/piece-stats.ts
function rr(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e.pieces) {
		let e = V(r.type), i = 0, a = 0;
		for (let n = 0; n < e.connections.length; n++) i += t.get(`${r.id}:${n}:AtoB`) ?? 0, a += t.get(`${r.id}:${n}:BtoA`) ?? 0;
		n.set(r.id, {
			total: i + a,
			atob: i,
			btoa: a
		});
	}
	return n;
}
function ir(e) {
	let t = [...e.values()].filter((e) => e > 0);
	return t.length === 0 ? 0 : t.reduce((e, t) => e - t * Math.log(t), 0) / Math.log(t.length);
}
function ar(e) {
	let t = [...e.values()].filter((e) => e > 0), n = t.length;
	if (n <= 1) return 0;
	let r = 0;
	for (let e = 0; e < n; e++) for (let i = e + 1; i < n; i++) r += Math.abs(t[e] - t[i]);
	return r / (n - 1);
}
function or(e) {
	let t = 0;
	for (let n of e.pieces) if (n.magic) for (let e of n.magic.arms) t += H(e);
	else {
		let e = V(n.type);
		for (let n of e.arms) t += H(n);
	}
	return t;
}
function sr(e) {
	if (e.magic) {
		let t = 0;
		for (let n of e.magic.arms) t += H(n);
		return t;
	}
	let t = V(e.type), n = 0;
	for (let e of t.arms) n += H(e);
	return n;
}
function cr(e, t, n) {
	let r = 0;
	for (let t of e.pieces) r += sr(t);
	let i = 0, a = 0;
	for (let r of e.pieces) {
		let e = V(r.type), o = sr(r), s = !1, c = !1;
		for (let i = 0; i < e.connections.length; i++) {
			let e = n(t.get(`${r.id}:${i}:AtoB`) ?? 0, t.get(`${r.id}:${i}:BtoA`) ?? 0);
			e.visited && (s = !0), e.bidir && (c = !0);
		}
		s && (i += o), c && (a += o);
	}
	return {
		utilizedLength: i,
		bidirectionalLength: a,
		totalLength: r
	};
}
function lr(e, t) {
	let n = t.size > 0 ? 1 / (t.size * 10) : 0;
	return cr(e, t, (e, t) => ({
		visited: e > n || t > n,
		bidir: e > n && t > n
	}));
}
function ur(e, t) {
	return cr(e, t, (e, t) => ({
		visited: e < 6 || t < 6,
		bidir: e < 12 && t < 12
	}));
}
//#endregion
//#region src/embed/i18n.ts
var dr = {
	en: {
		paused: "paused",
		max: "max",
		pauseAriaLabel: "pause",
		playAriaLabel: "play",
		speedAriaLabel: "simulation speed",
		resetButton: "Reset",
		entropy: "entropy",
		gini: "gini",
		trackLength: "track length",
		utilized: "% utilized",
		bidirectional: "% bidirectional",
		traveled: "m traveled",
		trackLabel: "Track",
		graphLabel: "Graph",
		morphAriaLabel: "track to graph"
	},
	nl: {
		paused: "gepauzeerd",
		max: "max",
		pauseAriaLabel: "pauzeren",
		playAriaLabel: "afspelen",
		speedAriaLabel: "simulatiesnelheid",
		resetButton: "Opnieuw",
		entropy: "entropie",
		gini: "gini",
		trackLength: "baanlengte",
		utilized: "% benut",
		bidirectional: "% bidirectioneel",
		traveled: "m gereden",
		trackLabel: "Baan",
		graphLabel: "Graaf",
		morphAriaLabel: "baan naar graaf"
	}
};
function fr(e) {
	return dr[e ?? "en"] ?? dr.en;
}
//#endregion
//#region src/embed/TrackScoring.tsx
var pr = /* @__PURE__ */ l("<div><div class=tt-stage>"), mr = /* @__PURE__ */ l("<div class=tt-entropy>");
function hr(n) {
	let o = m(() => qn(n)), c = m(() => On(o().track, n.padding ?? 2)), l = m(() => {
		let e = o();
		if (e.track.pieces.length !== 0) {
			if (n.mode === "mc") {
				let t = Jn(e, n.seed);
				return {
					scores: nr(e.track, {
						steps: T,
						startState: t ?? void 0
					}),
					spectralGap: null
				};
			}
			return $n(e.track);
		}
	}), u = m(() => l()?.scores), d = m(() => {
		let e = u();
		return e ? lr(o().track, e) : null;
	}), f = m(() => {
		let e = d();
		if (!e) return null;
		let t = fr(n.lang), r = (t) => Math.round(t / e.totalLength * 100), i = (e.totalLength / 1e3).toFixed(2), a = `${t.trackLength} ${i} m · ${r(e.utilizedLength)}${t.utilized} · ${r(e.bidirectionalLength)}${t.bidirectional}`;
		if (!n.advancedStats) return a;
		let o = u();
		return `${t.entropy} ${ir(o).toFixed(3)} · ${t.gini} ${ar(o).toFixed(3)} · ${a}`;
	});
	return (() => {
		var l = pr(), d = l.firstChild;
		return i(d, t(An, {
			get track() {
				return o().track;
			},
			get bbox() {
				return c();
			},
			get scores() {
				return u();
			},
			get bulgeScale() {
				return n.bulgeScale ?? 100;
			}
		}), null), i(d, (() => {
			var e = a(() => !!f());
			return () => e() && (() => {
				var e = mr();
				return i(e, f), e;
			})();
		})(), null), r((t) => {
			var r = `tt-embed ${n.class ?? ""}`, i = n.advancedStats || void 0;
			return r !== t.e && e(l, t.e = r), i !== t.t && s(d, "data-advanced", t.t = i), t;
		}, {
			e: void 0,
			t: void 0
		}), l;
	})();
}
//#endregion
//#region src/render/Train.tsx
var gr = /* @__PURE__ */ l("<svg><g></svg>", !1, !0, !1), _r = /* @__PURE__ */ l("<svg><rect x=-15 y=-10 width=30 height=20 rx=3></svg>", !1, !0, !1), vr = /* @__PURE__ */ l("<svg><polygon points=\"15,-10 15,10 25,0\"></svg>", !1, !0, !1), yr = /* @__PURE__ */ l("<svg><g class=\"text-blue-400 dark:text-amber-300\"fill=currentColor stroke=none style=pointer-events:none></svg>", !1, !0, !1);
function br(e, t) {
	let n = t.pieces.find((t) => t.id === e.pieceId);
	return n ? n.magic ? n.magic.arms[e.connectionIndex] ?? null : G(V(n.type).arms[e.connectionIndex], K(n)) : null;
}
function xr(e, t, n) {
	let r = e.state, i = e.sampleT, a = e.armLen, o = e.arm, s = n, c = 0;
	for (let n = 0; n < e.trail.length + 1; n++) {
		let n = r.direction === "AtoB" ? i * a : (1 - i) * a;
		if (s <= n) {
			let e = s / a, t = r.direction === "AtoB" ? i - e : i + e, n = U(o, Math.max(0, Math.min(1, t))), c = r.direction === "AtoB" ? n.tangent : [-n.tangent[0], -n.tangent[1]];
			return {
				position: n.point,
				tangent: c
			};
		}
		s -= n;
		let l = e.trail[c++] ?? null;
		if (!l) {
			let e = r.direction === "AtoB" ? 0 : 1, t = U(o, e), n = r.direction === "AtoB" ? t.tangent : [-t.tangent[0], -t.tangent[1]];
			return {
				position: [t.point[0] - n[0] * s, t.point[1] - n[1] * s],
				tangent: n
			};
		}
		r = l;
		let u = br(r, t);
		if (!u) break;
		o = u, a = H(o), i = +(r.direction === "AtoB");
	}
	return {
		position: e.position,
		tangent: e.tangent
	};
}
function Sr(e) {
	return Math.atan2(e[1], e[0]) * 180 / Math.PI;
}
function Cr(e) {
	return (() => {
		var t = gr();
		return i(t, () => e.children), r((n) => {
			var r = `translate(${e.position[0]} ${e.position[1]}) rotate(${Sr(e.tangent)})`, i = e.opacity;
			return r !== n.e && s(t, "transform", n.e = r), i !== n.t && s(t, "opacity", n.t = i), n;
		}, {
			e: void 0,
			t: void 0
		}), t;
	})();
}
var wr = 38, Tr = 76;
function Er(e) {
	let n = () => xr(e.walker, e.track, wr), r = () => xr(e.walker, e.track, Tr);
	return (() => {
		var a = yr();
		return i(a, t(Cr, {
			get position() {
				return r().position;
			},
			get tangent() {
				return r().tangent;
			},
			opacity: 1,
			get children() {
				return _r();
			}
		}), null), i(a, t(Cr, {
			get position() {
				return n().position;
			},
			get tangent() {
				return n().tangent;
			},
			opacity: 1,
			get children() {
				return _r();
			}
		}), null), i(a, t(Cr, {
			get position() {
				return e.walker.position;
			},
			get tangent() {
				return e.walker.tangent;
			},
			get children() {
				return [_r(), vr()];
			}
		}), null), a;
	})();
}
//#endregion
//#region src/scoring/live-montecarlo.ts
var Dr = 20, Or = 5e3;
function kr(e, t = !0) {
	if (e <= 0) return { kind: "paused" };
	if (e >= 100 && t) return { kind: "snap" };
	let n = t ? (e - 1) / 98 : (e - 1) / 99;
	return {
		kind: "running",
		unitsPerSecond: Dr * (Or / Dr) ** +Math.max(0, Math.min(1, n))
	};
}
function Ar(e) {
	let t = e.deadEndPolicy ?? "reflect", n = er((Date.now() ^ 2654435769) >>> 0), r = null, i = null, a = 0, o = null, [s, c] = h(/* @__PURE__ */ new Map()), [l, u] = h(/* @__PURE__ */ new Map()), [d, f] = h(null), [m, v] = h(0);
	function y(r) {
		let i = Zn(r);
		if (i.states.length === 0) return null;
		let a = Qn(r, i, t), o = new Uint32Array(i.states.length), s = e.seed?.() ?? null, c = s ? i.index.get(Be(s)) ?? null : null, l = c === null ? Math.floor(n() * i.states.length) : c, u = new Float64Array(i.states.length).fill(-Infinity);
		return u[l] = 0, {
			enumerated: i,
			P: a,
			counts: o,
			currentIdx: l,
			armT: 0,
			trail: [],
			traveledDist: 0,
			lastVisitDist: u,
			trackLength: or(r)
		};
	}
	function b() {
		if (!r) {
			c(/* @__PURE__ */ new Map()), u(/* @__PURE__ */ new Map()), v(0);
			return;
		}
		let { enumerated: e, counts: t, lastVisitDist: n, traveledDist: i, trackLength: a } = r, o = /* @__PURE__ */ new Map(), s = 0;
		for (let e = 0; e < t.length; e++) s += t[e];
		s === 0 ? e.states.forEach((e) => o.set(Be(e), 0)) : e.states.forEach((e, n) => {
			o.set(Be(e), t[n] / s);
		});
		let l = /* @__PURE__ */ new Map();
		e.states.forEach((e, t) => {
			let r = a > 0 ? (i - n[t]) / a : 0;
			l.set(Be(e), r);
		}), c(o), u(l), v(i);
	}
	function x(e, t) {
		let n = t.pieces.find((t) => t.id === e.pieceId);
		return n ? n.magic ? n.magic.arms[e.connectionIndex] : G(V(n.type).arms[e.connectionIndex], K(n)) : null;
	}
	function S(e) {
		if (!r) return null;
		let t = r.enumerated.states[r.currentIdx], n = x(t, e);
		if (!n) return null;
		let i = t.direction === "AtoB" ? r.armT : 1 - r.armT, a = U(n, Math.max(0, Math.min(1, i))), o = t.direction === "AtoB" ? a.tangent : [-a.tangent[0], -a.tangent[1]], s = H(n);
		return {
			position: a.point,
			tangent: o,
			pieceId: t.pieceId,
			state: t,
			arm: n,
			sampleT: i,
			armLen: s,
			direction: t.direction,
			trail: r.trail
		};
	}
	function C(e, t) {
		let n = x(e, t);
		return n ? H(n) : 1;
	}
	function w() {
		let t = e.track();
		r = y(t), i = null, b(), f(S(t));
	}
	p(() => {
		e.track(), w();
	});
	function T(t) {
		if (o = requestAnimationFrame(T), !e.enabled()) {
			d() !== null && f(null), i = null;
			return;
		}
		if (!r) return;
		let s = e.track();
		f(S(s));
		let c = e.speed();
		if (c.kind !== "running") {
			i = null;
			return;
		}
		if (i === null) {
			i = t;
			return;
		}
		let l = Math.min(.25, (t - i) / 1e3);
		i = t;
		let u = C(r.enumerated.states[r.currentIdx], s);
		r.armT += l * c.unitsPerSecond / Math.max(u, 1e-6);
		let p = 0;
		for (; r.armT >= 1 && p < 1e3;) {
			let e = (r.armT - 1) * u;
			r.counts[r.currentIdx] += 1, r.traveledDist += u, r.lastVisitDist[r.currentIdx] = r.traveledDist, r.trail.unshift(r.enumerated.states[r.currentIdx]), r.trail.length > 8 && (r.trail.length = 8), r.currentIdx = tr(r.P[r.currentIdx], n), u = C(r.enumerated.states[r.currentIdx], s), r.armT = e / Math.max(u, 1e-6), p += 1;
		}
		r.armT > 1 && (r.armT = 0), f(S(s)), t - a > 33 && (b(), a = t);
	}
	_(() => {
		o = requestAnimationFrame(T);
	}), g(() => {
		o !== null && cancelAnimationFrame(o);
	});
	function E() {
		return r ? r.enumerated.states[r.currentIdx]?.direction ?? null : null;
	}
	return {
		scores: s,
		recentScores: l,
		walker: d,
		reset: w,
		currentDirection: E,
		totalDistance: m
	};
}
//#endregion
//#region src/embed/TrackLiveMC.tsx
var jr = /* @__PURE__ */ l("<div><div class=tt-stage><div class=tt-entropy></div></div><div class=tt-controls><button type=button class=tt-playpause></button><div class=tt-slider><span class=tt-speed-label></span><input type=range min=0 max=100 step=1></div><button type=button class=tt-reset>"), Mr = /* @__PURE__ */ l("<div class=tt-tooltip><div class=tt-tooltip-total>%</div><div class=tt-tooltip-split>→ <!>% / ← <!>%"), Nr = /* @__PURE__ */ l("<svg width=12 height=12 viewBox=\"0 0 12 12\"fill=currentColor aria-hidden=true><rect x=0 y=0 width=4 height=12 rx=0.5></rect><rect x=8 y=0 width=4 height=12 rx=0.5>"), Pr = /* @__PURE__ */ l("<svg width=12 height=12 viewBox=\"0 0 12 12\"fill=currentColor aria-hidden=true><polygon points=\"0,0 12,6 0,12\">");
function Fr(n) {
	let o = m(() => qn(n)), l = m(() => On(o().track, n.padding ?? 2)), d = m(() => Jn(o(), n.seed)), [p, v] = h(n.initialSpeed ?? 20), [y, b] = h(!0), [x, S] = h(!1), C;
	_(() => {
		if (!C || typeof IntersectionObserver > "u") {
			S(!0);
			return;
		}
		let e = new IntersectionObserver((e) => e.forEach((e) => S(e.isIntersecting)), { threshold: .25 });
		e.observe(C), g(() => e.disconnect());
	});
	let w = Ar({
		track: () => o().track,
		speed: m(() => y() && x() ? kr(p(), !1) : { kind: "paused" }),
		enabled: () => !0,
		seed: d
	}), [T, E] = h(null), [D, O] = h(null), k = m(() => rr(o().track, w.scores())), A = m(() => ir(w.scores())), j = m(() => ar(w.scores())), M = m(() => ur(o().track, w.recentScores())), N = () => fr(n.lang), P = () => {
		let e = p();
		if (e <= 0) return N().paused;
		let t = kr(e, !1);
		return t.kind === "running" ? `${(t.unitsPerSecond * 60 / 1e3).toFixed(1)} m/min` : N().max;
	}, ee = m(() => {
		let e = T(), t = D();
		if (!e || !t) return null;
		let n = k().get(e);
		return !n || n.total === 0 ? null : {
			pos: t,
			stat: n
		};
	});
	function F(e) {
		let t = e.currentTarget.getBoundingClientRect();
		O({
			x: e.clientX - t.left,
			y: e.clientY - t.top
		});
	}
	function te() {
		O(null), E(null);
	}
	return (() => {
		var d = jr(), m = d.firstChild, h = m.firstChild, g = m.nextSibling.firstChild, _ = g.nextSibling, x = _.firstChild, S = x.nextSibling, T = _.nextSibling, D = C;
		return typeof D == "function" ? u(D, d) : C = d, m.addEventListener("pointerleave", te), m.$$pointermove = F, i(m, t(An, {
			get track() {
				return o().track;
			},
			get bbox() {
				return l();
			},
			get scores() {
				return w.scores();
			},
			get bulgeScale() {
				return n.bulgeScale ?? 100;
			},
			get showAdapters() {
				return n.showAdapters ?? !1;
			},
			onHoverPiece: E,
			get children() {
				return t(f, {
					get when() {
						return w.walker();
					},
					children: (e) => t(Er, {
						get walker() {
							return e();
						},
						get track() {
							return o().track;
						}
					})
				});
			}
		}), h), i(h, (() => {
			var e = a(() => !!n.advancedStats);
			return () => e() && `${N().entropy} ${A().toFixed(3)} · ${N().gini} ${j().toFixed(3)} · `;
		})(), null), i(h, () => `${N().trackLength} ${(M().totalLength / 1e3).toFixed(2)} m · ${Math.round(M().utilizedLength / M().totalLength * 100)}${N().utilized} · ${Math.round(M().bidirectionalLength / M().totalLength * 100)}${N().bidirectional}`, null), i(h, (() => {
			var e = a(() => w.totalDistance() > 0);
			return () => e() && ` · ${(w.totalDistance() / 1e3).toFixed(1)} ${N().traveled}`;
		})(), null), i(m, t(f, {
			get when() {
				return ee();
			},
			children: (e) => (() => {
				var t = Mr(), n = t.firstChild, a = n.firstChild, o = n.nextSibling, s = o.firstChild.nextSibling, l = s.nextSibling.nextSibling;
				return l.nextSibling, i(n, () => (e().stat.total * 100).toFixed(1), a), i(o, () => (e().stat.atob * 100).toFixed(1), s), i(o, () => (e().stat.btoa * 100).toFixed(1), l), r((n) => {
					var r = `${e().pos.x + 14}px`, i = `${e().pos.y + 14}px`;
					return r !== n.e && c(t, "left", n.e = r), i !== n.t && c(t, "top", n.t = i), n;
				}, {
					e: void 0,
					t: void 0
				}), t;
			})()
		}), null), g.$$click = () => b((e) => !e), i(g, (() => {
			var e = a(() => !!y());
			return () => e() ? Nr() : Pr();
		})()), i(x, P), S.$$input = (e) => v(+e.currentTarget.value), T.$$click = () => w.reset(), i(T, () => N().resetButton), r((t) => {
			var r = `tt-embed ${n.class ?? ""}`, i = n.advancedStats || void 0, a = y() ? N().pauseAriaLabel : N().playAriaLabel, o = `${p() / 100}`, l = N().speedAriaLabel;
			return r !== t.e && e(d, t.e = r), i !== t.t && s(m, "data-advanced", t.t = i), a !== t.a && s(g, "aria-label", t.a = a), o !== t.o && c(_, "--tt-pct", t.o = o), l !== t.i && s(S, "aria-label", t.i = l), t;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0
		}), r(() => S.value = p()), d;
	})();
}
n([
	"pointermove",
	"click",
	"input"
]);
//#endregion
//#region src/graph/topology.ts
var Ir = 30;
function Lr(e, t) {
	return e.magic ? e.magic.arms[t] : G(V(e.type).arms[t], K(e));
}
function Rr(e, t) {
	let n = Math.max(2, Math.ceil(H(e) / Ir)), r = [];
	for (let i = 0; i <= n; i++) {
		let a = i / n;
		r.push(U(e, t ? a : 1 - a).point);
	}
	return r;
}
function zr(e) {
	let t = 0, n = 0;
	for (let r of e) t += r[0], n += r[1];
	let r = e.length || 1;
	return [t / r, n / r];
}
function Br(e, t) {
	let n = 0;
	for (let [r, i] of V(e.type).connections) (r === t || i === t) && n++;
	return n;
}
function Vr(e) {
	let t = new Map(e.pieces.map((e) => [e.id, e])), n = Pe(e), r = /* @__PURE__ */ new Map();
	for (let e of n) for (let t of e.members) r.set(`${t.pieceId}:${t.endIndex}`, e);
	let i = (e) => {
		let n = 0;
		for (let r of e.members) n += Br(t.get(r.pieceId), r.endIndex);
		return n;
	}, a = (e) => !(i(e) === 2 && e.members.length === 2), o = /* @__PURE__ */ new Set(), s = [];
	for (let e of n) {
		if (!a(e)) continue;
		let t = i(e);
		o.add(e.id), s.push({
			id: e.id,
			position: [e.position[0], e.position[1]],
			kind: t === 1 ? "free" : "switch",
			degree: t
		});
	}
	let c = (e, t) => {
		let n = V(e.type).connections;
		for (let e = 0; e < n.length; e++) {
			let [r, i] = n[e];
			if (r === t || i === t) return e;
		}
		return -1;
	}, l = (e, t) => {
		for (let n = e.length === 0 ? 0 : 1; n < t.length; n++) e.push(t[n]);
	}, u = (e, n, i) => {
		let a = [], s = [], u = 0, d = e, f = n, p = i;
		for (let e = 0; e < 1e5; e++) {
			a.push(d);
			let e = t.get(d), [n, i] = V(e.type).connections[p], m = Lr(e, p);
			u += H(m), l(s, Rr(m, f === n));
			let h = n === f ? i : n, g = r.get(`${d}:${h}`);
			if (o.has(g.id)) return {
				endJunctionId: g.id,
				exitPieceId: d,
				exitEnd: h,
				exitCi: p,
				pieceIds: a,
				length: u,
				polyline: s
			};
			let _ = g.members.find((e) => !(e.pieceId === d && e.endIndex === h));
			d = _.pieceId, f = _.endIndex, p = c(t.get(d), _.endIndex);
		}
		throw Error("walkToNode did not terminate");
	}, d = [], f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
	for (let e of n) if (o.has(e.id)) for (let n of e.members) {
		let r = V(t.get(n.pieceId).type).connections;
		for (let t = 0; t < r.length; t++) {
			let [i, a] = r[t];
			if (i !== n.endIndex && a !== n.endIndex) continue;
			let o = `${n.pieceId}:${n.endIndex}:${t}`;
			if (p.has(o)) continue;
			let c = u(n.pieceId, n.endIndex, t);
			p.add(o), p.add(`${c.exitPieceId}:${c.exitEnd}:${c.exitCi}`);
			for (let e of c.pieceIds) f.add(e);
			let l = c.polyline;
			l[0] = [e.position[0], e.position[1]], l[l.length - 1] = [...s.find((e) => e.id === c.endJunctionId).position], d.push({
				a: e.id,
				b: c.endJunctionId,
				aPiece: n.pieceId,
				bPiece: c.exitPieceId,
				pieceIds: c.pieceIds,
				length: c.length,
				polyline: l
			});
		}
	}
	let m = n.length, h = new Set(e.pieces.map((e) => e.id).filter((e) => !f.has(e)));
	for (; h.size > 0;) {
		let e = h.values().next().value, n = V(t.get(e).type).connections[0][0], i = Hr(e, n, t, r, c, l);
		for (let e of i.pieceIds) h.delete(e);
		let a = m++;
		s.push({
			id: a,
			position: zr(i.polyline),
			kind: "loop",
			degree: 2
		}), d.push({
			a,
			b: a,
			aPiece: e,
			bPiece: e,
			pieceIds: i.pieceIds,
			length: i.length,
			polyline: i.polyline
		});
	}
	return {
		nodes: s,
		edges: d
	};
}
function Hr(e, t, n, r, i, a) {
	let o = [], s = [], c = 0, l = e, u = t, d = i(n.get(l), u), f = `${l}:${u}:${d}`;
	for (let e = 0; e < 1e5; e++) {
		o.push(l);
		let e = n.get(l), [t, p] = V(e.type).connections[d], m = Lr(e, d);
		c += H(m), a(s, Rr(m, u === t));
		let h = t === u ? p : t, g = r.get(`${l}:${h}`)?.members.find((e) => !(e.pieceId === l && e.endIndex === h));
		if (!g || (l = g.pieceId, u = g.endIndex, d = i(n.get(l), g.endIndex), `${l}:${u}:${d}` === f)) break;
	}
	return {
		pieceIds: o,
		length: c,
		polyline: s
	};
}
var Ur = 3, Wr = 5, Gr = 72, Kr = 64, qr = 70, Jr = .5, Yr = 520, Xr = 46, Zr = .4;
function Qr(e) {
	let t = Math.max(0, Math.min(1, e / 100)), n = 45 + 185 * t, r = .15 + .32 * t;
	return {
		resampleStep: n,
		lambda: r,
		mu: -(r + .01)
	};
}
function $r(e, t, n) {
	let r = n[0] - t[0], i = n[1] - t[1], a = r * r + i * i || 1e-9, o = ((e[0] - t[0]) * r + (e[1] - t[1]) * i) / a;
	o = Math.max(0, Math.min(1, o));
	let s = [t[0] + r * o, t[1] + i * o];
	return {
		d: ye(e, s),
		c: s
	};
}
function ei(e, t, n) {
	let r = [0];
	for (let t = 1; t < e.length; t++) r.push(r[t - 1] + ye(e[t - 1], e[t]));
	let i = r[r.length - 1] || 1, a = (t) => {
		let n = Math.max(0, Math.min(i, t)), a = 1;
		for (; a < r.length && r[a] < n;) a++;
		let o = a - 1, s = r[a] - r[o] || 1, c = (n - r[o]) / s;
		return [e[o][0] + (e[a][0] - e[o][0]) * c, e[o][1] + (e[a][1] - e[o][1]) * c];
	}, o = [], s = n ? t : t - 1;
	for (let e = 0; e < (n ? t : t + 1); e++) o.push(a(i * e / s));
	return o;
}
function ti(e, t) {
	let n = e.length;
	if (n < 2) return "";
	let r = (r) => t ? e[(r % n + n) % n] : e[Math.max(0, Math.min(n - 1, r))], i = `M ${e[0][0]} ${e[0][1]} `, a = t ? n : n - 1;
	for (let e = 0; e < a; e++) {
		let t = r(e - 1), n = r(e), a = r(e + 1), o = r(e + 2), s = [n[0] + (a[0] - t[0]) / 6, n[1] + (a[1] - t[1]) / 6], c = [a[0] - (o[0] - n[0]) / 6, a[1] - (o[1] - n[1]) / 6];
		i += `C ${s[0]} ${s[1]}, ${c[0]} ${c[1]}, ${a[0]} ${a[1]} `;
	}
	return t && (i += "Z"), i.trim();
}
function ni(e, t, n = 10) {
	let r = e.length;
	if (r < 2) return e.slice();
	let i = (n) => t ? e[(n % r + r) % r] : e[Math.max(0, Math.min(r - 1, n))], a = [[e[0][0], e[0][1]]], o = t ? r : r - 1;
	for (let e = 0; e < o; e++) {
		let t = i(e - 1), r = i(e), o = i(e + 1), s = i(e + 2), c = [r[0] + (o[0] - t[0]) / 6, r[1] + (o[1] - t[1]) / 6], l = [o[0] - (s[0] - r[0]) / 6, o[1] - (s[1] - r[1]) / 6];
		for (let e = 1; e <= n; e++) {
			let t = e / n, i = 1 - t, s = i * i * i * r[0] + 3 * i * i * t * c[0] + 3 * i * t * t * l[0] + t * t * t * o[0], u = i * i * i * r[1] + 3 * i * i * t * c[1] + 3 * i * t * t * l[1] + t * t * t * o[1];
			a.push([s, u]);
		}
	}
	return a;
}
function ri(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.nodes) t.set(n.id, n);
	return t;
}
function ii(e, t) {
	let n = Math.max(0, Math.min(1, t / 100)), { resampleStep: r, lambda: i, mu: a } = Qr(t), o = Yr + (Xr - Yr) * n, s = ri(e), c = e.nodes, l = e.edges, u = l.map((e) => e.a === e.b), d = l.map((e, t) => {
		let n = Math.max(Ur, Math.min(Wr, Math.round(e.length / r)));
		return ei(e.polyline, n, u[t]);
	}), f = (e) => u[e] && s.get(l[e].a)?.kind === "loop", p = (e, t) => u[e] ? !f(e) && t === 0 : t === 0 || t === d[e].length - 1, m = (e, t) => {
		let n = d[e], r = n.length, i = u[e] ? n[(t - 1 + r) % r] : n[Math.max(0, t - 1)], a = u[e] ? n[(t + 1) % r] : n[Math.min(r - 1, t + 1)];
		return [(i[0] + a[0]) / 2, (i[1] + a[1]) / 2];
	};
	for (let e = 0; e < qr; e++) {
		let e = d.map((e, t) => {
			if (!u[t]) return null;
			let n = 0, r = 0;
			for (let t of e) n += t[0], r += t[1];
			return [n / e.length, r / e.length];
		}), t = d.map((e) => e.map(() => [0, 0]));
		for (let n = 0; n < d.length; n++) for (let r = 0; r < d[n].length; r++) {
			if (p(n, r)) continue;
			let i = d[n][r], a = 0, s = 0;
			for (let e of c) {
				if (e.id === l[n].a || e.id === l[n].b) continue;
				let t = ye(i, e.position);
				if (t > 1e-6 && t < Kr) {
					let n = Jr * (Kr - t) / t;
					a += (i[0] - e.position[0]) * n, s += (i[1] - e.position[1]) * n;
				}
			}
			for (let e = 0; e < d.length; e++) {
				let t = d[e], o = u[e] ? t.length : t.length - 1;
				for (let c = 0; c < o; c++) {
					if (e === n && (u[n] || c >= r - 1 && c <= r)) continue;
					let { d: o, c: l } = $r(i, t[c], t[(c + 1) % t.length]);
					if (o > 1e-6 && o < Gr) {
						let e = Jr * (Gr - o) / o;
						a += (i[0] - l[0]) * e, s += (i[1] - l[1]) * e;
					}
				}
			}
			let f = e[n];
			if (f) {
				let e = Math.hypot(i[0] - f[0], i[1] - f[1]);
				if (e > o) {
					let t = Zr * (e - o) / e;
					a += (f[0] - i[0]) * t, s += (f[1] - i[1]) * t;
				}
			}
			t[n][r] = [a, s];
		}
		for (let e = 0; e < d.length; e++) for (let n = 0; n < d[e].length; n++) p(e, n) || (d[e][n] = [d[e][n][0] + t[e][n][0], d[e][n][1] + t[e][n][1]]);
		for (let e of [i, a]) {
			let t = d.map((e) => e.map((e) => [e[0], e[1]]));
			for (let n = 0; n < d.length; n++) for (let r = 0; r < d[n].length; r++) {
				if (p(n, r)) continue;
				let i = d[n][r], a = m(n, r);
				t[n][r] = [i[0] + e * (a[0] - i[0]), i[1] + e * (a[1] - i[1])];
			}
			for (let e = 0; e < d.length; e++) d[e] = t[e];
		}
	}
	return d;
}
function ai(e, t, n = 1) {
	let r = ri(e), i = e.edges, a = /* @__PURE__ */ new Map(), o = [], s = /* @__PURE__ */ new Map(), c = (e, n, a) => {
		let o = r.get(e);
		if (!o || o.kind !== "switch") return;
		let c = t[n];
		if (!c || c.length < 2) return;
		let l = o.position, u = a === "a" ? c[1] : c[c.length - 2], d = u[0] - l[0], f = u[1] - l[1], p = Math.hypot(d, f) || 1, m = a === "a" ? i[n].aPiece : i[n].bPiece, h = s.get(e) ?? /* @__PURE__ */ new Map(), g = h.get(m) ?? [];
		g.push({
			key: `${n}:${a}`,
			dir: [d / p, f / p],
			adjDist: p
		}), h.set(m, g), s.set(e, h);
	};
	i.forEach((e, t) => {
		e.a !== e.b && (c(e.a, t, "a"), c(e.b, t, "b"));
	});
	for (let [e, t] of s) {
		let i = r.get(e).position;
		for (let e of t.values()) {
			if (e.length < 2) continue;
			let t = 0, r = 0, s = Infinity;
			for (let n of e) t += n.dir[0], r += n.dir[1], s = Math.min(s, n.adjDist);
			let c = Math.hypot(t, r);
			if (c < .001) continue;
			let l = [t / c, r / c], u = Math.min(70, .45 * s) * n, d = [i[0] + l[0] * u, i[1] + l[1] * u];
			for (let t of e) a.set(t.key, {
				pt: d,
				dir: l
			});
			o.push([i, d]);
		}
	}
	return {
		forkEnd: a,
		stems: o
	};
}
//#endregion
//#region src/embed/TrackToGraph.tsx
var oi = /* @__PURE__ */ l("<svg><g data-layer=labels><defs></svg>", !1, !0, !1), si = /* @__PURE__ */ l("<div><div class=tt-stage><svg preserveAspectRatio=\"xMidYMid meet\"><g transform=\"matrix(1 0 0 -1 0 0)\"></g></svg></div><div class=tt-controls><button type=button class=tt-playpause></button><span class=tt-morph-end></span><input type=range min=0 max=100 step=1><span class=tt-morph-end>"), ci = /* @__PURE__ */ l("<svg><path fill=none stroke=#fde68a stroke-width=16 stroke-linecap=round stroke-linejoin=round></svg>", !1, !0, !1), li = /* @__PURE__ */ l("<svg><circle fill=#ffffff stroke=#000000 stroke-width=3></svg>", !1, !0, !1), ui = /* @__PURE__ */ l("<svg><path fill=none stroke=none></svg>", !1, !0, !1), di = /* @__PURE__ */ l("<svg><text text-anchor=middle font-size=20 font-family=monospace fill=#000000></svg>", !1, !0, !1), fi = /* @__PURE__ */ l("<svg><text font-size=20 font-family=monospace fill=#000000><textPath startOffset=50% text-anchor=middle></svg>", !1, !0, !1), pi = /* @__PURE__ */ l("<svg><text text-anchor=middle font-size=24 font-weight=bold font-family=monospace fill=#000000></svg>", !1, !0, !1), mi = /* @__PURE__ */ l("<svg width=12 height=12 viewBox=\"0 0 12 12\"fill=currentColor aria-hidden=true><rect x=0 y=0 width=4 height=12 rx=0.5></rect><rect x=8 y=0 width=4 height=12 rx=0.5>"), hi = /* @__PURE__ */ l("<svg width=12 height=12 viewBox=\"0 0 12 12\"fill=currentColor aria-hidden=true><polygon points=\"0,0 12,6 0,12\">"), gi = {
	switch: 17,
	free: 13,
	loop: 13
}, _i = 16, vi = 2500;
function yi(e) {
	return e < 26 ? String.fromCharCode(65 + e) : `N${e}`;
}
var bi = (e) => e * e * (3 - 2 * e), xi = (e, t, n) => [e[0] + (t[0] - e[0]) * n, e[1] + (t[1] - e[1]) * n];
function Si(n) {
	let o = m(() => qn(n)), l = m(() => Vr(o().track)), p = m(() => On(o().track, n.padding ?? 2)), v = () => {
		let e = p();
		return `${e.x} ${-(e.y + e.height)} ${e.width} ${e.height}`;
	}, y = () => fr(n.lang), b = m(() => {
		let e = l(), t = ii(e, 100), { forkEnd: n, stems: r } = ai(e, t, 1);
		return {
			frames: e.edges.map((e, r) => {
				let i = e.a === e.b, a = Math.max(8, Math.min(80, Math.round(e.length / 22))), o = ei(e.polyline, a, i), s = t[r].slice(), c = n.get(`${r}:a`), l = n.get(`${r}:b`);
				return c && (s[0] = c.pt), l && (s[s.length - 1] = l.pt), {
					closed: i,
					source: o,
					target: ei(ni(s, i, 12), a, i)
				};
			}),
			stems: r,
			relaxedTarget: t
		};
	}), x = (e) => {
		let t = b().relaxedTarget[e].map((e) => [e[0], -e[1]]);
		return ti(t.length > 1 && t[0][0] > t[t.length - 1][0] ? [...t].reverse() : t, !1);
	}, S = (e) => {
		let t = b().relaxedTarget[e], n = t[0];
		for (let e of t) e[1] > n[1] && (n = e);
		return [n[0], -n[1] - 8];
	}, C = (e) => `${Math.round(e)} mm`, w = (e) => e.a === e.b, [T, E] = h(0), D = () => bi(T()), [O, k] = h(!1), A, j = () => {
		A !== void 0 && cancelAnimationFrame(A), A = void 0, k(!1);
	}, M = () => {
		A !== void 0 && cancelAnimationFrame(A);
		let e = T() >= .999 ? 0 : T(), t = 1 - e, n = performance.now();
		k(!0);
		let r = (i) => {
			let a = t <= 0 ? 1 : Math.min(1, e + (i - n) / vi);
			E(a), a < 1 ? A = requestAnimationFrame(r) : (A = void 0, k(!1));
		};
		A = requestAnimationFrame(r);
	}, N = () => O() ? j() : M(), P;
	_(() => {
		if (!n.autoplay) return;
		if (!P || typeof IntersectionObserver > "u") {
			M();
			return;
		}
		let e = new IntersectionObserver((t) => {
			for (let n of t) n.isIntersecting && (M(), e.disconnect());
		}, { threshold: .25 });
		e.observe(P), g(() => e.disconnect());
	}), g(() => {
		A !== void 0 && cancelAnimationFrame(A);
	});
	let ee = (e) => {
		let t = b().frames[e], n = D();
		return t.source.map((e, r) => xi(e, t.target[r], n));
	};
	return (() => {
		var o = si(), p = o.firstChild, m = p.firstChild, h = m.firstChild, g = p.nextSibling, _ = g.firstChild, k = _.nextSibling, A = k.nextSibling, M = A.nextSibling, F = P;
		return typeof F == "function" ? u(F, o) : P = o, i(h, t(d, {
			get each() {
				return b().stems;
			},
			children: (e) => (() => {
				var t = ci();
				return r((n) => {
					var r = ti([e[0], xi(e[0], e[1], D())], !1), i = D();
					return r !== n.e && s(t, "d", n.e = r), i !== n.t && s(t, "opacity", n.t = i), n;
				}, {
					e: void 0,
					t: void 0
				}), t;
			})()
		}), null), i(h, t(d, {
			get each() {
				return l().edges;
			},
			children: (e, t) => (() => {
				var n = ci();
				return r(() => s(n, "d", ti(ee(t()), w(e)))), n;
			})()
		}), null), i(h, t(d, {
			get each() {
				return l().nodes;
			},
			children: (e) => (() => {
				var t = li();
				return r((n) => {
					var r = e.position[0], i = e.position[1], a = gi[e.kind], o = D();
					return r !== n.e && s(t, "cx", n.e = r), i !== n.t && s(t, "cy", n.t = i), a !== n.a && s(t, "r", n.a = a), o !== n.o && s(t, "opacity", n.o = o), n;
				}, {
					e: void 0,
					t: void 0,
					a: void 0,
					o: void 0
				}), t;
			})()
		}), null), i(m, t(f, {
			get when() {
				return n.showLabels ?? !0;
			},
			get children() {
				var e = oi(), n = e.firstChild;
				return i(n, t(d, {
					get each() {
						return l().edges;
					},
					children: (e, t) => w(e) ? null : (() => {
						var e = ui();
						return r((n) => {
							var r = `ttg-lbl-${t()}`, i = x(t());
							return r !== n.e && s(e, "id", n.e = r), i !== n.t && s(e, "d", n.t = i), n;
						}, {
							e: void 0,
							t: void 0
						}), e;
					})()
				})), i(e, t(d, {
					get each() {
						return l().edges;
					},
					children: (e, t) => w(e) ? (() => {
						var n = di();
						return i(n, () => C(e.length)), r((e) => {
							var r = S(t())[0], i = S(t())[1];
							return r !== e.e && s(n, "x", e.e = r), i !== e.t && s(n, "y", e.t = i), e;
						}, {
							e: void 0,
							t: void 0
						}), n;
					})() : (() => {
						var n = fi(), a = n.firstChild;
						return i(a, () => C(e.length)), r(() => s(a, "href", `#ttg-lbl-${t()}`)), n;
					})()
				}), null), i(e, t(d, {
					get each() {
						return l().nodes;
					},
					children: (e, t) => (() => {
						var n = pi();
						return i(n, () => yi(t())), r((t) => {
							var r = e.position[0], i = -e.position[1] - (gi[e.kind] + _i);
							return r !== t.e && s(n, "x", t.e = r), i !== t.t && s(n, "y", t.t = i), t;
						}, {
							e: void 0,
							t: void 0
						}), n;
					})()
				}), null), r(() => s(e, "opacity", D())), e;
			}
		}), null), _.$$click = N, i(_, (() => {
			var e = a(() => !!O());
			return () => e() ? mi() : hi();
		})()), i(k, () => y().trackLabel), A.$$input = (e) => {
			j(), E(e.currentTarget.value / 100);
		}, i(M, () => y().graphLabel), r((t) => {
			var r = `tt-embed ${n.class ?? ""}`, i = v(), a = `${T()}`, l = O() ? y().pauseAriaLabel : y().playAriaLabel, u = y().morphAriaLabel;
			return r !== t.e && e(o, t.e = r), i !== t.t && s(m, "viewBox", t.t = i), a !== t.a && c(g, "--tt-pct", t.a = a), l !== t.o && s(_, "aria-label", t.o = l), u !== t.i && s(A, "aria-label", t.i = u), t;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0
		}), r(() => A.value = Math.round(T() * 100)), o;
	})();
}
n(["click", "input"]);
//#endregion
//#region src/embed/mount.tsx
function Ci(e, n) {
	return o(() => t(Xn, n), e);
}
function wi(e, n) {
	return o(() => t(hr, n), e);
}
function Ti(e, n) {
	return o(() => t(Fr, n), e);
}
function Ei(e, n) {
	return o(() => t(Si, n), e);
}
//#endregion
export { Wn as PRESETS, Xn as TrackFigure, Fr as TrackLiveMC, hr as TrackScoring, Si as TrackToGraph, Gn as findPreset, Ci as mountTrackFigure, Ti as mountTrackLiveMC, wi as mountTrackScoring, Ei as mountTrackToGraph, qn as resolveFigure, Jn as resolveSeed };
