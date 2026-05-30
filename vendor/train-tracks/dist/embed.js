import { className as e, createComponent as t, delegateEvents as n, effect as r, insert as i, memo as a, render as o, setAttribute as s, setStyleProperty as c, template as l, use as u } from "solid-js/web";
import { For as d, Show as f, createEffect as p, createMemo as m, createSignal as h, onCleanup as g, onMount as _ } from "solid-js";
var v = Math.PI / 4, y = Math.PI / 8, b = 205 * Math.sin(Math.PI / 8), x = 205 * Math.sin(Math.PI / 4), S = 205 * (1 - Math.cos(Math.PI / 4)), C = 205 * (1 - Math.cos(Math.PI / 8)), w = 1e-6, T = 5e5;
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
var ee = E("straight-nub", C), D = E("straight-tiny", S), te = E("straight-short", b), ne = E("straight-long", x);
//#endregion
//#region src/pieces/curve.ts
function O(e, t, n) {
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
var k = O("curve-45", v, "l"), A = O("curve-45", v, "r"), re = O("curve-22", y, "l"), ie = O("curve-22", y, "r");
//#endregion
//#region src/pieces/switch.ts
function j(e, t) {
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
var ae = j("l", "fmm"), oe = j("r", "fmm"), se = j("l", "mff"), ce = j("r", "mff");
//#endregion
//#region src/pieces/switch-parallel.ts
function M(e, t, n) {
	let r = e, i = 2 * n - t, a = 2 * n, o = Math.sqrt(r * r + i * i), s = Math.atan2(i, r), c = Math.asin(a / o) - s;
	return {
		alpha: c,
		S: (e - 2 * n * Math.sin(c)) / Math.cos(c)
	};
}
function N(e, t, n, r, i, a) {
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
function P(e, t) {
	let n = x, { alpha: r, S: i } = M(n, 22, 205), a = e === "l" ? 1 : -1, o = t === "fmm" ? "F" : "M", s = t === "fmm" ? "M" : "F";
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
		arms: [N(a, 205, r, i, n, 22), N(-a, 205, r, i, n, 22)],
		bounds: {
			min: [-2.5, -24.5],
			max: [n + 2.5, 24.5]
		}
	};
}
var le = P("l", "fmm"), F = P("r", "fmm"), ue = P("l", "mff"), de = P("r", "mff");
//#endregion
//#region src/pieces/switch-turn.ts
function I(e, t) {
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
var fe = I("l", "fmm"), L = I("r", "fmm"), pe = I("l", "mff"), me = I("r", "mff"), R = 50, he = {
	type: "crossing-diamond",
	category: "crossing",
	ends: [
		{
			position: [-R, 0],
			angle: Math.PI,
			polarity: "F"
		},
		{
			position: [0, R],
			angle: Math.PI / 2,
			polarity: "M"
		},
		{
			position: [R, 0],
			angle: 0,
			polarity: "M"
		},
		{
			position: [0, -R],
			angle: -Math.PI / 2,
			polarity: "F"
		}
	],
	connections: [[0, 2], [1, 3]],
	arms: [{
		kind: "line",
		from: [-R, 0],
		to: [R, 0]
	}, {
		kind: "line",
		from: [0, R],
		to: [0, -R]
	}],
	bounds: {
		min: [-R - 2.5, -R - 2.5],
		max: [R + 2.5, R + 2.5]
	}
};
//#endregion
//#region src/pieces/adapter.ts
function ge(e, t) {
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
var _e = ge("adapter-mm", "M"), ve = ge("adapter-ff", "F"), ye = {
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
	arms: [{
		kind: "line",
		from: [0, 0],
		to: [205, 0]
	}],
	bounds: {
		min: [0, -10],
		max: [205, 10]
	}
};
2 * Math.PI;
//#endregion
//#region src/pieces/registry.ts
var be = {
	[ee.type]: ee,
	[D.type]: D,
	[te.type]: te,
	[ne.type]: ne,
	[re.type]: re,
	[ie.type]: ie,
	[k.type]: k,
	[A.type]: A,
	[ae.type]: ae,
	[oe.type]: oe,
	[se.type]: se,
	[ce.type]: ce,
	[le.type]: le,
	[F.type]: F,
	[ue.type]: ue,
	[de.type]: de,
	[fe.type]: fe,
	[L.type]: L,
	[pe.type]: pe,
	[me.type]: me,
	[he.type]: he,
	[_e.type]: _e,
	[ve.type]: ve,
	[ye.type]: ye
};
function z(e) {
	let t = be[e];
	if (!t) throw Error(`Unknown piece type: ${e}`);
	return t;
}
//#endregion
//#region src/lib/geometry.ts
function xe(e, t) {
	let n = e[0] - t[0], r = e[1] - t[1];
	return Math.sqrt(n * n + r * r);
}
function B(e) {
	if (e.kind === "line") return xe(e.from, e.to);
	if (e.kind === "arc") return e.radius * Se(e);
	if (e.kind === "bezier") {
		let t = 0, n = Ce(e, 0);
		for (let r = 1; r <= 32; r++) {
			let i = Ce(e, r / 32);
			t += xe(n, i), n = i;
		}
		return t;
	}
	let t = 0;
	for (let n of e.parts) t += B(n);
	return t;
}
function Se(e) {
	let t = Math.atan2(e.from[1] - e.center[1], e.from[0] - e.center[0]), n = Math.atan2(e.to[1] - e.center[1], e.to[0] - e.center[0]), r = e.ccw ? n - t : t - n;
	for (; r < 0;) r += 2 * Math.PI;
	for (; r >= 2 * Math.PI;) r -= 2 * Math.PI;
	return r;
}
function Ce(e, t) {
	let n = 1 - t, r = n * n * n, i = 3 * n * n * t, a = 3 * n * t * t, o = t * t * t;
	return [r * e.from[0] + i * e.c1[0] + a * e.c2[0] + o * e.to[0], r * e.from[1] + i * e.c1[1] + a * e.c2[1] + o * e.to[1]];
}
function we(e, t) {
	let n = 1 - t, r = 3 * n * n * (e.c1[0] - e.from[0]) + 6 * n * t * (e.c2[0] - e.c1[0]) + 3 * t * t * (e.to[0] - e.c2[0]), i = 3 * n * n * (e.c1[1] - e.from[1]) + 6 * n * t * (e.c2[1] - e.c1[1]) + 3 * t * t * (e.to[1] - e.c2[1]), a = Math.sqrt(r * r + i * i) || 1;
	return [r / a, i / a];
}
function V(e, t) {
	if (e.kind === "line") {
		let n = [e.from[0] + (e.to[0] - e.from[0]) * t, e.from[1] + (e.to[1] - e.from[1]) * t], r = e.to[0] - e.from[0], i = e.to[1] - e.from[1], a = Math.sqrt(r * r + i * i) || 1, o = [r / a, i / a];
		return {
			point: n,
			tangent: o,
			normal: [-o[1], o[0]]
		};
	}
	if (e.kind === "arc") {
		let n = Math.atan2(e.from[1] - e.center[1], e.from[0] - e.center[0]), r = Se(e), i = e.ccw ? 1 : -1, a = n + i * r * t, o = [e.center[0] + e.radius * Math.cos(a), e.center[1] + e.radius * Math.sin(a)], s = [-i * Math.sin(a), i * Math.cos(a)];
		return {
			point: o,
			tangent: s,
			normal: [-s[1], s[0]]
		};
	}
	if (e.kind === "bezier") {
		let n = Ce(e, t), r = we(e, t);
		return {
			point: n,
			tangent: r,
			normal: [-r[1], r[0]]
		};
	}
	let n = B(e), r = Math.max(0, Math.min(n, t * n)), i = 0;
	for (let t = 0; t < e.parts.length; t++) {
		let n = e.parts[t], a = B(n);
		if (t === e.parts.length - 1 || i + a >= r) {
			let e = a > 1e-9 ? (r - i) / a : 0;
			return V(n, Math.max(0, Math.min(1, e)));
		}
		i += a;
	}
	return V(e.parts[e.parts.length - 1], 1);
}
function Te(e, t) {
	let n = [];
	for (let r = 0; r <= t; r++) n.push(V(e, r / t));
	return n;
}
//#endregion
//#region src/lib/transform.ts
var Ee = {
	position: [0, 0],
	rotation: 0
};
function H([e, t], n) {
	let r = Math.cos(n.rotation), i = Math.sin(n.rotation);
	return [r * e - i * t + n.position[0], i * e + r * t + n.position[1]];
}
function De(e, t) {
	return e + t.rotation;
}
function Oe(e, t) {
	return {
		position: H(e.position, t),
		angle: De(e.angle, t),
		polarity: e.polarity
	};
}
function ke(e, t) {
	return e.kind === "line" ? {
		kind: "line",
		from: H(e.from, t),
		to: H(e.to, t)
	} : e.kind === "arc" ? {
		kind: "arc",
		from: H(e.from, t),
		to: H(e.to, t),
		center: H(e.center, t),
		radius: e.radius,
		ccw: e.ccw
	} : e.kind === "bezier" ? {
		kind: "bezier",
		from: H(e.from, t),
		to: H(e.to, t),
		c1: H(e.c1, t),
		c2: H(e.c2, t)
	} : {
		kind: "composite",
		parts: e.parts.map((e) => ke(e, t))
	};
}
function Ae(e) {
	let t = e;
	for (; t > Math.PI;) t -= 2 * Math.PI;
	for (; t <= -Math.PI;) t += 2 * Math.PI;
	return t;
}
//#endregion
//#region src/track/placement.ts
var je = 0;
function Me() {
	return je += 1, `p${je}`;
}
function Ne(e) {
	e > je && (je = e);
}
function Pe(e) {
	return {
		position: e.position,
		rotation: e.rotation
	};
}
function Fe(e) {
	if (e.magic) return e.magic.ends;
	let t = z(e.type), n = Pe(e);
	return t.ends.map((e) => Oe(e, n));
}
function Ie(e, t, n) {
	let r = z(e).ends[t];
	if (!Le(r.polarity, n.polarity)) return null;
	let i = Ae(Ae(n.angle + Math.PI) - r.angle), a = Math.cos(i), o = Math.sin(i), s = a * r.position[0] - o * r.position[1], c = o * r.position[0] + a * r.position[1], l = [n.position[0] - s, n.position[1] - c];
	return {
		id: Me(),
		type: e,
		position: l,
		rotation: i
	};
}
function Le(e, t) {
	return e !== t;
}
//#endregion
//#region src/track/junctions.ts
function Re(e, t = w) {
	let n = [];
	for (let t of e.pieces) Fe(t).forEach((e, r) => {
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
		for (let i = e + 1; i < n.length; i++) r[i] || xe(n[e].position, n[i].position) < t && (r[i] = !0, o.push(n[i].ref), s += n[i].position[0], c += n[i].position[1], l += 1);
		i.push({
			id: a++,
			members: o,
			position: [s / l, c / l]
		});
	}
	return i;
}
function ze(e, t) {
	for (let n of e) for (let e of n.members) if (e.pieceId === t.pieceId && e.endIndex === t.endIndex) return n;
	return null;
}
//#endregion
//#region src/scoring/smooth-widths.ts
function Be(e) {
	let t = 0;
	for (let n of e.values()) t = Math.max(t, n.atobFrom, n.atobTo, n.btoaFrom, n.btoaTo);
	return t;
}
function Ve(e, t, n, r) {
	let i = n.pieces.find((t) => t.id === e);
	if (!i) return null;
	let [a, o] = z(i.type).connections[t];
	return r.includes(a) ? a : r.includes(o) ? o : null;
}
function He(e, t, n) {
	return e.connections[t][1] === n;
}
function Ue(e, t) {
	let n = Re(e), r = new Map(e.pieces.map((e) => [e.id, e])), i = (e) => z(r.get(e).type), a = /* @__PURE__ */ new Map();
	for (let r of n) {
		let n = /* @__PURE__ */ new Map();
		for (let { pieceId: e, endIndex: t } of r.members) n.has(e) || n.set(e, []), n.get(e).push(t);
		let o = [];
		for (let [r, i] of n) {
			let n = e.pieces.find((e) => e.id === r);
			if (!n) continue;
			let a = z(n.type);
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
		let s = (t) => Ve(t.pieceId, t.ci, e, n.get(t.pieceId) ?? []), c = (e) => {
			let t = s(e);
			if (t === null) return null;
			let n = He(i(e.pieceId), e.ci, t);
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
			let r = He(i(e.pieceId), e.ci, t), l = {
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
		let e = z(r.type);
		for (let i = 0; i < e.connections.length; i++) {
			let [s, c] = e.connections[i], l = ze(n, {
				pieceId: r.id,
				endIndex: s
			}), u = ze(n, {
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
function U(e) {
	return `${e.pieceId}:${e.connectionIndex}:${e.direction}`;
}
//#endregion
//#region src/render/path.ts
var We = .3;
function Ge(e, t) {
	let n = ke(e, t);
	if (n.kind === "line") return `M ${n.from[0]} ${n.from[1]} L ${n.to[0]} ${n.to[1]}`;
	if (n.kind === "bezier") return `M ${n.from[0]} ${n.from[1]} C ${n.c1[0]} ${n.c1[1]}, ${n.c2[0]} ${n.c2[1]}, ${n.to[0]} ${n.to[1]}`;
	let r = Math.max(8, Math.ceil(B(n) * We)), i = "";
	for (let e = 0; e <= r; e++) {
		let t = V(n, e / r).point;
		i += `${e === 0 ? "M" : "L"} ${t[0]} ${t[1]} `;
	}
	return i.trim();
}
//#endregion
//#region src/render/bulge.ts
function Ke(e, t, n, r, i, a, o = 16) {
	let s = Te(ke(e, t), o), c = a === "atob" ? 1 : -1, l = "";
	for (let e = 0; e < s.length; e++) {
		let t = e / (s.length - 1), a = n + (r - n) * t, o = Math.min(i * a, 50), u = s[e].point[0] + c * s[e].normal[0] * o, d = s[e].point[1] + c * s[e].normal[1] * o;
		l += `${e === 0 ? "M" : "L"} ${u} ${d} `;
	}
	for (let e = s.length - 1; e >= 0; e--) l += `L ${s[e].point[0]} ${s[e].point[1]} `;
	return l += "Z", l.trim();
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function qe(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = qe(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function Je() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = qe(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/tailwind-merge/dist/bundle-mjs.mjs
var Ye = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, Xe = (e, t) => ({
	classGroupId: e,
	validator: t
}), Ze = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), Qe = "-", $e = [], et = "arbitrary..", tt = (e) => {
	let t = it(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return rt(e);
			let n = e.split(Qe);
			return nt(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? Ye(i, t) : t : i || $e;
			}
			return n[e] || $e;
		}
	};
}, nt = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = nt(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(Qe) : e.slice(t).join(Qe), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, rt = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? et + r : void 0;
})(), it = (e) => {
	let { theme: t, classGroups: n } = e;
	return at(n, t);
}, at = (e, t) => {
	let n = Ze();
	for (let r in e) {
		let i = e[r];
		ot(i, n, r, t);
	}
	return n;
}, ot = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		st(i, t, n, r);
	}
}, st = (e, t, n, r) => {
	if (typeof e == "string") {
		ct(e, t, n);
		return;
	}
	if (typeof e == "function") {
		lt(e, t, n, r);
		return;
	}
	ut(e, t, n, r);
}, ct = (e, t, n) => {
	let r = e === "" ? t : dt(t, e);
	r.classGroupId = n;
}, lt = (e, t, n, r) => {
	if (ft(e)) {
		ot(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(Xe(n, e));
}, ut = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		ot(o, dt(t, a), n, r);
	}
}, dt = (e, t) => {
	let n = e, r = t.split(Qe), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = Ze(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, ft = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, pt = (e) => {
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
}, mt = "!", ht = ":", gt = [], _t = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), vt = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === ht) {
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
		s.endsWith(mt) ? (c = s.slice(0, -1), l = !0) : s.startsWith(mt) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return _t(t, l, c, u);
	};
	if (t) {
		let e = t + ht, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : _t(gt, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, yt = (e) => {
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
}, bt = (e) => ({
	cache: pt(e.cacheSize),
	parseClassName: vt(e),
	sortModifiers: yt(e),
	postfixLookupClassGroupIds: xt(e),
	...tt(e)
}), xt = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, St = /\s+/, Ct = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(St), l = "";
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
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + mt : _, y = v + g;
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
}, wt = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = Tt(n)) && (i && (i += " "), i += r);
	return i;
}, Tt = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = Tt(e[r])) && (n && (n += " "), n += t);
	return n;
}, Et = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = bt(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = Ct(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(wt(...e));
}, Dt = [], W = (e) => {
	let t = (t) => t[e] || Dt;
	return t.isThemeGetter = !0, t;
}, Ot = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, kt = /^\((?:(\w[\w-]*):)?(.+)\)$/i, At = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, jt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Mt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Nt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Pt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Ft = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, G = (e) => At.test(e), K = (e) => !!e && !Number.isNaN(Number(e)), q = (e) => !!e && Number.isInteger(Number(e)), It = (e) => e.endsWith("%") && K(e.slice(0, -1)), J = (e) => jt.test(e), Lt = () => !0, Rt = (e) => Mt.test(e) && !Nt.test(e), zt = () => !1, Bt = (e) => Pt.test(e), Vt = (e) => Ft.test(e), Ht = (e) => !Y(e) && !Z(e), Ut = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Wt = (e) => Q(e, sn, zt), Y = (e) => Ot.test(e), X = (e) => Q(e, cn, Rt), Gt = (e) => Q(e, ln, K), Kt = (e) => Q(e, dn, Lt), qt = (e) => Q(e, un, zt), Jt = (e) => Q(e, an, zt), Yt = (e) => Q(e, on, Vt), Xt = (e) => Q(e, fn, Bt), Z = (e) => kt.test(e), Zt = (e) => $(e, cn), Qt = (e) => $(e, un), $t = (e) => $(e, an), en = (e) => $(e, sn), tn = (e) => $(e, on), nn = (e) => $(e, fn, !0), rn = (e) => $(e, dn, !0), Q = (e, t, n) => {
	let r = Ot.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, $ = (e, t, n = !1) => {
	let r = kt.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, an = (e) => e === "position" || e === "percentage", on = (e) => e === "image" || e === "url", sn = (e) => e === "length" || e === "size" || e === "bg-size", cn = (e) => e === "length", ln = (e) => e === "number", un = (e) => e === "family-name", dn = (e) => e === "number" || e === "weight", fn = (e) => e === "shadow", pn = /* @__PURE__ */ Et(() => {
	let e = W("color"), t = W("font"), n = W("text"), r = W("font-weight"), i = W("tracking"), a = W("leading"), o = W("breakpoint"), s = W("container"), c = W("spacing"), l = W("radius"), u = W("shadow"), d = W("inset-shadow"), f = W("text-shadow"), p = W("drop-shadow"), m = W("blur"), h = W("perspective"), g = W("aspect"), _ = W("ease"), v = W("animate"), y = () => [
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
		Z,
		Y
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
		Z,
		Y,
		c
	], T = () => [
		G,
		"full",
		"auto",
		...w()
	], E = () => [
		q,
		"none",
		"subgrid",
		Z,
		Y
	], ee = () => [
		"auto",
		{ span: [
			"full",
			q,
			Z,
			Y
		] },
		q,
		Z,
		Y
	], D = () => [
		q,
		"auto",
		Z,
		Y
	], te = () => [
		"auto",
		"min",
		"max",
		"fr",
		Z,
		Y
	], ne = () => [
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
	], O = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], k = () => ["auto", ...w()], A = () => [
		G,
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
	], re = () => [
		G,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...w()
	], ie = () => [
		G,
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
	], j = () => [
		e,
		Z,
		Y
	], ae = () => [
		...b(),
		$t,
		Jt,
		{ position: [Z, Y] }
	], oe = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], se = () => [
		"auto",
		"cover",
		"contain",
		en,
		Wt,
		{ size: [Z, Y] }
	], ce = () => [
		It,
		Zt,
		X
	], M = () => [
		"",
		"none",
		"full",
		l,
		Z,
		Y
	], N = () => [
		"",
		K,
		Zt,
		X
	], P = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], le = () => [
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
	], F = () => [
		K,
		It,
		$t,
		Jt
	], ue = () => [
		"",
		"none",
		m,
		Z,
		Y
	], de = () => [
		"none",
		K,
		Z,
		Y
	], I = () => [
		"none",
		K,
		Z,
		Y
	], fe = () => [
		K,
		Z,
		Y
	], L = () => [
		G,
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
			blur: [J],
			breakpoint: [J],
			color: [Lt],
			container: [J],
			"drop-shadow": [J],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [Ht],
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
			"inset-shadow": [J],
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
			radius: [J],
			shadow: [J],
			spacing: ["px", K],
			text: [J],
			"text-shadow": [J],
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
				G,
				Y,
				Z,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				Z,
				Y
			] }],
			"container-named": [Ut],
			columns: [{ columns: [
				K,
				Y,
				Z,
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
				q,
				"auto",
				Z,
				Y
			] }],
			basis: [{ basis: [
				G,
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
				K,
				G,
				"auto",
				"initial",
				"none",
				Y
			] }],
			grow: [{ grow: [
				"",
				K,
				Z,
				Y
			] }],
			shrink: [{ shrink: [
				"",
				K,
				Z,
				Y
			] }],
			order: [{ order: [
				q,
				"first",
				"last",
				"none",
				Z,
				Y
			] }],
			"grid-cols": [{ "grid-cols": E() }],
			"col-start-end": [{ col: ee() }],
			"col-start": [{ "col-start": D() }],
			"col-end": [{ "col-end": D() }],
			"grid-rows": [{ "grid-rows": E() }],
			"row-start-end": [{ row: ee() }],
			"row-start": [{ "row-start": D() }],
			"row-end": [{ "row-end": D() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": te() }],
			"auto-rows": [{ "auto-rows": te() }],
			gap: [{ gap: w() }],
			"gap-x": [{ "gap-x": w() }],
			"gap-y": [{ "gap-y": w() }],
			"justify-content": [{ justify: [...ne(), "normal"] }],
			"justify-items": [{ "justify-items": [...O(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...O()] }],
			"align-content": [{ content: ["normal", ...ne()] }],
			"align-items": [{ items: [...O(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...O(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": ne() }],
			"place-items": [{ "place-items": [...O(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...O()] }],
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
			m: [{ m: k() }],
			mx: [{ mx: k() }],
			my: [{ my: k() }],
			ms: [{ ms: k() }],
			me: [{ me: k() }],
			mbs: [{ mbs: k() }],
			mbe: [{ mbe: k() }],
			mt: [{ mt: k() }],
			mr: [{ mr: k() }],
			mb: [{ mb: k() }],
			ml: [{ ml: k() }],
			"space-x": [{ "space-x": w() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": w() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: A() }],
			"inline-size": [{ inline: ["auto", ...re()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...re()] }],
			"max-inline-size": [{ "max-inline": ["none", ...re()] }],
			"block-size": [{ block: ["auto", ...ie()] }],
			"min-block-size": [{ "min-block": ["auto", ...ie()] }],
			"max-block-size": [{ "max-block": ["none", ...ie()] }],
			w: [{ w: [
				s,
				"screen",
				...A()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...A()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...A()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...A()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...A()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...A()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				Zt,
				X
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				rn,
				Kt
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
				It,
				Y
			] }],
			"font-family": [{ font: [
				Qt,
				qt,
				t
			] }],
			"font-features": [{ "font-features": [Y] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				Z,
				Y
			] }],
			"line-clamp": [{ "line-clamp": [
				K,
				"none",
				Z,
				Gt
			] }],
			leading: [{ leading: [a, ...w()] }],
			"list-image": [{ "list-image": [
				"none",
				Z,
				Y
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				Z,
				Y
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: j() }],
			"text-color": [{ text: j() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...P(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				K,
				"from-font",
				"auto",
				Z,
				X
			] }],
			"text-decoration-color": [{ decoration: j() }],
			"underline-offset": [{ "underline-offset": [
				K,
				"auto",
				Z,
				Y
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
				q,
				Z,
				Y
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
				Z,
				Y
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
				Z,
				Y
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
			"bg-position": [{ bg: ae() }],
			"bg-repeat": [{ bg: oe() }],
			"bg-size": [{ bg: se() }],
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
						q,
						Z,
						Y
					],
					radial: [
						"",
						Z,
						Y
					],
					conic: [
						q,
						Z,
						Y
					]
				},
				tn,
				Yt
			] }],
			"bg-color": [{ bg: j() }],
			"gradient-from-pos": [{ from: ce() }],
			"gradient-via-pos": [{ via: ce() }],
			"gradient-to-pos": [{ to: ce() }],
			"gradient-from": [{ from: j() }],
			"gradient-via": [{ via: j() }],
			"gradient-to": [{ to: j() }],
			rounded: [{ rounded: M() }],
			"rounded-s": [{ "rounded-s": M() }],
			"rounded-e": [{ "rounded-e": M() }],
			"rounded-t": [{ "rounded-t": M() }],
			"rounded-r": [{ "rounded-r": M() }],
			"rounded-b": [{ "rounded-b": M() }],
			"rounded-l": [{ "rounded-l": M() }],
			"rounded-ss": [{ "rounded-ss": M() }],
			"rounded-se": [{ "rounded-se": M() }],
			"rounded-ee": [{ "rounded-ee": M() }],
			"rounded-es": [{ "rounded-es": M() }],
			"rounded-tl": [{ "rounded-tl": M() }],
			"rounded-tr": [{ "rounded-tr": M() }],
			"rounded-br": [{ "rounded-br": M() }],
			"rounded-bl": [{ "rounded-bl": M() }],
			"border-w": [{ border: N() }],
			"border-w-x": [{ "border-x": N() }],
			"border-w-y": [{ "border-y": N() }],
			"border-w-s": [{ "border-s": N() }],
			"border-w-e": [{ "border-e": N() }],
			"border-w-bs": [{ "border-bs": N() }],
			"border-w-be": [{ "border-be": N() }],
			"border-w-t": [{ "border-t": N() }],
			"border-w-r": [{ "border-r": N() }],
			"border-w-b": [{ "border-b": N() }],
			"border-w-l": [{ "border-l": N() }],
			"divide-x": [{ "divide-x": N() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": N() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...P(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...P(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: j() }],
			"border-color-x": [{ "border-x": j() }],
			"border-color-y": [{ "border-y": j() }],
			"border-color-s": [{ "border-s": j() }],
			"border-color-e": [{ "border-e": j() }],
			"border-color-bs": [{ "border-bs": j() }],
			"border-color-be": [{ "border-be": j() }],
			"border-color-t": [{ "border-t": j() }],
			"border-color-r": [{ "border-r": j() }],
			"border-color-b": [{ "border-b": j() }],
			"border-color-l": [{ "border-l": j() }],
			"divide-color": [{ divide: j() }],
			"outline-style": [{ outline: [
				...P(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				K,
				Z,
				Y
			] }],
			"outline-w": [{ outline: [
				"",
				K,
				Zt,
				X
			] }],
			"outline-color": [{ outline: j() }],
			shadow: [{ shadow: [
				"",
				"none",
				u,
				nn,
				Xt
			] }],
			"shadow-color": [{ shadow: j() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				nn,
				Xt
			] }],
			"inset-shadow-color": [{ "inset-shadow": j() }],
			"ring-w": [{ ring: N() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: j() }],
			"ring-offset-w": [{ "ring-offset": [K, X] }],
			"ring-offset-color": [{ "ring-offset": j() }],
			"inset-ring-w": [{ "inset-ring": N() }],
			"inset-ring-color": [{ "inset-ring": j() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				nn,
				Xt
			] }],
			"text-shadow-color": [{ "text-shadow": j() }],
			opacity: [{ opacity: [
				K,
				Z,
				Y
			] }],
			"mix-blend": [{ "mix-blend": [
				...le(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": le() }],
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
			"mask-image-linear-pos": [{ "mask-linear": [K] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": F() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": F() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": j() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": j() }],
			"mask-image-t-from-pos": [{ "mask-t-from": F() }],
			"mask-image-t-to-pos": [{ "mask-t-to": F() }],
			"mask-image-t-from-color": [{ "mask-t-from": j() }],
			"mask-image-t-to-color": [{ "mask-t-to": j() }],
			"mask-image-r-from-pos": [{ "mask-r-from": F() }],
			"mask-image-r-to-pos": [{ "mask-r-to": F() }],
			"mask-image-r-from-color": [{ "mask-r-from": j() }],
			"mask-image-r-to-color": [{ "mask-r-to": j() }],
			"mask-image-b-from-pos": [{ "mask-b-from": F() }],
			"mask-image-b-to-pos": [{ "mask-b-to": F() }],
			"mask-image-b-from-color": [{ "mask-b-from": j() }],
			"mask-image-b-to-color": [{ "mask-b-to": j() }],
			"mask-image-l-from-pos": [{ "mask-l-from": F() }],
			"mask-image-l-to-pos": [{ "mask-l-to": F() }],
			"mask-image-l-from-color": [{ "mask-l-from": j() }],
			"mask-image-l-to-color": [{ "mask-l-to": j() }],
			"mask-image-x-from-pos": [{ "mask-x-from": F() }],
			"mask-image-x-to-pos": [{ "mask-x-to": F() }],
			"mask-image-x-from-color": [{ "mask-x-from": j() }],
			"mask-image-x-to-color": [{ "mask-x-to": j() }],
			"mask-image-y-from-pos": [{ "mask-y-from": F() }],
			"mask-image-y-to-pos": [{ "mask-y-to": F() }],
			"mask-image-y-from-color": [{ "mask-y-from": j() }],
			"mask-image-y-to-color": [{ "mask-y-to": j() }],
			"mask-image-radial": [{ "mask-radial": [Z, Y] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": F() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": F() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": j() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": j() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [K] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": F() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": F() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": j() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": j() }],
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
			"mask-position": [{ mask: ae() }],
			"mask-repeat": [{ mask: oe() }],
			"mask-size": [{ mask: se() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				Z,
				Y
			] }],
			filter: [{ filter: [
				"",
				"none",
				Z,
				Y
			] }],
			blur: [{ blur: ue() }],
			brightness: [{ brightness: [
				K,
				Z,
				Y
			] }],
			contrast: [{ contrast: [
				K,
				Z,
				Y
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				nn,
				Xt
			] }],
			"drop-shadow-color": [{ "drop-shadow": j() }],
			grayscale: [{ grayscale: [
				"",
				K,
				Z,
				Y
			] }],
			"hue-rotate": [{ "hue-rotate": [
				K,
				Z,
				Y
			] }],
			invert: [{ invert: [
				"",
				K,
				Z,
				Y
			] }],
			saturate: [{ saturate: [
				K,
				Z,
				Y
			] }],
			sepia: [{ sepia: [
				"",
				K,
				Z,
				Y
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				Z,
				Y
			] }],
			"backdrop-blur": [{ "backdrop-blur": ue() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				K,
				Z,
				Y
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				K,
				Z,
				Y
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				K,
				Z,
				Y
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				K,
				Z,
				Y
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				K,
				Z,
				Y
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				K,
				Z,
				Y
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				K,
				Z,
				Y
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				K,
				Z,
				Y
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
				Z,
				Y
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				K,
				"initial",
				Z,
				Y
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				Z,
				Y
			] }],
			delay: [{ delay: [
				K,
				Z,
				Y
			] }],
			animate: [{ animate: [
				"none",
				v,
				Z,
				Y
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				Z,
				Y
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: de() }],
			"rotate-x": [{ "rotate-x": de() }],
			"rotate-y": [{ "rotate-y": de() }],
			"rotate-z": [{ "rotate-z": de() }],
			scale: [{ scale: I() }],
			"scale-x": [{ "scale-x": I() }],
			"scale-y": [{ "scale-y": I() }],
			"scale-z": [{ "scale-z": I() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: fe() }],
			"skew-x": [{ "skew-x": fe() }],
			"skew-y": [{ "skew-y": fe() }],
			transform: [{ transform: [
				Z,
				Y,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: L() }],
			"translate-x": [{ "translate-x": L() }],
			"translate-y": [{ "translate-y": L() }],
			"translate-z": [{ "translate-z": L() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				q,
				Z,
				Y
			] }],
			accent: [{ accent: j() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: j() }],
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
				Z,
				Y
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
			"scrollbar-thumb-color": [{ "scrollbar-thumb": j() }],
			"scrollbar-track-color": [{ "scrollbar-track": j() }],
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
				Z,
				Y
			] }],
			fill: [{ fill: ["none", ...j()] }],
			"stroke-w": [{ stroke: [
				K,
				Zt,
				X,
				Gt
			] }],
			stroke: [{ stroke: ["none", ...j()] }],
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
	return pn(Je(e));
}
//#endregion
//#region src/render/Arm.tsx
var hn = /* @__PURE__ */ l("<svg><path fill=currentColor fill-opacity=1 stroke=none class=\"text-amber-300 dark:text-sky-800\"></svg>", !1, !0, !1), gn = /* @__PURE__ */ l("<svg><path fill=none stroke=currentColor stroke-width=8></svg>", !1, !0, !1);
function _n(e) {
	let n = () => e.pAtoBFrom !== void 0 || e.pAtoBTo !== void 0 || e.pBtoAFrom !== void 0 || e.pBtoATo !== void 0;
	return [t(f, {
		get when() {
			return n();
		},
		get children() {
			return [(() => {
				var t = hn();
				return r(() => s(t, "d", Ke(e.arm, e.transform, e.pAtoBFrom ?? 0, e.pAtoBTo ?? 0, e.bulgeScale ?? 1, "atob"))), t;
			})(), (() => {
				var t = hn();
				return r(() => s(t, "d", Ke(e.arm, e.transform, e.pBtoAFrom ?? 0, e.pBtoATo ?? 0, e.bulgeScale ?? 1, "btoa"))), t;
			})()];
		}
	}), t(f, {
		get when() {
			return !e.bulgeOnly;
		},
		get children() {
			var t = gn();
			return r((n) => {
				var r = Ge(e.arm, e.transform), i = e.dashed ? "butt" : "round", a = e.dashed ? "16 12" : void 0, o = mn("arm-stroke", e.class);
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
var vn = /* @__PURE__ */ l("<svg><g></svg>", !1, !0, !1), yn = /* @__PURE__ */ l("<svg><g data-interactive></svg>", !1, !0, !1), bn = /* @__PURE__ */ l("<svg><circle r=6 fill=currentColor></svg>", !1, !0, !1), xn = /* @__PURE__ */ l("<svg><circle r=6 fill=none stroke=currentColor stroke-width=2></svg>", !1, !0, !1), Sn = /* @__PURE__ */ l("<svg><polygon class=\"text-emerald-500 dark:text-emerald-400\"fill=currentColor stroke=none></svg>", !1, !0, !1), Cn = 9;
function wn() {
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
function Tn(e) {
	let n = () => z(e.piece.type), o = () => e.piece.magic?.arms ?? n().arms, l = () => e.piece.magic ? Ee : Pe(e.piece), u = () => e.piece.type === "magic-connector" && !e.piece.magic;
	function p(t) {
		let n = e.smoothedWidths?.get(`${e.piece.id}:${t}`);
		if (n) return n;
		let r = e.scores;
		if (!r) return null;
		let i = r.get(U({
			pieceId: e.piece.id,
			connectionIndex: t,
			direction: "AtoB"
		})) ?? 0, a = r.get(U({
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
			e.onSelect && (t.stopPropagation(), e.onSelect());
		}, h.addEventListener("pointerleave", () => e.onHoverPiece?.(null)), h.addEventListener("pointerenter", () => e.onHoverPiece?.(e.piece.id)), h.$$pointerdown = (e) => e.stopPropagation(), i(h, t(d, {
			get each() {
				return o();
			},
			children: (n, r) => {
				let i = () => p(r()), a = m() === "line";
				return t(_n, {
					arm: e.piece.type === "crossing-diamond" && r() === 1 ? wn() : n,
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
						return Fe(e.piece);
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
				return a(() => !!e.showAdapters)() && n().category === "adapter";
			},
			get children() {
				return (() => {
					let t = Fe(e.piece), n = t.reduce((e, t) => e + t.position[0], 0) / t.length, r = t.reduce((e, t) => e + t.position[1], 0) / t.length, i = Cn;
					return (() => {
						var e = Sn();
						return s(e, "points", `${n},${r - i} ${n + i},${r} ${n},${r + i} ${n - i},${r}`), e;
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
var En = /* @__PURE__ */ l("<svg><polygon fill=currentColor stroke=none class=\"text-amber-300 dark:text-sky-800\"></svg>", !1, !0, !1);
function Dn(e) {
	let n = () => On(e.track, e.smoothedWidths, e.bulgeScale);
	return t(d, {
		get each() {
			return n();
		},
		children: (e) => (() => {
			var t = En();
			return s(t, "points", e), t;
		})()
	});
}
function On(e, t, n) {
	let r = Re(e), i = [];
	for (let a of r) {
		if (a.members.length < 2) continue;
		let r = [];
		for (let { pieceId: i, endIndex: o } of a.members) {
			let s = e.pieces.find((e) => e.id === i);
			if (!s) continue;
			let c = z(s.type);
			for (let e = 0; e < c.connections.length; e++) {
				let [l, u] = c.connections[e];
				if (l !== o && u !== o) continue;
				let d = V(s.magic ? s.magic.arms[e] : ke(c.arms[e], Pe(s)), l === o ? 0 : 1), f = t.get(`${i}:${e}`), p = l === o ? f?.atobFrom ?? 0 : f?.atobTo ?? 0, m = l === o ? f?.btoaFrom ?? 0 : f?.btoaTo ?? 0;
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
function kn(e, t = 1) {
	if (e.pieces.length === 0) return {
		x: -5,
		y: -5,
		width: 10,
		height: 10
	};
	let n = Infinity, r = Infinity, i = -Infinity, a = -Infinity;
	for (let t of e.pieces) {
		let e = t.magic?.bounds ?? z(t.type).bounds, o = t.magic ? null : Pe(t), s = [
			[e.min[0], e.min[1]],
			[e.min[0], e.max[1]],
			[e.max[0], e.min[1]],
			[e.max[0], e.max[1]]
		];
		for (let e of s) {
			let [t, s] = o ? H(e, o) : e;
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
var An = /* @__PURE__ */ l("<svg preserveAspectRatio=\"xMidYMid meet\"><g transform=\"matrix(1 0 0 -1 0 0)\"><g></g><g>");
function jn(e) {
	let n = m(() => e.bbox ?? kn(e.track)), a = () => {
		let e = n();
		return `${e.x} ${-(e.y + e.height)} ${e.width} ${e.height}`;
	}, o = m(() => e.scores ? Ue(e.track, e.scores) : void 0), c = m(() => {
		let t = o();
		if (!t) return 0;
		let n = Be(t);
		return n <= 0 ? 0 : 50 / n * ((e.bulgeScale ?? 100) / 100);
	});
	return (() => {
		var n = An(), l = n.firstChild, p = l.firstChild, m = p.nextSibling, h = e.svgRef;
		return typeof h == "function" ? u(h, n) : e.svgRef = n, i(p, t(f, {
			get when() {
				return o();
			},
			get children() {
				return t(Dn, {
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
			children: (n) => t(Tn, {
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
			children: (n) => t(Tn, {
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
					return e.selectedPieceId === n.id;
				},
				get onSelect() {
					return e.onSelectPiece ? () => e.onSelectPiece(n.id) : void 0;
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
function Mn(e, t = [0, 0], n = 0, r = 1) {
	let i = {
		id: Me(),
		type: e,
		position: t,
		rotation: n
	}, a = Fe(i), o = {
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
function Nn(e, t, n = {}) {
	if (!e.active) throw Error("No active end to attach to.");
	let r = n.attachingEndIndex ?? 0, i = n.continueEndIndex ?? 1, a = Ie(t, r, e.active);
	if (!a) throw Error(`Polarity mismatch attaching ${t}.ends[${r}] to active end.`);
	let o = z(t).ends.map((e) => Oe(e, {
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
function Pn(e) {
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
			let t = In[e.type];
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
	Ne(r.length);
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
function Fn(e, t) {
	return !t || t.pieceIndex < 0 || t.pieceIndex >= e.pieces.length ? null : {
		pieceId: e.pieces[t.pieceIndex].id,
		connectionIndex: t.connectionIndex,
		direction: t.direction
	};
}
var In = {
	"curve-22": "curve-22-r",
	"curve-45": "curve-45-r",
	"switch-y": "switch-y-r"
};
//#endregion
//#region src/layouts/presets.ts
function Ln() {
	let e = Mn("curve-45-l");
	for (let t = 0; t < 7; t++) e = Nn(e, "curve-45-l");
	return e.track;
}
function Rn() {
	let e = Mn("straight-long");
	e = Nn(e, "switch-y-l", { continueEndIndex: 1 }), e = Nn(e, "curve-22-l"), e = Nn(e, "straight-short");
	let t = e.track, n = t.pieces.find((e) => e.type === "switch-y-l"), r = {
		track: t,
		active: {
			...Fe(n)[2],
			ref: {
				pieceId: n.id,
				endIndex: 2
			}
		}
	};
	return r = Nn(r, "curve-22-r"), r = Nn(r, "straight-short"), r.track;
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
	return Pn(zn).track;
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
	return Pn(Vn).track;
}
var Un = [
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
function Wn(e) {
	return Un.find((t) => t.id === e) ?? null;
}
//#endregion
//#region src/embed/resolve.ts
function Gn(e) {
	return !!e && typeof e == "object" && Array.isArray(e.pieces) && e.pieces.every((e) => typeof e.id == "string");
}
function Kn(e) {
	if (e.preset) {
		let t = Wn(e.preset);
		return {
			track: t ? t.build() : { pieces: [] },
			seed: null
		};
	}
	if (Gn(e.track)) return {
		track: e.track,
		seed: null
	};
	let { track: t, seed: n } = Pn(e.track);
	return {
		track: t,
		seed: n
	};
}
function qn(e, t) {
	if (t) {
		let n = {
			pieceIndex: t.pieceIndex,
			connectionIndex: t.connectionIndex ?? 0,
			direction: t.direction ?? "AtoB"
		};
		return Fn(e.track, n);
	}
	return e.seed ? e.seed : e.track.pieces.length === 0 ? null : {
		pieceId: e.track.pieces[0].id,
		connectionIndex: 0,
		direction: "AtoB"
	};
}
//#endregion
//#region src/embed/TrackFigure.tsx
var Jn = /* @__PURE__ */ l("<div>");
function Yn(n) {
	let a = m(() => Kn(n)), o = m(() => kn(a().track, n.padding ?? 2));
	return (() => {
		var s = Jn();
		return i(s, t(jn, {
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
function Xn(e) {
	let t = Re(e), n = [], r = /* @__PURE__ */ new Map();
	for (let t of e.pieces) {
		let e = z(t.type);
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
function Zn(e, t, n = "reflect") {
	let r = [], i = new Map(e.pieces.map((e) => [e.id, e]));
	for (let e of t.states) {
		let a = i.get(e.pieceId), [o, s] = z(a.type).connections[e.connectionIndex], c = e.direction === "AtoB" ? s : o, l = ze(t.junctions, {
			pieceId: a.id,
			endIndex: c
		}), u = [];
		if (l) for (let e of l.members) {
			if (e.pieceId === a.id && e.endIndex === c) continue;
			let t = z(i.get(e.pieceId).type);
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
function Qn(e, t = {}) {
	let n = t.iterations ?? 500, r = t.deadEndPolicy ?? "reflect", i = Xn(e), a = i.states.length, o = /* @__PURE__ */ new Map();
	if (a === 0) return o;
	let s = Zn(e, i, r), c = new Float64Array(a);
	for (let e = 0; e < a; e++) c[e] = 1 / a;
	let l = new Float64Array(a);
	for (let e = 0; e < n; e++) {
		l.fill(0);
		for (let e = 0; e < a; e++) {
			let t = c[e];
			if (t === 0) continue;
			let n = s[e];
			for (let e = 0; e < n.length; e++) l[n[e].col] += t * n[e].p;
		}
		let e = 0;
		for (let t = 0; t < a; t++) e += l[t];
		if (e > 0) for (let t = 0; t < a; t++) l[t] /= e;
		let t = c;
		c = l, l = t;
	}
	return i.states.forEach((e, t) => {
		o.set(U(e), c[t]);
	}), o;
}
//#endregion
//#region src/scoring/transitions.ts
function $n(e) {
	let t = e >>> 0;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function er(e, t) {
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
function tr(e, t = {}) {
	let n = t.steps ?? 1e5, r = t.deadEndPolicy ?? "reflect", i = Xn(e), a = i.states.length, o = /* @__PURE__ */ new Map();
	if (a === 0) return o;
	let s = Zn(e, i, r), c = $n(t.seed ?? Date.now()), l = new Uint32Array(a), u = t.startState?.direction ?? t.startDirection ?? (c() < .5 ? "AtoB" : "BtoA"), d = i.states.reduce((e, t, n) => (t.direction === u && e.push(n), e), []), f = Math.max(64, Math.min(512, Math.ceil(n / 5e3))), p = Math.max(1, Math.floor(n / f));
	for (let e = 0; e < f; e++) {
		let e = d[Math.floor(c() * d.length)];
		for (let t = 0; t < p; t++) l[e] += 1, e = er(s[e], c);
	}
	let m = 0;
	for (let e = 0; e < a; e++) m += l[e];
	return i.states.forEach((e, t) => {
		o.set(U(e), l[t] / m);
	}), o;
}
//#endregion
//#region src/embed/TrackScoring.tsx
var nr = /* @__PURE__ */ l("<div>");
function rr(n) {
	let a = m(() => Kn(n)), o = m(() => kn(a().track, n.padding ?? 2)), s = m(() => {
		let e = a();
		if (e.track.pieces.length !== 0) {
			if (n.mode === "mc") {
				let t = qn(e, n.seed);
				return tr(e.track, {
					steps: T,
					startState: t ?? void 0
				});
			}
			return Qn(e.track);
		}
	});
	return (() => {
		var c = nr();
		return i(c, t(jn, {
			get track() {
				return a().track;
			},
			get bbox() {
				return o();
			},
			get scores() {
				return s();
			},
			get bulgeScale() {
				return n.bulgeScale ?? 100;
			}
		})), r(() => e(c, `tt-embed ${n.class ?? ""}`)), c;
	})();
}
//#endregion
//#region src/render/Train.tsx
var ir = /* @__PURE__ */ l("<svg><g></svg>", !1, !0, !1), ar = /* @__PURE__ */ l("<svg><rect x=-15 y=-10 width=30 height=20 rx=3></svg>", !1, !0, !1), or = /* @__PURE__ */ l("<svg><polygon points=\"15,-10 15,10 25,0\"></svg>", !1, !0, !1), sr = /* @__PURE__ */ l("<svg><g class=\"text-blue-500 dark:text-amber-500\"fill=currentColor stroke=none style=pointer-events:none></svg>", !1, !0, !1);
function cr(e, t) {
	let n = t.pieces.find((t) => t.id === e.pieceId);
	return n ? n.magic ? n.magic.arms[e.connectionIndex] ?? null : ke(z(n.type).arms[e.connectionIndex], Pe(n)) : null;
}
function lr(e, t, n) {
	let r = e.state, i = e.sampleT, a = e.armLen, o = e.arm, s = n, c = 0;
	for (let n = 0; n < e.trail.length + 1; n++) {
		let n = r.direction === "AtoB" ? i * a : (1 - i) * a;
		if (s <= n) {
			let e = s / a, t = r.direction === "AtoB" ? i - e : i + e, n = V(o, Math.max(0, Math.min(1, t))), c = r.direction === "AtoB" ? n.tangent : [-n.tangent[0], -n.tangent[1]];
			return {
				position: n.point,
				tangent: c
			};
		}
		s -= n;
		let l = e.trail[c++] ?? null;
		if (!l) {
			let e = r.direction === "AtoB" ? 0 : 1, t = V(o, e), n = r.direction === "AtoB" ? t.tangent : [-t.tangent[0], -t.tangent[1]];
			return {
				position: [t.point[0] - n[0] * s, t.point[1] - n[1] * s],
				tangent: n
			};
		}
		r = l;
		let u = cr(r, t);
		if (!u) break;
		o = u, a = B(o), i = +(r.direction === "AtoB");
	}
	return {
		position: e.position,
		tangent: e.tangent
	};
}
function ur(e) {
	return Math.atan2(e[1], e[0]) * 180 / Math.PI;
}
function dr(e) {
	return (() => {
		var t = ir();
		return i(t, () => e.children), r((n) => {
			var r = `translate(${e.position[0]} ${e.position[1]}) rotate(${ur(e.tangent)})`, i = e.opacity;
			return r !== n.e && s(t, "transform", n.e = r), i !== n.t && s(t, "opacity", n.t = i), n;
		}, {
			e: void 0,
			t: void 0
		}), t;
	})();
}
var fr = 38, pr = 76;
function mr(e) {
	let n = () => lr(e.walker, e.track, fr), r = () => lr(e.walker, e.track, pr);
	return (() => {
		var a = sr();
		return i(a, t(dr, {
			get position() {
				return r().position;
			},
			get tangent() {
				return r().tangent;
			},
			opacity: 1,
			get children() {
				return ar();
			}
		}), null), i(a, t(dr, {
			get position() {
				return n().position;
			},
			get tangent() {
				return n().tangent;
			},
			opacity: 1,
			get children() {
				return ar();
			}
		}), null), i(a, t(dr, {
			get position() {
				return e.walker.position;
			},
			get tangent() {
				return e.walker.tangent;
			},
			get children() {
				return [ar(), or()];
			}
		}), null), a;
	})();
}
//#endregion
//#region src/scoring/live-montecarlo.ts
var hr = 20, gr = 5e3;
function _r(e, t = !0) {
	if (e <= 0) return { kind: "paused" };
	if (e >= 100 && t) return { kind: "snap" };
	let n = t ? (e - 1) / 98 : (e - 1) / 99;
	return {
		kind: "running",
		unitsPerSecond: hr * (gr / hr) ** +Math.max(0, Math.min(1, n))
	};
}
function vr(e) {
	let t = e.deadEndPolicy ?? "reflect", n = $n((Date.now() ^ 2654435769) >>> 0), r = null, i = null, a = 0, o = null, [s, c] = h(/* @__PURE__ */ new Map()), [l, u] = h(null);
	function d(r) {
		let i = Xn(r);
		if (i.states.length === 0) return null;
		let a = Zn(r, i, t), o = new Uint32Array(i.states.length), s = e.seed?.() ?? null, c = s ? i.index.get(U(s)) ?? null : null;
		return {
			enumerated: i,
			P: a,
			counts: o,
			currentIdx: c === null ? Math.floor(n() * i.states.length) : c,
			armT: 0,
			trail: []
		};
	}
	function f() {
		if (!r) {
			c(/* @__PURE__ */ new Map());
			return;
		}
		let { enumerated: e, counts: t } = r, n = /* @__PURE__ */ new Map(), i = 0;
		for (let e = 0; e < t.length; e++) i += t[e];
		i === 0 ? e.states.forEach((e) => n.set(U(e), 0)) : e.states.forEach((e, r) => {
			n.set(U(e), t[r] / i);
		}), c(n);
	}
	function m(e, t) {
		let n = t.pieces.find((t) => t.id === e.pieceId);
		return n ? n.magic ? n.magic.arms[e.connectionIndex] : ke(z(n.type).arms[e.connectionIndex], Pe(n)) : null;
	}
	function v(e) {
		if (!r) return null;
		let t = r.enumerated.states[r.currentIdx], n = m(t, e);
		if (!n) return null;
		let i = t.direction === "AtoB" ? r.armT : 1 - r.armT, a = V(n, Math.max(0, Math.min(1, i))), o = t.direction === "AtoB" ? a.tangent : [-a.tangent[0], -a.tangent[1]], s = B(n);
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
	function y(e, t) {
		let n = m(e, t);
		return n ? B(n) : 1;
	}
	function b() {
		let t = e.track();
		r = d(t), i = null, f(), u(v(t));
	}
	p(() => {
		e.track(), b();
	});
	function x(t) {
		if (o = requestAnimationFrame(x), !e.enabled()) {
			l() !== null && u(null), i = null;
			return;
		}
		if (!r) return;
		let s = e.track();
		u(v(s));
		let c = e.speed();
		if (c.kind !== "running") {
			i = null;
			return;
		}
		if (i === null) {
			i = t;
			return;
		}
		let d = Math.min(.25, (t - i) / 1e3);
		i = t;
		let p = y(r.enumerated.states[r.currentIdx], s);
		r.armT += d * c.unitsPerSecond / Math.max(p, 1e-6);
		let m = 0;
		for (; r.armT >= 1 && m < 1e3;) {
			let e = (r.armT - 1) * p;
			r.counts[r.currentIdx] += 1, r.trail.unshift(r.enumerated.states[r.currentIdx]), r.trail.length > 8 && (r.trail.length = 8), r.currentIdx = er(r.P[r.currentIdx], n), p = y(r.enumerated.states[r.currentIdx], s), r.armT = e / Math.max(p, 1e-6), m += 1;
		}
		r.armT > 1 && (r.armT = 0), u(v(s)), t - a > 33 && (f(), a = t);
	}
	_(() => {
		o = requestAnimationFrame(x);
	}), g(() => {
		o !== null && cancelAnimationFrame(o);
	});
	function S() {
		return r ? r.enumerated.states[r.currentIdx]?.direction ?? null : null;
	}
	return {
		scores: s,
		walker: l,
		reset: b,
		currentDirection: S
	};
}
//#endregion
//#region src/scoring/piece-stats.ts
function yr(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e.pieces) {
		let e = z(r.type), i = 0, a = 0;
		for (let n = 0; n < e.connections.length; n++) i += t.get(`${r.id}:${n}:AtoB`) ?? 0, a += t.get(`${r.id}:${n}:BtoA`) ?? 0;
		n.set(r.id, {
			total: i + a,
			atob: i,
			btoa: a
		});
	}
	return n;
}
function br(e) {
	let t = [...e.values()].filter((e) => e > 0);
	return t.length === 0 ? 0 : t.reduce((e, t) => e - t * Math.log(t), 0) / Math.log(t.length);
}
//#endregion
//#region src/embed/TrackLiveMC.tsx
var xr = /* @__PURE__ */ l("<div><div class=tt-stage><div class=tt-entropy>entropy </div></div><div class=tt-controls><button type=button class=tt-playpause></button><div class=tt-slider><span class=tt-speed-label></span><input type=range min=0 max=100 step=1 aria-label=\"simulation speed\"></div><button type=button class=tt-reset>Reset"), Sr = /* @__PURE__ */ l("<div class=tt-tooltip><div class=tt-tooltip-total>%</div><div class=tt-tooltip-split>→ <!>% / ← <!>%");
function Cr(n) {
	let a = m(() => Kn(n)), o = m(() => kn(a().track, n.padding ?? 2)), l = m(() => qn(a(), n.seed)), [d, p] = h(n.initialSpeed ?? 20), [v, y] = h(!0), [b, x] = h(!1), S;
	_(() => {
		if (!S || typeof IntersectionObserver > "u") {
			x(!0);
			return;
		}
		let e = new IntersectionObserver((e) => e.forEach((e) => x(e.isIntersecting)), { threshold: .25 });
		e.observe(S), g(() => e.disconnect());
	});
	let C = vr({
		track: () => a().track,
		speed: m(() => v() && b() ? _r(d(), !1) : { kind: "paused" }),
		enabled: () => !0,
		seed: l
	}), [w, T] = h(null), [E, ee] = h(null), D = m(() => yr(a().track, C.scores())), te = m(() => br(C.scores())), ne = () => {
		let e = d();
		if (e <= 0) return "paused";
		let t = _r(e, !1);
		return t.kind === "running" ? `${Math.round(t.unitsPerSecond)} mm/s` : "max";
	}, O = m(() => {
		let e = w(), t = E();
		if (!e || !t) return null;
		let n = D().get(e);
		return !n || n.total === 0 ? null : {
			pos: t,
			stat: n
		};
	});
	function k(e) {
		let t = e.currentTarget.getBoundingClientRect();
		ee({
			x: e.clientX - t.left,
			y: e.clientY - t.top
		});
	}
	function A() {
		ee(null), T(null);
	}
	return (() => {
		var l = xr(), m = l.firstChild, h = m.firstChild;
		h.firstChild;
		var g = m.nextSibling.firstChild, _ = g.nextSibling, b = _.firstChild, x = b.nextSibling, w = _.nextSibling, E = S;
		return typeof E == "function" ? u(E, l) : S = l, m.addEventListener("pointerleave", A), m.$$pointermove = k, i(m, t(jn, {
			get track() {
				return a().track;
			},
			get bbox() {
				return o();
			},
			get scores() {
				return C.scores();
			},
			get bulgeScale() {
				return n.bulgeScale ?? 100;
			},
			get showAdapters() {
				return n.showAdapters ?? !1;
			},
			onHoverPiece: T,
			get children() {
				return t(f, {
					get when() {
						return C.walker();
					},
					children: (e) => t(mr, {
						get walker() {
							return e();
						},
						get track() {
							return a().track;
						}
					})
				});
			}
		}), h), i(h, () => te().toFixed(3), null), i(m, t(f, {
			get when() {
				return O();
			},
			children: (e) => (() => {
				var t = Sr(), n = t.firstChild, a = n.firstChild, o = n.nextSibling, s = o.firstChild.nextSibling, l = s.nextSibling.nextSibling;
				return l.nextSibling, i(n, () => (e().stat.total * 100).toFixed(1), a), i(o, () => (e().stat.atob * 100).toFixed(1), s), i(o, () => (e().stat.btoa * 100).toFixed(1), l), r((n) => {
					var r = `${e().pos.x + 14}px`, i = `${e().pos.y + 14}px`;
					return r !== n.e && c(t, "left", n.e = r), i !== n.t && c(t, "top", n.t = i), n;
				}, {
					e: void 0,
					t: void 0
				}), t;
			})()
		}), null), g.$$click = () => y((e) => !e), i(g, () => v() ? "⏸" : "▶"), i(b, ne), x.$$input = (e) => p(+e.currentTarget.value), w.$$click = () => C.reset(), r((t) => {
			var r = `tt-embed ${n.class ?? ""}`, i = v() ? "pause" : "play", a = `${d() / 100}`;
			return r !== t.e && e(l, t.e = r), i !== t.t && s(g, "aria-label", t.t = i), a !== t.a && c(_, "--tt-pct", t.a = a), t;
		}, {
			e: void 0,
			t: void 0,
			a: void 0
		}), r(() => x.value = d()), l;
	})();
}
n([
	"pointermove",
	"click",
	"input"
]);
//#endregion
//#region src/embed/mount.tsx
function wr(e, n) {
	return o(() => t(Yn, n), e);
}
function Tr(e, n) {
	return o(() => t(rr, n), e);
}
function Er(e, n) {
	return o(() => t(Cr, n), e);
}
//#endregion
export { Un as PRESETS, Yn as TrackFigure, Cr as TrackLiveMC, rr as TrackScoring, Wn as findPreset, wr as mountTrackFigure, Er as mountTrackLiveMC, Tr as mountTrackScoring, Kn as resolveFigure, qn as resolveSeed };
