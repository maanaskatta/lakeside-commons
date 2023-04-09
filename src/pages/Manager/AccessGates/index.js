import React, { useState, useEffect } from "react";
import { MdAddCircleOutline, MdOutlineLocationOn } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsPencil, BsTrash } from "react-icons/bs";
import AddEditAccessGate from "./AddEditAccessGate";
import Loading from "../../../components/Loading";
import NoDataText from "../../../components/NoDataText";
import getData from "../RouteControllers/getData";
import deleteData from "../RouteControllers/deleteData";
import { toast } from "react-toastify";

const Gate = ({ gate, gates, setGates, setIsUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const deleteGate = async (data) => {
    setMutationInProgress(true);
    let res = await deleteData("deleteAccessGate", data);
    if (res) {
      toast.success("Access gate deleted successfully...");
      setGates(gates.filter((item) => item.gateID !== gate.gateID));
      setMutationInProgress(false);
    } else {
      toast.error("Failed to delete access gate!...");
      setMutationInProgress(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 border bg-blue-100 rounded shadow-md cursor-pointer">
      <div className="flex items-center gap-1">
        <MdOutlineLocationOn className="text-xl" />
        <p className="text-base">{gate.gateName}</p>
      </div>

      <div className="flex items-center gap-1">
        <RiLockPasswordLine className="text-xl" />
        <p className="font-semibold text-2xl">{gate.accessCode}</p>
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
            deleteGate({
              gateID: gate.gateID,
            });
          }}
          className={`text-red-600 text-xl cursor-pointer ${
            mutationInProgress ? " animate-spin" : ""
          }`}
        />
      </div>

      {isModalOpen ? (
        <AddEditAccessGate
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          gate={gate}
          setIsUpdated={setIsUpdated}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default function AccessGates({ label }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gates, setGates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    getData("getAccessGates")
      .then((data) => {
        setGates(data);
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
          <p>Add new gate</p>
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : gates && gates.length > 0 ? (
        <div className="grid grid-cols-5 gap-3">
          {gates.map((gate) => (
            <Gate
              gate={gate}
              gates={gates}
              setGates={setGates}
              setIsUpdated={setIsUpdated}
            />
          ))}
        </div>
      ) : (
        <NoDataText message={"No access gates found!..."} />
      )}

      {isModalOpen ? (
        <AddEditAccessGate
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          gate={null}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
