import React, { useState, useEffect } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import AddEditUnits from "./AddEditUnits";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";
import { toast } from "react-toastify";
import deleteData from "../RouteControllers/deleteData";

const Unit = ({ unit, units, setUnits, setIsUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const deleteUnit = async (data) => {
    setMutationInProgress(true);
    let res = await deleteData("deleteUnit", data);
    if (res) {
      toast.success("Unit deleted successfully...");
      setUnits(units.filter((item) => item.UnitID !== unit.UnitID));
      setMutationInProgress(false);
    } else {
      toast.error("Failed to delete unit!...");
      setMutationInProgress(false);
    }
  };

  return (
    <div className="p-3 border bg-blue-100 rounded shadow-md flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3">
        <div className="flex justify-between items-center gap-2">
          <p className="text-base font-semibold"># of BedRooms</p>
          <p className="font-semibold text-blue-600 text-2xl">
            {unit.noOfBedRooms}
          </p>
        </div>

        <div className="flex justify-between items-center gap-2">
          <p className="text-base font-semibold"># of BathRooms</p>
          <p className="font-semibold text-blue-600 text-2xl">
            {unit.noOfBathRooms}
          </p>
        </div>

        <div className="flex justify-between items-center gap-2">
          <p className="text-base font-semibold">Area</p>
          <p className="font-semibold text-blue-600 text-2xl">{unit.area}</p>
        </div>

        <div className="flex justify-between items-center gap-2">
          <p className="text-base font-semibold">Rent</p>
          <p className="font-semibold text-blue-600 text-2xl">{unit.rent}</p>
        </div>

        {isModalOpen ? (
          <AddEditUnits
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            unit={unit}
            setIsUpdated={setIsUpdated}
          />
        ) : (
          <></>
        )}
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
            deleteUnit({
              UnitID: unit.UnitID,
            });
          }}
          className={`text-red-600 text-xl cursor-pointer ${
            mutationInProgress ? " animate-spin" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default function Units({ label }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState(null);
  const [isUpdated, setIsUpdated] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    getData("getUnits")
      .then((data) => {
        setUnits(data);
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
          <p>Add new unit</p>
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : units && units.length > 0 ? (
        <div className="grid grid-cols-5 gap-3">
          {units.map((unit) => (
            <Unit
              unit={unit}
              units={units}
              setUnits={setUnits}
              setIsUpdated={setIsUpdated}
            />
          ))}
        </div>
      ) : (
        <p className="flex justify-center text-xl">No units found...</p>
      )}

      {isModalOpen ? (
        <AddEditUnits
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          unit={null}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
