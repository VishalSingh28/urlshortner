import React, { useState } from 'react'
import axios, { AxiosResponse, AxiosError } from 'axios'
import './App.css'

function App() {
  const [url, setUrl] = useState<string>('')
  const [shortenUrl, setShortenUrl] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [disableButton, setDisableButton] = useState<boolean>(false)
  const [copiedText, setCopiedText] = useState<string>('')
  const [listURL, setListURL] = useState<any[]>([]);
  const [listURLShow, setListURLShow] = useState<boolean>(false);


  const validateUrl = (text: string): boolean => {
    let url
    try {
      url = new URL(text)
    } catch (_) {
      return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
  }

  const handleShorten = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    if (url.trim() && validateUrl(url)) {
      setError('')
      setShortenUrl('')
      setLoading(true)
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/`, { url })
        .then((response: AxiosResponse) => {
          if (response?.data?.success) {
            setShortenUrl(response?.data?.data?.url)
            setDisableButton(true)
          }
          setLoading(false)
        })
        .catch((error: AxiosError) => {
          setLoading(false)
          setError(error?.response?.data?.error?.message)
        })
    } else {
      setError('Please enter a valid URL!')
    }
  }

  const handleList = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}`)
      .then((response: AxiosResponse) => {
        console.log(response.data);
        if (response?.status == 200) {
          console.log("loop enter");
          setListURL(response.data);
          setListURLShow(true)
          // setShortenUrl(response?.data?.data?.url)
          // setDisableButton(true)
        }
        setLoading(false)
      })
      .catch((error: AxiosError) => {
        console.log(error)
        setLoading(false)
        setError(error?.response?.data?.error?.message)
      })
    console.log("Array list", listURL)

  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value)
    setShortenUrl('')
    setDisableButton(false)
    setCopiedText('')
  }

  const handleCopy = (): void => {
    navigator.clipboard.writeText(shortenUrl).then(() => {
      setCopiedText(shortenUrl)
    })
  }

  return (
    <div>
      <div className="content-wrapper">
        <h1 className="page-title">Vishal URL Shortener</h1>
        <p className="page-description">
          Application built with NodeJs,
          MongoDB, ReactJs, TypeScript, and Docker.
        </p>
        <div className="form-wrapper">
          <div className="input-wrapper">
            <input
              onChange={handleChangeInput}
              value={url}
              placeholder="https://..."
            />
            {error && <p className="error">{error}</p>}
          </div>
          <button disabled={loading || disableButton} onClick={handleShorten}>
            {loading ? 'Load...' : 'Shorten'}
          </button>
          <button disabled={loading || disableButton} onClick={handleList}>
            {loading ? 'Load...' : 'List'}
          </button>
        </div>
        {shortenUrl && (
          <>
            <h3 className="result-title">Your Shorten URL:</h3>
            <div className="result-link-wrapper">
              <a
                target="_blank"
                rel="noreferrer"
                className="shorten-url"
                href={shortenUrl}
              >
                {shortenUrl}
              </a>
              <button onClick={handleCopy} className="copy-button">
                {copiedText === shortenUrl ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </>
        )}
        {listURLShow && (
          <>
            <table >
              <thead>
                <tr>
                  <th>Original Url</th>
                  <th>Shorten Url</th>
                  <th>Count</th>
                  <th>Updated</th>

                </tr>
              </thead>
              <tbody>
                {listURL &&
                  listURL.map((crud) => {
                    return (
                      <tr key={crud._id}>
                        <td>{crud.orginalUrl}</td>
                        <td>{process.env.REACT_APP_API_BASE_URL}/{crud.shortenId}</td>
                        <td>{crud.viewCount}</td>
                        <td>{crud.updatedAt.slice(0,10)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </>
        )}

      </div>
      <a
        className="vishal"
        href="https://www.linkedin.com/in/vishal-singh-6b792b112/"
        target="_blank"
        rel="noreferrer"
      >
        Made by Vishal singh for Lowes
      </a>
    </div>
  )
}

export default App
