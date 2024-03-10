import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

// const readFileAsDataURL = (file) =>
//   new Promise((resolve) => {
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       resolve(event.target.result);
//     };

//     reader.readAsDataURL(file);
//   });

const resizeImage = (imageURL, canvas, maxHeight) =>
  new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const context = canvas.getContext("2d");

      if (image.height > maxHeight) {
        image.width *= maxHeight / image.height;
        image.height = maxHeight;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = image.width;
      canvas.height = image.height;

      context.drawImage(image, 0, 0, image.width, image.height);

      resolve(canvas.toDataURL("image/jpeg"));
    };

    image.src = imageURL;
  });

const ImageInput = ({ className, name, maxHeight }) => {
  const [value, setValue] = useState("");
  const canvasRef = useRef();
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match(/^image\//)) {
      const originalURL = URL.createObjectURL(file);
  
      resizeImage(originalURL, canvasRef.current, maxHeight).then((url) => {
        setValue(url);
      });
    } else {
      setValue("");
      // Provide user feedback for invalid file type if needed
    }
  };
  

  const handleFormReset = () => {
    setValue("");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const fileInputForm = fileInputRef.current.form;
    fileInputForm.addEventListener("reset", handleFormReset);

    return () => {
      fileInputForm.removeEventListener("reset", handleFormReset);
    };
  }, []);

  const style = {
    position: "relative",
    ...(value && {
      backgroundImage: `url("${value}")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
    }),
  };

  return (
    <div className={className} style={style}>
      <input type="hidden" name={name} value={value} />
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
        }}
        required
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

ImageInput.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  maxHeight: PropTypes.number,
};

ImageInput.defaultProps = {
  className: "",
  name: "image",
  maxHeight: 300,
};

export default ImageInput;
