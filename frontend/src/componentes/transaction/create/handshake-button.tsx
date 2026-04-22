import React from 'react'

type HandshakeButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
}

export const HandshakeButton: React.FC<HandshakeButtonProps> = ({
  onClick,
  children,
}) => (
  <button
    type='button'
    className='group bg-primary-container text-on-primary-container font-h3 text-h3 hover:opacity-90 custom-shadow flex h-14 w-full items-center justify-center gap-2 rounded-xl transition-opacity'
    onClick={onClick}
  >
    <span className='material-symbols-outlined text-3xl transition-transform group-hover:scale-110'>
      handshake
    </span>
    {children}
  </button>
)
