/** State uniforms provided by `useAgentMotion`, plus small helpers every agent shader uses. */
export const AGENT_PRELUDE = `
uniform float u_idle;
uniform float u_thinking;
uniform float u_speaking;
uniform float u_phase;
uniform float u_level;

const float PI = 3.14159265;
const float TAU = 6.28318531;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
`;

/**
 * Shared toolkit for the agent orbs. Each orb is a physical object, so it lights itself;
 * this only supplies the geometry, 3D noise, colour helpers and the final output.
 */
export const ORB_GLSL = `
uniform float u_hue;

// Centred coordinates in orb units, so the rim sits at length 1. pxq is one device pixel.
vec2 orbCoords(float radius, out float pxq) {
  float scale = min(u_resolution.x, u_resolution.y) * radius;
  pxq = 1.0 / scale;
  return (gl_FragCoord.xy - 0.5 * u_resolution) / scale;
}

// Antialiased silhouette.
float orbCover(float r, float pxq) {
  return 1.0 - smoothstep(1.0 - 1.5 * pxq, 1.0 + 1.5 * pxq, r);
}

// The visible hemisphere's surface normal for a point in the unit disc; the camera looks down -z.
vec3 sphereNormal(vec2 q) {
  return vec3(q, sqrt(max(1.0 - dot(q, q), 0.0)));
}

mat3 rotateX(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

mat3 rotateY(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.103, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

// Value noise in 3D, so patterns can live on the sphere itself and roll with it — no seams, no poles.
float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i), hash31(i + vec3(1.0, 0.0, 0.0)), u.x),
        mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
    mix(mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), u.x),
        mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), u.x), u.y),
    u.z
  );
}

float fbm3(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise3(p);
    p = p * 2.07 + 5.3;
    amplitude *= 0.5;
  }
  return value;
}

// 0 red, .17 magenta, .33 blue, .5 cyan, .67 green, .83 yellow.
vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(TAU * (t + vec3(0.0, 0.33, 0.67)));
}

// Rotates a colour around the grey axis.
vec3 hueShift(vec3 color, float angle) {
  vec3 k = vec3(0.57735);
  float c = cos(angle);
  return color * c + cross(k, color) * sin(angle) + k * dot(k, color) * (1.0 - c);
}

// Rolls highlights off smoothly instead of clipping them to flat white.
vec3 tonemap(vec3 color) {
  return 1.0 - exp(-max(color, 0.0));
}

// Applies the hue prop and a touch of film grain, and returns premultiplied output.
vec4 orbOutput(vec3 color, float alpha) {
  alpha = clamp(alpha, 0.0, 1.0);
  color = hueShift(color, u_hue);
  color += (hash21(gl_FragCoord.xy + floor(u_time * 30.0) * 13.1) - 0.5) * 0.03 * alpha;
  return vec4(clamp(color, 0.0, alpha), alpha);
}
`;
