const NotFoundPage = () => {
  return (
    <div className='not-found-page'>
      <div className='error-code'>ERR_NAME_NOT_RESOLVED</div>
      <div className='error-message'>This site can't be reached</div>
      <div className='suggestion'>
        <p>Check if the web address is correct.</p>
        <p>Try refreshing the page or come back later.</p>
      </div>
    </div>
  )
}

export default NotFoundPage
