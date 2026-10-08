import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { profile, welcomeConversation, type ConversationTopic } from '../data'
import { useDialogFocus } from '../hooks/useDialogFocus'

type Props = {
  onClose: () => void
}

type DialogueState =
  | { stage: 'greeting' }
  | { stage: 'topics' }
  | { stage: 'reply'; topicId: ConversationTopic['id']; page: number }

const poses = {
  greeting: {
    file: 'justine-pixel-dialogue-sprite.webp',
    alt: 'Pixel art of Justine waving hello',
  },
  thinking: {
    file: 'justine-pixel-dialogue-thinking.webp',
    alt: 'Pixel art of Justine thinking with a hand at his chin',
  },
  speaking: {
    file: 'justine-pixel-dialogue-speaking.webp',
    alt: 'Pixel art of Justine speaking with one hand raised',
  },
  inviting: {
    file: 'justine-pixel-dialogue-inviting.webp',
    alt: 'Pixel art of Justine inviting visitors to explore',
  },
}

export default function Welcome({ onClose }: Props) {
  const [dialogue, setDialogue] = useState<DialogueState>({ stage: 'greeting' })
  const dialogRef = useRef<HTMLElement>(null)
  useDialogFocus(dialogRef)
  const topic =
    dialogue.stage === 'reply'
      ? welcomeConversation.topics.find((item) => item.id === dialogue.topicId)
      : undefined
  const isLastReply =
    dialogue.stage === 'reply' && topic !== undefined && dialogue.page === topic.replies.length - 1
  const pose =
    dialogue.stage === 'greeting'
      ? poses.greeting
      : dialogue.stage === 'topics'
        ? poses.thinking
        : isLastReply
          ? poses.inviting
          : poses.speaking
  const line =
    dialogue.stage === 'greeting'
      ? welcomeConversation.greeting
      : dialogue.stage === 'topics'
        ? welcomeConversation.invitation
        : topic?.replies[dialogue.page]

  useEffect(() => {
    Object.values(poses).forEach(({ file }) => {
      const image = new Image()
      image.src = `${import.meta.env.BASE_URL}photos/${file}`
    })
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    const focusTarget = dialog?.querySelector<HTMLElement>('[data-primary-action]') ?? dialog
    focusTarget?.focus({ preventScroll: true })
  }, [dialogue])

  const showTopics = () => setDialogue({ stage: 'topics' })

  const advanceDialogue = () => {
    if (dialogue.stage === 'greeting' || isLastReply) showTopics()
    else if (dialogue.stage === 'reply') setDialogue({ ...dialogue, page: dialogue.page + 1 })
  }

  const advanceOnBackgroundClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('button, a')) return
    advanceDialogue()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target === event.currentTarget) {
      event.preventDefault()
      advanceDialogue()
      return
    }
  }

  return (
    <div
      className="room-dialogue-overlay"
      data-stage={dialogue.stage}
      role="presentation"
      onClick={advanceOnBackgroundClick}
    >
      <img
        className="room-dialogue-character"
        key={pose.file}
        src={`${import.meta.env.BASE_URL}photos/${pose.file}`}
        alt={pose.alt}
      />
      <section
        className="room-game-dialogue"
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-dialogue-speaker"
        aria-describedby="room-dialogue-line"
        onKeyDown={handleKeyDown}
      >
        <div className="room-dialogue-header">
          <h1 id="room-dialogue-speaker">{profile.name}</h1>
          <button
            className="room-dialogue-close"
            type="button"
            onClick={onClose}
            aria-label="Close conversation"
          >
            ×
          </button>
        </div>

        <div className="room-dialogue-content">
          <p
            id="room-dialogue-line"
            className="room-dialogue-line"
            key={`${dialogue.stage}-${topic?.id}-${dialogue.stage === 'reply' ? dialogue.page : 0}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {line}
          </p>

          {dialogue.stage === 'topics' && (
            <div className="room-dialogue-topics" aria-label="Conversation topics">
              {welcomeConversation.topics.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  data-primary-action={index === 0 ? true : undefined}
                  onClick={() => setDialogue({ stage: 'reply', topicId: item.id, page: 0 })}
                >
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  {item.question}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
