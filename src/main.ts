import { registerSW } from 'virtual:pwa-register'
import './fonts.css'
import './style.css'
import { GROUPS, tools, type Tool } from './tools'

const FAVORITES_KEY = 'pocket-favorites'

registerSW({ immediate: true })

const searchInput = document.querySelector<HTMLInputElement>('#search')
const clearSearch = document.querySelector<HTMLButtonElement>('#clear-search')
const chips = document.querySelector<HTMLDivElement>('#chips')
const list = document.querySelector<HTMLDivElement>('#list')
const count = document.querySelector<HTMLParagraphElement>('#count')
const empty = document.querySelector<HTMLParagraphElement>('#empty')
const installButton = document.querySelector<HTMLButtonElement>('#install')
const installDialog = document.querySelector<HTMLDialogElement>('#install-dialog')
const installCopy = document.querySelector<HTMLParagraphElement>('#install-copy')
const installClose = document.querySelector<HTMLButtonElement>('#install-close')

if (
  !searchInput ||
  !clearSearch ||
  !chips ||
  !list ||
  !count ||
  !empty ||
  !installButton ||
  !installDialog ||
  !installCopy ||
  !installClose
) {
  throw new Error('Marqueurs de page manquants')
}

const searchField = searchInput
const clearButton = clearSearch
const chipRow = chips
const cardList = list
const countLabel = count
const emptyState = empty
const installBtn = installButton
const installModal = installDialog
const installText = installCopy

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
let query = ''
let group: (typeof GROUPS)[number] = 'Tout'
const favorites = readFavorites()

const isIos =
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone))

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((item) => typeof item === 'string'))
  } catch {
    return new Set()
  }
}

function writeFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]))
  } catch {
    /* mode privé : l’étoile reste visuelle pour la session */
  }
}

function matches(tool: Tool) {
  const inGroup =
    group === 'Tout' ||
    tool.groups.includes(group) ||
    (group === '18+' && tool.adult === true)
  if (!inGroup) return false
  const haystack = `${tool.name} ${tool.summary} ${tool.groups.join(' ')} ${tool.host}`
    .toLocaleLowerCase('fr')
  return haystack.includes(query.trim().toLocaleLowerCase('fr'))
}

function renderChips() {
  chipRow.replaceChildren(
    ...GROUPS.map((name) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'chip'
      button.textContent = name
      button.setAttribute('aria-pressed', String(name === group))
      button.addEventListener('click', () => {
        group = name
        render()
      })
      return button
    }),
  )
}

function renderCard(tool: Tool, index: number) {
  const article = document.createElement('article')
  article.className = 'card'
  article.style.setProperty('--delay', `${Math.min(index, 5) * 70}ms`)
  if (favorites.has(tool.id)) article.classList.add('is-pinned')

  const mark = document.createElement('span')
  mark.className = 'mark'
  mark.textContent = tool.mark
  mark.style.color = tool.tint
  mark.style.background = hexToRgba(tool.tint, 0.16)

  const body = document.createElement('div')
  body.className = 'card-body'

  const top = document.createElement('div')
  top.className = 'card-top'

  const meta = document.createElement('p')
  meta.className = 'meta'
  meta.textContent = `${String(index + 1).padStart(2, '0')}  ·  ${[...tool.groups, tool.host].join(' · ')}`

  const star = document.createElement('button')
  star.type = 'button'
  star.className = 'star'
  const pinned = favorites.has(tool.id)
  star.setAttribute('aria-pressed', String(pinned))
  star.setAttribute(
    'aria-label',
    pinned ? `Retirer ${tool.name} des favoris` : `Épingler ${tool.name}`,
  )
  star.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4l2.35 5.05 5.55.67-4.12 3.78 1.12 5.5L12 15.9l-4.9 2.5 1.12-5.5L4.1 9.12l5.55-.67L12 3.4z"/></svg>'
  star.addEventListener('click', () => {
    if (favorites.has(tool.id)) favorites.delete(tool.id)
    else favorites.add(tool.id)
    writeFavorites()
    render()
  })

  top.append(meta, star)

  const titleRow = document.createElement('div')
  titleRow.className = 'title-row'

  const title = document.createElement('h2')
  title.textContent = tool.name
  titleRow.append(title)

  if (tool.adult) {
    const badge = document.createElement('span')
    badge.className = 'adult'
    badge.textContent = '18+'
    titleRow.append(badge)
  }

  const summary = document.createElement('p')
  summary.className = 'summary'
  summary.textContent = tool.summary

  const actions = document.createElement('div')
  actions.className = 'actions'

  const open = document.createElement('a')
  open.className = 'open'
  open.href = tool.url
  open.target = '_blank'
  open.rel = 'noopener noreferrer'
  open.textContent = 'Ouvrir'

  const code = document.createElement('a')
  code.className = 'code'
  code.href = tool.repo
  code.target = '_blank'
  code.rel = 'noopener noreferrer'
  code.textContent = 'Code'

  actions.append(open, code)
  body.append(top, titleRow, summary, actions)
  article.append(mark, body)
  return article
}

function render() {
  renderChips()
  const visible = tools
    .filter(matches)
    .sort((a, b) => Number(favorites.has(b.id)) - Number(favorites.has(a.id)))

  cardList.replaceChildren(...visible.map(renderCard))
  countLabel.textContent =
    visible.length === 0
      ? 'Aucune app'
      : `${visible.length} ${visible.length > 1 ? 'apps' : 'app'}`
  emptyState.hidden = visible.length > 0
  clearButton.hidden = query.length === 0
  revealCards()
}

let revealObserver: IntersectionObserver | null = null

function revealCards() {
  const cards = [...cardList.querySelectorAll<HTMLElement>('.card')]
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('is-in'))
    return
  }

  revealObserver?.disconnect()
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        revealObserver?.unobserve(entry.target)
      }
    },
    { threshold: 0.22, rootMargin: '0px 0px -6% 0px' },
  )
  cards.forEach((card) => revealObserver?.observe(card))
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '')
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

searchField.addEventListener('input', () => {
  query = searchField.value
  render()
})

clearButton.addEventListener('click', () => {
  query = ''
  searchField.value = ''
  searchField.focus()
  render()
})

window.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== searchField) {
    event.preventDefault()
    searchField.focus()
  }
  if (event.key === 'Escape' && installModal.open) {
    installModal.close()
  }
})

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
})

if (isStandalone) {
  installBtn.hidden = true
}

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    deferredPrompt = null
    return
  }

  installText.textContent = isIos
    ? 'Dans Safari : Partager, puis Sur l’écran d’accueil.'
    : 'Ouvre le menu du navigateur, puis choisis Installer l’application.'
  installModal.showModal()
})

installClose.addEventListener('click', () => {
  installModal.close()
})

render()
