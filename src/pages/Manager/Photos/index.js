import React, { useEffect, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { MdAddCircleOutline, MdOutlineCategory } from "react-icons/md";
import AddEditPhotoCategory from "./AddEditPhotoCategory";
import ViewPhotosModal from "./ViewPhotosModal";

import { AiOutlineEye } from "react-icons/ai";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";
import NoDataText from "../../../components/NoDataText";
import deleteData from "../RouteControllers/deleteData";
import { toast } from "react-toastify";

const Category = ({ category, categories, setCategory, setIsUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewPhotoModalOpen, setIsViewPhotoModalOpen] = useState(false);
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const deleteCategory = async (data) => {
    setMutationInProgress(true);
    let res = await deleteData("deletePhotoCategory", data);
    if (res) {
      toast.success("Category deleted successfully...");
      setCategory(
        categories.filter((item) => item.categoryID !== category.categoryID)
      );
      setMutationInProgress(false);
    } else {
      toast.error("Failed to delete Category!...");
      setMutationInProgress(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 border bg-blue-100 rounded shadow-md">
      <div className="flex items-center gap-1">
        <MdOutlineCategory className="text-xl" />
        <p className="text-base">{category.CategoryName}</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <AiOutlineEye
            onClick={() => {
              setIsViewPhotoModalOpen(true);
            }}
            className=" text-indigo-600 text-xl cursor-pointer"
          />
        </div>
        <div className="flex justify-between items-center gap-5">
          <BsPencil
            onClick={() => {
              setIsModalOpen(true);
            }}
            className=" text-blue-900 text-xl cursor-pointer"
          />
          <BsTrash
            onClick={() => {
              deleteCategory({
                categoryID: category.categoryID,
              });
            }}
            className={`text-red-500 text-xl cursor-pointer ${
              mutationInProgress ? " animate-spin" : ""
            }`}
          />
        </div>
      </div>

      {isViewPhotoModalOpen ? (
        <ViewPhotosModal
          isModalOpen={isViewPhotoModalOpen}
          setIsModalOpen={setIsViewPhotoModalOpen}
          category={category}
        />
      ) : (
        <></>
      )}

      {isModalOpen ? (
        <AddEditPhotoCategory
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          category={category}
          setIsUpdated={setIsUpdated}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default function Photos({ label }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategory] = useState(null);
  const [isUpdated, setIsUpdated] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getData("getPhotoCategories")
      .then((data) => {
        setCategory(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isModalOpen, isUpdated]);

  return (
    <div className="flex p-8 flex-col gap-10 w-full">
      <div className="flex w-full items-center justify-between">
        <p className="text-2xl font-semibold">{label}</p>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1 px-3 py-2 bg-blue-900 text-white text-base rounded"
        >
          <MdAddCircleOutline />
          <p>Add new photo category</p>
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-5 gap-3">
          {categories.map((category) => (
            <Category
              category={category}
              categories={categories}
              setCategory={setCategory}
              setIsUpdated={setIsUpdated}
            />
          ))}
        </div>
      ) : (
        <NoDataText message="No photo categories found!..." />
      )}

      {isModalOpen ? (
        <AddEditPhotoCategory
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          category={null}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
