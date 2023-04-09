import React, { useEffect, useState } from "react";
import { MdAddCircleOutline, MdOutlineAccountTree } from "react-icons/md";
import { BsPencil, BsTrash } from "react-icons/bs";
import AddEditCommunityAmenity from "./AddEditCommunityAmenity";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";
import NoDataText from "../../../components/NoDataText";
import deleteData from "../RouteControllers/deleteData";
import { toast } from "react-toastify";
// import AddEditAccessGate from "./AddEditAccessGate";

const Amenity = ({ amenity, amenities, setAmenities, setIsUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const deleteAmenity = async (data) => {
    setMutationInProgress(true);
    let res = await deleteData("deleteCommunityAmenity", data);
    if (res) {
      toast.success("Amenity deleted successfully...");
      setAmenities(
        amenities.filter((item) => item.CommAmenityID !== amenity.CommAmenityID)
      );
      setMutationInProgress(false);
    } else {
      toast.error("Failed to delete amenity!...");
      setMutationInProgress(false);
    }
  };

  return (
    <div className="flex flex-col justify-between gap-3 p-3 border bg-blue-200 rounded shadow-md">
      <div className="flex items-center gap-1">
        <MdOutlineAccountTree className="text-xl" />
        <p className="text-base">{amenity.AmenityName}</p>
      </div>

      <div className="flex justify-end items-center gap-5">
        <BsPencil
          onClick={() => {
            setIsModalOpen(true);
          }}
          className=" text-blue-900 text-xl cursor-pointer"
        />
        <BsTrash
          onClick={() => {
            deleteAmenity({
              CommAmenityID: amenity.CommAmenityID,
            });
          }}
          className={`text-red-600 text-xl cursor-pointer ${
            mutationInProgress ? " animate-spin" : ""
          }`}
        />
      </div>

      {isModalOpen ? (
        <AddEditCommunityAmenity
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          amenity={amenity}
          setIsUpdated={setIsUpdated}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default function CommunityAmenities({ label }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amenities, setAmenities] = useState(null);
  const [isUpdated, setIsUpdated] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    getData("getCommunityAmenities")
      .then((data) => {
        setAmenities(data);
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
          <p>Add new amenity</p>
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : amenities && amenities.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {amenities.map((amenity) => (
            <Amenity
              amenity={amenity}
              amenities={amenities}
              setAmenities={setAmenities}
              setIsUpdated={setIsUpdated}
            />
          ))}
        </div>
      ) : (
        <NoDataText message={"No community amenities found!..."} />
      )}

      {isModalOpen ? (
        <AddEditCommunityAmenity
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          amenity={null}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
