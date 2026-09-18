/* Light Rays — Background Animations/1 z biblioteki awwwards.
   Czysty WebGL, bez zależności. Sterowanie przez data-* na .light-rays.
   Skrypt dociągany jest z js/app.js dopiero, gdy ruch jest dozwolony. */
const hexToRgb = hex => {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return m
		? [
				parseInt(m[1], 16) / 255,
				parseInt(m[2], 16) / 255,
				parseInt(m[3], 16) / 255,
			]
		: [1, 1, 1]
}

const getAnchorAndDir = (origin, w, h) => {
	const outside = 0.2
	switch (origin) {
		case 'top-left':
			return { anchor: [0, -outside * h], dir: [0, 1] }
		case 'top-right':
			return { anchor: [w, -outside * h], dir: [0, 1] }
		case 'left':
			return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] }
		case 'right':
			return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] }
		case 'bottom-left':
			return { anchor: [0, (1 + outside) * h], dir: [0, -1] }
		case 'bottom-center':
			return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] }
		case 'bottom-right':
			return { anchor: [w, (1 + outside) * h], dir: [0, -1] }
		default:
			return { anchor: [0.5 * w, -outside * h], dir: [0, 1] }
	}
}

const bool = (v, fallback = false) =>
	v == null ? fallback : String(v) !== 'false'

const vert = `
attribute vec2 position;
varying vec2 vUv;
void main(){
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`

