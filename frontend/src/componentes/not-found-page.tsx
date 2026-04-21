const NotFoundPage = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-6 py-12 text-[#444]'>
      <div className='mb-6 text-center text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl'>
        ERR_NAME_NOT_RESOLVED
      </div>
      <div className='mb-6 max-w-xl text-center text-xl sm:text-2xl md:text-3xl'>This site can't be reached</div>
      <div className='max-w-md text-center text-base leading-relaxed sm:text-lg'>
        <p className='mb-3'>Check if the web address is correct.</p>
        <p>Try refreshing the page or come back later.</p>
      </div>
    </div>
  )
}

export default NotFoundPage
