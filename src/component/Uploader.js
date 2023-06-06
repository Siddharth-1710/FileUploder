import React, { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { MdCloudUpload } from 'react-icons/md';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import './Uploader.css';

function Uploader() {
  const [fileUpload, setFileUpload] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileList, setFileList] = useState([]);

  const fileListRef = ref(storage, 'files/');

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileExtension = file.name.split('.').pop();
      const allowedExtensions = ['pdf', 'doc'];

      if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        setFileUpload(file);
        setErrorMessage('');
      } else {
        event.target.value = null;
        setFileUpload(null);
        setErrorMessage('Invalid file format. Please upload only PDF or DOC files.');
      }
    }
  };

  const uploadFile = () => {
    if (fileUpload === null) return;

    const fileName = fileUpload.name + uuidv4();
    const fileRef = ref(storage, `files/${fileName}`);
    uploadBytes(fileRef, fileUpload).then(() => {
      alert('File uploaded successfully');
      setFileUpload(null);
    });
  };

  const handleRemoveFile = () => {
    setFileUpload(null);
    setErrorMessage('');
  };

  useEffect(() => {
    listAll(fileListRef)
      .then((response) => {
        const promises = response.items.map((item) => {
          return getDownloadURL(item).then((url) => {
            return { url, name: item.name };
          });
        });
        Promise.all(promises)
          .then((result) => {
            setFileList(result);
          })
          .catch((error) => {
            console.error('Error getting download URLs:', error);
          });
      })
      .catch((error) => {
        console.error('Error listing files:', error);
      });
  }, []);

  return (
    <main>
      <div className="file-uploader">
        <label className="file-uploader__label">
          <input
            type="file"
            accept=".pdf,.doc"
            className="file-uploader__input"
            onChange={handleFileChange}
          />
          <span className="file-uploader__icon">
          <MdCloudUpload />
          </span>
          <span className="file-uploader__text">{fileUpload ? fileUpload.name : 'Choose a file'}</span>
        </label>
        {errorMessage && (
          <div className="file-uploader__error">
            <p>{errorMessage}</p>
            <button className="file-uploader__remove-btn" onClick={handleRemoveFile}>
              Remove File
            </button>
          </div>
        )}
        <button className="file-uploader__upload-btn" onClick={uploadFile}>
          Upload
        </button>
      </div>

      {fileList.length > 0 && (
        <div className="file-uploader__file-list">
          <h3>Uploaded Files:</h3>
          <table className="file-uploader__table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {fileList.map((file) => (
                <tr key={file.url}>
                  <td>{file.name}</td>
                  <td>
                    <a href={file.url} download={file.name}>
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Uploader;
