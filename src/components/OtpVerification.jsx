import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

// Komponen verifikasi OTP buatan sendiri (ciri khas WF Template):
// CSS murni + Web Animations API — tanpa library animasi.
// Ring progres & sapuan tombol mengikuti ketikan, status verifying,
// sukses hijau berjenjang dengan glow + halo, gagal bergetar merah.

const RING_R = 30
const RING_C = 2 * Math.PI * RING_R

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function OtpVerification({
  length = 4,
  destination,
  title = 'Verifikasi identitas',
  onVerify,
  onContinue,
  onResend,
  resendSeconds = 30,
  verifyDelayMs = 900,
}) {
  const [digits, setDigits] = useState(() => Array.from({ length }, () => ''))
  const [status, setStatus] = useState('idle') // idle | verifying | success | error
  const [secondsLeft, setSecondsLeft] = useState(resendSeconds)
  const inputsRef = useRef([])
  const boxesRef = useRef([])
  const rowRef = useRef(null)
  const clearTimerRef = useRef(null)
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const filled = digits.filter((d) => d !== '').length
  const progress = status === 'success' || status === 'verifying' ? 1 : filled / length
  const success = status === 'success'
  const error = status === 'error'

  useEffect(
    () => () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    },
    [],
  )

  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const id = setInterval(() => setSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [secondsLeft > 0])

  // Pantulan kotak satu-satu saat sukses.
  useEffect(() => {
    if (status !== 'success' || reduceMotion.current) return
    boxesRef.current.forEach((box, i) => {
      if (box)
        box.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.12)', offset: 0.4 }, { transform: 'scale(1)' }],
          { duration: 340, delay: i * 70, easing: 'ease-out' },
        )
    })
  }, [status])

  const focusInput = (index) => {
    const el = inputsRef.current[Math.max(0, Math.min(index, length - 1))]
    if (el) {
      el.focus()
      el.select()
    }
  }

  const popBox = (index) => {
    const box = boxesRef.current[index]
    if (box && !reduceMotion.current)
      box.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.18)', offset: 0.4 }, { transform: 'scale(1)' }],
        { duration: 320, easing: 'ease-out' },
      )
  }

  const submit = async (code) => {
    setStatus('verifying')
    const [ok] = await Promise.all([
      Promise.resolve(onVerify ? onVerify(code) : true).catch(() => false),
      wait(verifyDelayMs),
    ])
    if (ok) {
      setStatus('success')
      return
    }
    setStatus('error')
    if (rowRef.current && !reduceMotion.current)
      rowRef.current.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-12px)' },
          { transform: 'translateX(12px)' },
          { transform: 'translateX(-8px)' },
          { transform: 'translateX(8px)' },
          { transform: 'translateX(-4px)' },
          { transform: 'translateX(0)' },
        ],
        { duration: 400, easing: 'ease-in-out' },
      )
    clearTimerRef.current = setTimeout(
      () => {
        setDigits(Array.from({ length }, () => ''))
        focusInput(0)
      },
      reduceMotion.current ? 60 : 550,
    )
  }

  const setDigitAt = (index, value) => {
    if (status === 'error') setStatus('idle')
    if (value) popBox(index)
    const next = [...digits]
    next[index] = value
    setDigits(next)
    if (value && index < length - 1) focusInput(index + 1)
    if (next.every((d) => d !== '')) submit(next.join(''))
  }

  const handleChange = (index, raw) => {
    setDigitAt(index, raw.replace(/\D/g, '').slice(-1))
  }

  const handleKeyDown = (index, ev) => {
    if (ev.key === 'Backspace') {
      ev.preventDefault()
      if (digits[index]) setDigitAt(index, '')
      else if (index > 0) {
        focusInput(index - 1)
        setDigitAt(index - 1, '')
      }
    } else if (ev.key === 'Delete') {
      setDigitAt(index, '')
    } else if (ev.key === 'ArrowLeft' && index > 0) {
      ev.preventDefault()
      focusInput(index - 1)
    } else if (ev.key === 'ArrowRight' && index < length - 1) {
      ev.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (ev) => {
    ev.preventDefault()
    const text = ev.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text) return
    if (status === 'error') setStatus('idle')
    const next = Array.from({ length }, (_, i) => text[i] || '')
    setDigits(next)
    text.split('').forEach((_, k) => setTimeout(() => popBox(k), k * 60))
    if (next.every((d) => d !== '')) submit(next.join(''))
    else focusInput(text.length)
  }

  const handleResend = () => {
    if (onResend) onResend()
    setSecondsLeft(resendSeconds)
    setDigits(Array.from({ length }, () => ''))
    setStatus('idle')
    focusInput(0)
  }

  const handleButton = () => {
    if (success) {
      if (onContinue) onContinue()
      return
    }
    if (filled === length) submit(digits.join(''))
    else focusInput(digits.findIndex((d) => d === ''))
  }

  const badgeIcon = success ? 'check' : error ? 'alert' : 'lock'

  return (
    <div className={`otp-card${success ? ' is-success' : ''}${error ? ' is-error' : ''}`}>
      <div className="otp-badge-wrap">
        {success && <span className="otp-halo" aria-hidden="true" />}
        <svg className="otp-ring" viewBox="0 0 76 76" aria-hidden="true">
          <circle className="otp-ring-bg" cx="38" cy="38" r={RING_R} />
          <circle
            className="otp-ring-fg"
            cx="38"
            cy="38"
            r={RING_R}
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - progress)}
          />
        </svg>
        <div className="otp-badge">
          <span key={badgeIcon} className="otp-icon-pop">
            <Icon name={badgeIcon} />
          </span>
        </div>
      </div>

      <h3 className="otp-title">{success ? 'Berhasil diverifikasi' : title}</h3>
      <p className="otp-sub">
        {success ? (
          'Akun Anda sudah terverifikasi.'
        ) : (
          <>
            Masukkan kode {length} digit yang kami kirim ke{' '}
            {destination ? <strong>{destination}</strong> : 'Anda'}
          </>
        )}
      </p>

      <div className="otp-row" ref={rowRef} role="group" aria-label={`Kode verifikasi, ${length} digit`}>
        {digits.map((digit, i) => (
          <div
            key={i}
            ref={(el) => {
              boxesRef.current[i] = el
            }}
            className={`otp-box${digit ? ' filled' : ''}`}
            style={{ transitionDelay: success && !reduceMotion.current ? `${i * 70}ms` : '0ms' }}
          >
            <input
              ref={(el) => {
                inputsRef.current[i] = el
              }}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              disabled={status === 'verifying' || success}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={`Digit ${i + 1} dari ${length}`}
              aria-invalid={error || undefined}
            />
          </div>
        ))}
      </div>

      <div className="otp-msg" aria-live="polite">
        {error && (
          <p className="otp-msg-err" role="alert">
            <Icon name="alert" /> Kode tidak cocok. Coba lagi.
          </p>
        )}
        {status === 'verifying' && <p>Memeriksa kode…</p>}
      </div>

      <button type="button" className="otp-btn" onClick={handleButton} disabled={status === 'verifying'}>
        <span className="otp-btn-base">Verifikasi kode</span>
        <span
          className="otp-btn-fill"
          aria-hidden="true"
          style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}
        >
          {status === 'verifying' ? (
            <>
              <span className="otp-spinner" /> Memverifikasi
            </>
          ) : success ? (
            <>
              Lanjut <Icon name="arrow" />
            </>
          ) : (
            'Verifikasi kode'
          )}
        </span>
      </button>

      <p className="otp-resend">
        Tidak menerima kode?{' '}
        {secondsLeft > 0 ? (
          <b>
            <Icon name="refresh" /> Kirim ulang dalam {Math.floor(secondsLeft / 60)}:
            {String(secondsLeft % 60).padStart(2, '0')}
          </b>
        ) : (
          <button type="button" className="otp-resend-btn" onClick={handleResend}>
            <Icon name="refresh" /> Kirim ulang
          </button>
        )}
      </p>
    </div>
  )
}