const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st){
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed){
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;

  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);

  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0){
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0){
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0){
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main(){
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`

const initLightRays = () => {
	document.querySelectorAll('.light-rays').forEach(container => {
		if (container._raysCleanup) container._raysCleanup()

		const origin = container.dataset.origin || 'top-center'
		const raysColor = container.dataset.color || '#ffffff'
		const raysSpeed = parseFloat(container.dataset.speed || '1')
		const lightSpread = parseFloat(container.dataset.spread || '1')
		const rayLength = parseFloat(container.dataset.length || '2')
		const pulsating = bool(container.dataset.pulsating, false)
		const fadeDistance = parseFloat(container.dataset.fade || '1')
		const saturation = parseFloat(container.dataset.saturation || '1')
		const followMouse = bool(container.dataset.follow, true)
		const mouseInfluence = parseFloat(container.dataset.mouse || '0.1')
		const noiseAmount = parseFloat(container.dataset.noise || '0')
		const distortion = parseFloat(container.dataset.distortion || '0')

		const canvas = document.createElement('canvas')
		canvas.style.width = '100%'
		canvas.style.height = '100%'
		canvas.style.display = 'block'

		container.innerHTML = ''
		container.appendChild(canvas)

		const gl =
			canvas.getContext('webgl', {
				alpha: true,
				antialias: true,
				premultipliedAlpha: false,
			}) ||
			canvas.getContext('experimental-webgl', {
				alpha: true,
				antialias: true,
				premultipliedAlpha: false,
			})
		if (!gl) return

		gl.clearColor(0, 0, 0, 0)
		gl.disable(gl.DEPTH_TEST)
		gl.disable(gl.CULL_FACE)
		gl.enable(gl.BLEND)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

		const compile = (type, src) => {
			const sh = gl.createShader(type)
			gl.shaderSource(sh, src)
			gl.compileShader(sh)
			if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null
			return sh
		}

		const link = (vs, fs) => {
			const p = gl.createProgram()
			gl.attachShader(p, vs)
			gl.attachShader(p, fs)
			gl.linkProgram(p)
			if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null
			return p
		}

		const vs = compile(gl.VERTEX_SHADER, vert)
		const fs = compile(gl.FRAGMENT_SHADER, frag)
		if (!vs || !fs) return

		const program = link(vs, fs)
		if (!program) return

		gl.useProgram(program)

		const posLoc = gl.getAttribLocation(program, 'position')

		const uTimeLoc = gl.getUniformLocation(program, 'iTime')
		const uResLoc = gl.getUniformLocation(program, 'iResolution')

		const uRayPosLoc = gl.getUniformLocation(program, 'rayPos')
		const uRayDirLoc = gl.getUniformLocation(program, 'rayDir')
		const uRaysColorLoc = gl.getUniformLocation(program, 'raysColor')
		const uRaysSpeedLoc = gl.getUniformLocation(program, 'raysSpeed')
		const uLightSpreadLoc = gl.getUniformLocation(program, 'lightSpread')
		const uRayLengthLoc = gl.getUniformLocation(program, 'rayLength')
		const uPulsatingLoc = gl.getUniformLocation(program, 'pulsating')
		const uFadeDistanceLoc = gl.getUniformLocation(program, 'fadeDistance')
		const uSaturationLoc = gl.getUniformLocation(program, 'saturation')
		const uMousePosLoc = gl.getUniformLocation(program, 'mousePos')
		const uMouseInfluenceLoc = gl.getUniformLocation(program, 'mouseInfluence')
		const uNoiseAmountLoc = gl.getUniformLocation(program, 'noiseAmount')
		const uDistortionLoc = gl.getUniformLocation(program, 'distortion')

		const quad = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, quad)
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 3, -1, -1, 3]),
			gl.STATIC_DRAW,
		)
		gl.enableVertexAttribArray(posLoc)
		gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

		const uniforms = {
			iTime: 0,
			iResolution: [1, 1],
			rayPos: [0, 0],
			rayDir: [0, 1],
			raysColor: hexToRgb(raysColor),
			raysSpeed,
			lightSpread,
			rayLength,
			pulsating: pulsating ? 1.0 : 0.0,
			fadeDistance,
			saturation,
			mousePos: [0.5, 0.5],
			mouseInfluence,
			noiseAmount,
			distortion,
		}

		const mouse = { x: 0.5, y: 0.5 }
		const smooth = { x: 0.5, y: 0.5 }

		const setMouse = (clientX, clientY) => {
			const rect = container.getBoundingClientRect()
			mouse.x = (clientX - rect.left) / rect.width
			mouse.y = (clientY - rect.top) / rect.height
		}

		const onMouse = e => setMouse(e.clientX, e.clientY)
		const onTouch = e => {
			const t = e.touches[0]
			if (!t) return
			setMouse(t.clientX, t.clientY)
		}

		const updatePlacement = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2)
			const wCSS = container.clientWidth
			const hCSS = container.clientHeight
			const w = Math.max(1, Math.floor(wCSS * dpr))
			const h = Math.max(1, Math.floor(hCSS * dpr))
			canvas.width = w
			canvas.height = h
			gl.viewport(0, 0, w, h)
			uniforms.iResolution = [w, h]
			const ad = getAnchorAndDir(origin, w, h)
			uniforms.rayPos = ad.anchor
			uniforms.rayDir = ad.dir
		}

		updatePlacement()

		const onResize = () => updatePlacement()
		window.addEventListener('resize', onResize)

		if (followMouse) {
			window.addEventListener('mousemove', onMouse)
			window.addEventListener('touchmove', onTouch, { passive: true })
		}

		gl.uniform3fv(uRaysColorLoc, new Float32Array(uniforms.raysColor))
		gl.uniform1f(uRaysSpeedLoc, uniforms.raysSpeed)
		gl.uniform1f(uLightSpreadLoc, uniforms.lightSpread)
		gl.uniform1f(uRayLengthLoc, uniforms.rayLength)
		gl.uniform1f(uPulsatingLoc, uniforms.pulsating)
		gl.uniform1f(uFadeDistanceLoc, uniforms.fadeDistance)
		gl.uniform1f(uSaturationLoc, uniforms.saturation)
		gl.uniform1f(uMouseInfluenceLoc, uniforms.mouseInfluence)
		gl.uniform1f(uNoiseAmountLoc, uniforms.noiseAmount)
		gl.uniform1f(uDistortionLoc, uniforms.distortion)

		let raf = 0

		const loop = t => {
			uniforms.iTime = t * 0.001

			if (followMouse && uniforms.mouseInfluence > 0) {
				const s = 0.92
				smooth.x = smooth.x * s + mouse.x * (1 - s)
				smooth.y = smooth.y * s + mouse.y * (1 - s)
				uniforms.mousePos = [smooth.x, smooth.y]
			}

			gl.uniform1f(uTimeLoc, uniforms.iTime)
			gl.uniform2fv(uResLoc, new Float32Array(uniforms.iResolution))
			gl.uniform2fv(uRayPosLoc, new Float32Array(uniforms.rayPos))
			gl.uniform2fv(uRayDirLoc, new Float32Array(uniforms.rayDir))
			gl.uniform2fv(uMousePosLoc, new Float32Array(uniforms.mousePos))

			// rysujemy tylko, gdy kontener jest w kadrze (flagę ustawia app.js)
			if (container._raysVisible !== false) gl.drawArrays(gl.TRIANGLES, 0, 3)
			raf = requestAnimationFrame(loop)
		}

		raf = requestAnimationFrame(loop)

		container._raysCleanup = () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('resize', onResize)
			if (followMouse) {
				window.removeEventListener('mousemove', onMouse)
				window.removeEventListener('touchmove', onTouch)
			}
			try {
				const lose = gl.getExtension('WEBGL_lose_context')
				if (lose) lose.loseContext()
			} catch {}
			if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
			container.innerHTML = ''
		}
	})
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initLightRays)
} else {
	initLightRays()
}
