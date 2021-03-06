import React, { useMemo, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./imgDrops.scss";
import Spinner from "./Spinner";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "1rem auto",
  width: "300px",
  height: "300px",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out"
};

const activeStyle = {
  borderColor: "#2196f3"
};

const acceptStyle = {
  borderColor: "#00e676"
};

const rejectStyle = {
  borderColor: "#ff1744"
};

const imageMaxSize = 100000; // Maximum file size (in bytes)

const ImgDrop = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isToBig, setisToBig] = useState(false);

  const handleDrop = useCallback((acceptedFiles, rejectedFiles) => {
    //validation to send only img files
    //call function to upload image
    // spinner indicating uploading
    if (acceptedFiles.length > 0) {
      setIsLoading(true);
      console.log("Acepted", acceptedFiles);
      //
      //const req = request.post('/upload')
      // acceptedFiles.forEach(file => {
      // req.attach(file.name, file);
      // });
      //
      //
      //after image is uploaded display success icon for 5 seconds (get response from api)

      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

      wait(5000)
        .then(() => {
          setIsLoading(false);
        })
        .then(() => setSuccess(true))
        .then(() =>
          setTimeout(() => {
            setSuccess(false);
          }, 5000)
        )
        .catch("error");
    } else {
      const rejectedFile = rejectedFiles[0];
      const rejectedFileType = rejectedFile.type;
      const rejectedFileSize = rejectedFile.size;
      if (rejectedFileSize > imageMaxSize) {
        setisToBig(true);
        setTimeout(() => {
          setisToBig(false);
        }, 3000);
        // return;
      }
      setIsRejected(true);
      setTimeout(() => {
        setIsRejected(false);
      }, 3000);
      console.log("Rejected", rejectedFiles);
    }

    // if error display error message
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/*",
    multiple: false,
    maxSize: imageMaxSize,
    onDrop: handleDrop,
    disabled: isLoading || success
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );

  return (
    <div className="container">
      <div
        {...getRootProps({
          className: `dropzone ${isDragActive ? "active" : ""} ${
            isDragAccept ? "accept" : ""
          } ${isDragReject ? "reject" : ""}`
        })}
      >
        <input {...getInputProps()} />

        {!isLoading && !success && !isRejected && !isDragReject && !isToBig ? (
          <p>Drag 'n' drop some files here, or click to select files</p>
        ) : (
          ""
        )}
        {isLoading && <Spinner />}
        {success && <p>This image was uploaded</p>}
        {!isToBig && (isRejected || isDragReject) && (
          <p>This type of file is not supported</p>
        )}
        {isToBig && <p>This file is to big</p>}
      </div>
    </div>
  );
};

export default ImgDrop;
