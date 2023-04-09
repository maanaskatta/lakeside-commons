import React, { useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { BsPencil, BsTrash } from "react-icons/bs";
import { FaTag, FaUser } from "react-icons/fa";
import AddEditParkingLots from "./AddEditParkingLot";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";
import NoDataText from "../../../components/NoDataText";
import deleteData from "../RouteControllers/deleteData";
import { toast } from "react-toastify";

const ParkingLot = ({ parking, parkingLots, setParkingLots, setIsUpdated }) => {
  console.log("Parking", parking);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const deleteGate = async (data) => {
    setMutationInProgress(true);
    let res = await deleteData("deleteParking", data);
    if (res) {
      toast.success("Parking lot deleted successfully...");
      setParkingLots(
        parkingLots.filter((item) => item.ParkingLotID !== parking.ParkingLotID)
      );
      setMutationInProgress(false);
    } else {
      toast.error("Failed to delete parking lot!...");
      setMutationInProgress(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-3 p-3 border ${
        parking.parkingClass === "VIP"
          ? "bg-red-600 "
          : parking.parkingClass === "Handicapped"
          ? "bg-blue-500  shadow-md"
          : "bg-green-500  shadow-md"
      } rounded text-white`}
    >
      <div className="flex items-center gap-1">
        <BiCategory className="text-xl" />
        <p className="text-base font-medium">{parking.parkingClass}</p>
      </div>

      <div className="flex items-center gap-1">
        <FaUser className="text-base" />
        <p className="text-base font-medium">
          {parking.firstName + " " + parking.lastName}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <FaTag className="text-xl" />
        <p className="font-semibold text-2xl">{parking.parkingTagNumber}</p>
      </div>

      <div className="flex justify-end items-center gap-5">
        <BsPencil
          onClick={() => {
            setIsModalOpen(true);
          }}
          className=" text-white text-xl cursor-pointer"
        />
        <BsTrash
          onClick={() => {
            deleteGate({
              ParkingLotID: parking.ParkingLotID,
            });
          }}
          className={`text-white text-xl cursor-pointer ${
            mutationInProgress ? " animate-spin" : ""
          }`}
        />
      </div>

      {isModalOpen ? (
        <AddEditParkingLots
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          parking={parking}
          setIsUpdated={setIsUpdated}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default function Parking({ label }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parkingLots, setParkingLots] = useState(null);
  const [isUpdated, setIsUpdated] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    getData("getParkings")
      .then((data) => {
        setParkingLots(data);
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
          <p>Add new parking lot</p>
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : parkingLots && parkingLots.length > 0 ? (
        <div className="grid grid-cols-5 gap-3">
          {parkingLots.map((parking) => (
            <ParkingLot
              parking={parking}
              parkingLots={parkingLots}
              setIsUpdated={setIsUpdated}
              setParkingLots={setParkingLots}
            />
          ))}
        </div>
      ) : (
        <NoDataText message={"No parking lots found!.."} />
      )}

      {isModalOpen ? (
        <AddEditParkingLots
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          parking={null}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
