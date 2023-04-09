import React from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal";

const photos = {
  Apartment: [
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/6022f3f6d2cd38.64885900621.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/6022f3f69146f9.75533498254.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://medialibrarycdn.entrata.com/media_library/284/5df4012acea6d2.79399820478.jpg",
    },
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/602426d498a288.09678086299.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://medialibrarycdn.entrata.com/media_library/284/5df4014cd9bc31.06291792217.jpg",
    },
  ],
  Community: [
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/602426d3902b21.31248795200.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/6024268fe81309.74807487242.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/60242690a19403.73232148719.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/602426904f7341.87631344354.jpg&w=2048&h=1535",
    },
  ],
  Recreation: [
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/602426911738b6.53070778768.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/602426915e1e95.14388702316.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/602426d33c7646.29567114422.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://medialibrarycdn.entrata.com/media_library/284/5e3a0a16d75862.48996835350.jpg",
    },
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/602426d4041d45.36247387908.jpg&w=2048&h=1535",
    },
    {
      imageLink:
        "https://commoncdn.entrata.com/images/thumbNailer.php?src=/media_library/284/602427116a9e10.65816669892.jpg&w=2048&h=1535",
    },
  ],
};

const customStyles = {
  content: {
    maxHeight: "80%",
  },
};

export default function AddEditPhotoCategory({
  isModalOpen,
  setIsModalOpen,
  category,
}) {
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
        htmlOpenClassName="overflow-hidden"
        style={customStyles}
        bodyOpenClassName="overflow-hidden"
        className="inset-y-auto inset-x-auto bg-white rounded-md w-1/2 absolute top-0 mt-10 focus:outline-none overflow-auto"
        overlayClassName="transition-all ease-in-out duration-300 flex justify-center items-center bg-opacity-75 bg-black inset-0 fixed p-8"
      >
        <div>
          <header className="rounded-t-md bg-blue-700 w-full py-5 px-12 text-white flex items-center justify-between">
            <div className="text-white">{category.CategoryName}</div>
            <button onClick={() => setIsModalOpen(false)}>
              <MdClose className="w-6 h-6 text-white" />
            </button>
          </header>

          <div className="p-4">
            {photos[category.CategoryName] &&
            photos[category.CategoryName].length > 0 ? (
              <div className="p-3 flex flex-col gap-3">
                {photos[category.CategoryName].map((photo) => {
                  return <img src={photo.imageLink} alt="" />;
                })}
              </div>
            ) : (
              <p>No photos found in this category!...</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
