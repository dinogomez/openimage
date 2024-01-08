// @ts-nocheck
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { TrashIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Toaster, toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { formatBytes, timeConvert } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";

const Dropzone = ({ className }) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [totalSizeCompressed, setTotalSizeCompressed] = useState(0);
  const [submit, setSubmit] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) => {
          return { file, preview: URL.createObjectURL(file) };
        }),
      ]);

      setTotalSize(
        (prevSize) =>
          prevSize + acceptedFiles.reduce((size, file) => size + file.size, 0)
      );
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const compressFile = async (file) => {
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const { size } = await pdfDoc.save();
      return new File([pdfDoc], file.name, {
        type: "application/pdf",
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("PDF compression failed:", error);
      throw error;
    }
  };

  const compressAll = async () => {
    let totalCompressedSize = 0;
    const toastId = toast("Sonner");
    const startTime = performance.now();

    toast.loading(`Compressing ${files.length} PDFs.`, {
      id: toastId,
    });

    const compressedFilesArray = await Promise.all(
      files.map(async (fileData) => {
        try {
          const compressedFile = await compressFile(fileData.file);

          totalCompressedSize += compressedFile.size; // Update the total compressed size
          return { compressedFile, preview: fileData.preview };
        } catch (error) {
          console.error("PDF compression failed:", error);
          return { originalFile: fileData.file, preview: null };
        }
      })
    );

    setCompressedFiles((prevFiles) => [...prevFiles, ...compressedFilesArray]);
    setTotalSizeCompressed(totalCompressedSize);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    toast.success(
      `Compressed ${files.length} PDFs  ${timeConvert(elapsedTime)}`,
      {
        id: toastId,
      }
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
    maxSize: 3840 * 2160,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeCompressedFile = (name) => {
    setCompressedFiles((files) => files.filter((file) => file.name !== name));
  };

  const percentageReduction =
    ((totalSize - totalSizeCompressed) / totalSize) * 100;

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
    setCompressedFiles([]); // Clear compressed files
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  const downloadAllCompressed = () => {
    // Clear existing compressed files

    const zip = new JSZip();

    compressedFiles.forEach(({ compressedFile, compressedDataURL }) => {
      if (compressedDataURL) {
        const blob = dataURLtoBlob(compressedDataURL);
        zip.file(compressedFile.name, blob);
      }
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "openimage-compressed.zip");
    });
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files?.length) {
      return;
    }

    setSubmit("");

    if (!executeRecaptcha) {
      console.log("not available to execute recaptcha");
      return;
    }

    const gRecaptchaToken = await executeRecaptcha("inquirySubmit");

    ///

    const response = await axios({
      method: "post",
      url: "/api/recaptchaSubmit",
      data: {
        gRecaptchaToken,
      },
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    if (response?.data?.success === true) {
      console.log(`Success with score: ${response?.data?.score}`);
      await compressAll();
      await increment(files.length, totalSizeCompressed, totalSize, 1);
    } else {
      console.log(`Failure with score: ${response?.data?.score}`);
      setSubmit("Failed to verify recaptcha! You must be a robot!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="scrollbar-gutter-stable">
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <Upload className="w-5 h-5 " />
          {isDragActive ? (
            <p>Drop the images here ...</p>
          ) : (
            <p>drag & drop images here, or click to select images 🖼️</p>
          )}
          <p>3840 x 2160 4K</p>
        </div>
      </div>

      {/* Preview */}
      <section className="mt-10">
        <div className="flex gap-4 items-center pb-3">
          <Button
            variant="outline"
            type="submit"
            className="px-7 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
            onClick={() => {
              if (!files?.length) {
                toast.warning("Something went wrong 🤔", {
                  description: "You dont have any images to compress.",
                });
              }
            }}
          >
            Compress
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              removeAll();
              if (!files?.length) {
                toast.error("Oops 🤔", {
                  description: "You dont have any images to remove.",
                });
              }
            }}
            variant="outline"
            className="ml-auto px-6 border-red-500 text-red-500 hover:bg-red-600 hover:text-white"
          >
            Remove All
          </Button>

          {/* CAPTCHA */}
          {/* {submit && <p className="text-lg text-center">{submit}</p>} */}
        </div>

        {/* Accepted files */}
        <h3 className="mt-5 title text-lg font-semibold text-gray-600 border-b">
          🗂️ accepted files ({files.length})
          <p className="text-sm text-gray-400">
            Total Size: {formatBytes(totalSize)}
          </p>
        </h3>
        <div className="overflow-auto max-h-[350px] w-full px-10">
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
            {files.map((file) => (
              <li
                key={file.name}
                className="relative h-32 rounded-md shadow-lg mt-1"
              >
                <Image
                  src={file.preview}
                  alt={file.name}
                  width={100}
                  height={100}
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                  className="h-full w-full rounded-md object-contain"
                />
                <button
                  type="button"
                  className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-red-500 bg-red-500 transition-colors hover:bg-white"
                  onClick={() => removeFile(file.name)}
                >
                  <X className="h-5 w-5 fill-white transition-colors hover:fill-red-500" />
                </button>
                <p className="mt-2 text-[12px] font-medium text-stone-500 text-ellipsis overflow-hidden">
                  {file.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* Compressed Files */}
        <div className="flex border-b  mt-10 ">
          <div>
            <h3 className="title text-lg font-semibold text-gray-600  ">
              🗃️ compressed files ({compressedFiles.length})
              <p className="text-sm text-gray-400">
                Total Size: {formatBytes(totalSizeCompressed)}
                {percentageReduction > 0 &&
                  !isNaN(percentageReduction) &&
                  totalSizeCompressed !== 0 && (
                    <>, {percentageReduction.toFixed(2)}% Reduction.</>
                  )}
              </p>
            </h3>
          </div>
          <div className="ml-auto">
            <Button
              className="ml-auto border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                const startTime = performance.now();

                if (compressedFiles.length == 0) {
                  toast.warning("Something went wrong 🤔", {
                    description: "You dont have any images to download.",
                  });
                  return;
                }
                const toastId = toast("zip");

                toast.loading(`Zipping ${files.length} images.`, {
                  id: toastId,
                });
                downloadAllCompressed();
                const endTime = performance.now();
                const elapsedTime = endTime - startTime;

                toast.dismiss();

                toast.success(
                  `Zipped ${files.length} images  ${timeConvert(elapsedTime)} `,
                  {
                    id: toastId,
                  }
                );
              }}
            >
              Download All
            </Button>
          </div>
        </div>
        <div className="overflow-auto max-h-[350px] w-full px-10">
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
            {compressedFiles.map((fileData) => (
              <div>
                <li
                  key={fileData.compressedFile.name}
                  className="relative h-32 rounded-md shadow-lg mt-1"
                >
                  <Image
                    src={
                      fileData.compressedDataURL ||
                      fileData.originalFile.preview
                    }
                    alt={fileData.compressedFile.name}
                    width={100}
                    height={100}
                    className="h-full w-full object-contain rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-red-500 bg-red-500 transition-colors hover:bg-white"
                    onClick={() => removeCompressedFile(fileData.name)}
                  >
                    <X className="h-5 w-5 fill-white transition-colors hover:fill-red-500" />
                  </button>
                  <p className="mt-2 text-[12px] font-medium text-stone-500 text-ellipsis overflow-hidden">
                    {fileData.compressedFile.name}
                  </p>
                </li>
              </div>
            ))}
          </ul>
        </div>

        {/* Rejected Files */}
        {rejected.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center my-6">
              <h3 className="title text-lg font-semibold text-gray-600  ">
                🗑️ rejected files ({rejected.length})
              </h3>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setRejected([]);

                  if (!files?.length) {
                    toast.error("Oops 🤔", {
                      description: "You dont have any images to remove.",
                    });
                  }
                }}
                variant="outline"
                className="ml-auto px-8 border-red-500 text-red-500 hover:bg-red-600 hover:text-white "
              >
                <TrashIcon className="w-3 h-3  mr-3" />
                Clear
              </Button>
            </div>
            <div className="border-b"></div>

            <div className="overflow-auto  w-full ">
              <ul className="mt-3 flex flex-col mb-10 max-h-[200px] px-10">
                {rejected.map(({ file, errors }) => (
                  <li
                    key={file.name}
                    className="flex items-start justify-between"
                  >
                    <div>
                      <p className="mt-2 text-gray-500 text-sm font-medium">
                        {file.name}
                      </p>
                      <ul className="text-[12px] text-red-400">
                        {errors.map((error) => (
                          <li key={error.code}>{error.message}</li>
                        ))}
                      </ul>
                    </div>
                    {/* <Button
                      variant=""
                      className="ml-auto px-6  bg-red-500 text-white hover:bg-red-600 p-3"
                      onClick={() => removeRejected(file.name)}
                    >
                      <X className="w-3 h-3  fill-current" />
                    </Button> */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
      <Toaster richColors expand={true} duration={8500} />
    </form>
  );
};

export default Dropzone;
