import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

const resizeImage = (imageURL, canvas, maxHeight, targetFileSize) =>
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

      let quality = 0.1; // Start with a low quality
      let dataURL;
      let previousDataURL;
     
      do {
        previousDataURL = dataURL;

        dataURL = canvas.toDataURL("image/jpeg", quality);
        if (dataURL.length > targetFileSize) {
          quality -= 0.01; // Decrease the quality by a smaller step size
        } else {
          quality += 0.01; // Increase the quality by a smaller step size
        }
      } while (
        (dataURL.length < targetFileSize && quality <= 1) ||
        (dataURL.length > targetFileSize && quality >= 0.1)
      );

      // If the file size is still not within the target range,
      // use the closest data URL to the target size
      if (dataURL.length > targetFileSize) {
        dataURL = previousDataURL;
      }

      resolve(dataURL);
    };

    image.src = imageURL;
  });
  // Resize function ends here

const ImageInput = ({ className, name, maxHeight }) => {
  const [value, setValue] = useState("");
  const canvasRef = useRef();
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match(/^image\//)) {
      const originalURL = URL.createObjectURL(file);
      const targetFileSize = 300 * 1024; // 300kb converted to bytes

      resizeImage(originalURL, canvasRef.current, maxHeight, targetFileSize).then((url) => {
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
        // required
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

// Image input function ends here

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